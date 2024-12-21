import { GqlStringArrayResponse, PaginationRes } from '@libs/gql/gql-generator';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Loader } from '../../libs/decorators/loader.decorator';
import {
  GqlApartmentResponse,
  GqlApartmentsResponse,
} from './apartment.response';
import { ApartmentService } from './apartment.service';
import { CreateApartmentInput } from './input/create-apartment.input';
import { FindApartmentInput } from './input/find-apartment.input';
import {
  NullableApartmentFilterInput,
  NullableApartmentSortInput,
  NullablePaginatorInput,
} from './input/paginated-apartment.input';
import { ApartmentLocationLoader } from './loaders/apartment-location.loader';
import { ApartmentLocation } from './model/apartment-location.entity';
import { Apartment } from './model/apartment.entity';

/**
 * Presentation layer for Apartment-related operations
 */
@Resolver(Apartment)
export class ApartmentResolver {
  constructor(private readonly apartmentService: ApartmentService) {}

  /**
   * Creates a new apartment
   * @param input - The apartment creation data
   * @returns Newly created apartment
   */
  @Mutation(() => GqlApartmentResponse)
  async createApartment(
    @Args('input') input: CreateApartmentInput,
  ): Promise<Apartment> {
    return await this.apartmentService.createApartment(input);
  }

  /**
   * Retrieves a paginated list of apartments
   * @param filter - Filtering criteria for apartments
   * @param paginate - Pagination parameters
   * @param sort - Sorting criteria
   * @returns Paginated list of apartments
   */
  @Query(() => GqlApartmentsResponse)
  async Apartments(
    @Args() filter: NullableApartmentFilterInput,
    @Args() paginate: NullablePaginatorInput,
    @Args() sort: NullableApartmentSortInput,
  ): Promise<PaginationRes<Apartment>> {
    return this.apartmentService.apartments(
      filter.filter,
      paginate.paginate,
      sort.sort,
    );
  }

  /**
   * Retrieves a single apartment by ID
   * @param input - Contains the apartment ID to find
   * @returns The requested apartment
   */
  @Query(() => GqlApartmentResponse)
  async Apartment(
    @Args('input') input: FindApartmentInput,
  ): Promise<Apartment> {
    return this.apartmentService.apartment(input.apartmentId);
  }

  @Query(() => GqlStringArrayResponse)
  countries() {
    return this.apartmentService.countries();
  }

  /**
   * Resolves the location field for an apartment
   * @param apartment - The apartment entity
   * @returns The location of the apartment
   */
  @ResolveField(() => ApartmentLocation)
  async location(
    @Parent() apartment: Apartment,
    @Loader(ApartmentLocationLoader)
    apartmentLocationLoader: DataLoader<any, any>,
  ) {

    if (apartment.location) {
      return apartment.location;
    }
    return apartmentLocationLoader.load(apartment.locationId);
  }
}
