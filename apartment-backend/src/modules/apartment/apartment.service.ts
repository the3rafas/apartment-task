import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { PaginationRes } from '../../libs/gql/gql-generator';
import { readableText } from '../../libs/utils/utils';
import { SortEnum } from './apartment.enum';
import { CreateApartmentInput } from './input/create-apartment.input';
import {
  ApartmentFilterInput,
  ApartmentSortInput,
  PaginatorInput,
} from './input/paginated-apartment.input';
import { ApartmentLocation } from './model/apartment-location.entity';
import { Apartment } from './model/apartment.entity';
/**
 * dal layer responsible for managing apartment-related operations with database
 */
@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentRepo: Repository<Apartment>,
    @InjectRepository(ApartmentLocation)
    private apartmentLocationRepo: Repository<ApartmentLocation>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Creates a new apartment with the provided input
   * @param input The apartment creation input data
   * @returns Promise containing the created apartment
   */
  public async createApartment(
    input: CreateApartmentInput,
  ): Promise<Apartment> {
    const apartmentLocation = await this.createApartmentLocation(input);

    const apartment = new Apartment({
      name: readableText(input.name),
      projectName: readableText(input.projectName),
      addressInfo: readableText(input.addressInfo),
      specifications: readableText(input.specification),
      area: input.area ? readableText(input.area) : null,
      locationId: apartmentLocation.id,
      location: apartmentLocation,
      unitNumber: input.unitNumber,
    });
    await this.apartmentRepo.insert(apartment);
    return apartment;
  }

  /**
   * Retrieves paginated apartments based on filter, pagination, and sort criteria
   * @param filter Filter criteria for apartments
   * @param paginate Pagination parameters
   * @param sort Sorting parameters
   * @returns Promise containing paginated apartment results
   */
  public async apartments(
    filter: ApartmentFilterInput = {},
    paginate: PaginatorInput = { page: 1, limit: 10 },
    sort: ApartmentSortInput = { createdAt: SortEnum.DESC },
  ): Promise<PaginationRes<Apartment>> {
    const queryBuilder = this.apartmentRepo.createQueryBuilder('apartment');

    // Apply search filter if searchKey is provided
    if (filter.searchKey) {
      queryBuilder
        .where('apartment.name ILIKE :searchKey', {
          searchKey: `%${filter.searchKey}%`,
        })
        .orWhere('apartment.projectName ILIKE :searchKey', {
          searchKey: `%${filter.searchKey}%`,
        });
    }
    // Filter by country if country is provided
    if (filter.country) {
      queryBuilder
        .leftJoinAndSelect('apartment.location', 'location')
        .andWhere('location.country = :country', {
          country: filter.country,
        });
    }
    // Filter by unit number if it is provided
    if (filter.unitNumber) {
      queryBuilder.andWhere('apartment.unitNumber = :unit', {
        unit: filter.unitNumber,
      });
    }

    // Apply sorting
    Object.entries(sort).forEach(([key, value]) => {
      queryBuilder.addOrderBy(`apartment.${key}`, value);
    });

    // Apply pagination
    queryBuilder
      .take(paginate.limit)
      .skip((paginate.page - 1) * paginate.limit);

    const [items, itemCount] = await queryBuilder.getManyAndCount();

    return {
      items: items,
      pageInfo: {
        page: paginate.page,
        limit: paginate.limit,
        totalCount: itemCount,
      },
    };
  }

  /**
   * Retrieves a specific apartment by ID
   * @param apartmentId The ID of the apartment to retrieve
   * @returns Promise containing the found apartment
   * @throws Error if apartment is not found
   */
  public async apartment(apartmentId: string): Promise<Apartment> {
    const apartment = await this.apartmentRepo.findOne({
      where: {
        id: apartmentId,
      },
      relations: ['location'],
    });
    if (!apartment) {
      throw new Error('Apartment not found');
    }

    return apartment;
  }

  /**
   * Retrieves a list of unique countries from apartment locations
   * First checks the cache for existing countries list
   * If not found in cache, fetches from database and updates cache
   * @returns Promise<string[]> Array of country names
   */
  async countries(): Promise<string[]> {
    // Try to get countries from cache first
    const cashedCountries = (await this.cacheManager.get('countries')) as
      | string[]
      | undefined;

    // If countries exist in cache, return them
    if (cashedCountries?.length) {
      return cashedCountries;
    }

    // If not in cache, fetch all locations from database
    const locations = await this.apartmentLocationRepo.find();

    // Extract unique country names from locations
    const countries = new Set<string>(
      locations.map((location) => location.country),
    );

    // Store countries in cache for future requests with a TTL of 2 hours
    await this.cacheManager.set('countries', [...countries], 7200);
    return [...countries];
  }

  /**
   * Creates or retrieves an apartment location based on city and country
   * @param input Object containing city and country information
   * @returns Promise containing the apartment location
   */
  /**
   * Creates a new apartment location or retrieves an existing one
   * @param input Object containing city and country information
   * @returns Promise<ApartmentLocation> The created or existing apartment location
   */
  private async createApartmentLocation(input: {
    city: string;
    country: string;
  }) {
    // Check if location already exists in database
    const existingApartmentLocation = await this.apartmentLocationRepo.findOne({
      where: {
        city: readableText(input.city),
        country: readableText(input.country),
      },
    });
    // Return existing location if found
    if (existingApartmentLocation) return existingApartmentLocation;

    // Create new apartment location if not found
    const apartmentLocation = new ApartmentLocation({
      city: readableText(input.city),
      country: readableText(input.country),
    });

    // Get cached countries list
    const cashedCountries = (await this.cacheManager.get('countries')) as
      | string[]
      | undefined;

    // Update cache with new country if cache exists
    if (cashedCountries?.length) {
      await this.cacheManager.set(
        'countries',
        [...cashedCountries, apartmentLocation.country],
        7200,
      );
    }

    // Save new location to database
    await this.apartmentLocationRepo.insert(apartmentLocation);
    return apartmentLocation;
  }
}
