import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentResolver } from './apartment.resolver';
import { ApartmentService } from './apartment.service';
import { ApartmentLocationLoader } from './loaders/apartment-location.loader';
import { ApartmentLocation } from './model/apartment-location.entity';
import { Apartment } from './model/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment, ApartmentLocation])],
  providers: [ApartmentResolver, ApartmentService, ApartmentLocationLoader],
  exports: [],
})
export class ApartmentModule {}
