import { deriveMapFromArray } from '@libs/utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { NestDataLoader } from '@src/libs/types/loader.interface';
import * as DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { ApartmentLocation } from '../model/apartment-location.entity';

export class ApartmentLocationLoader implements NestDataLoader {
  constructor(
    @InjectRepository(ApartmentLocation)
    private apartmentLocationRepo: Repository<ApartmentLocation>,
  ) {}
  generateDataLoader(): DataLoader<any, any> {
    return new DataLoader(async (locationIds: number[]) =>
      this.apartmentLocationByIds(locationIds),
    );
  }

  async apartmentLocationByIds(locationIds: number[]) {
    const apartmentLocation = await this.apartmentLocationRepo.find({
      where: {
        id: In(locationIds),
      },
    });

    const apartmentLocationMap = deriveMapFromArray(
      apartmentLocation,
      (item) => item.id,
    );

    return locationIds.map((e) => apartmentLocationMap.get(e));
  }
}
