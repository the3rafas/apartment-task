import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { SortEnum } from '../apartment.enum';

/**
 * Input type for filtering apartments based on various criteria
 */
@InputType()
export class ApartmentFilterInput {
  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description: 'Name of the country to filter apartments',
  })
  country?: string;

  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description: 'Search key to filter apartments by name or project name',
  })
  searchKey?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, {
    nullable: true,
    description: 'Number of a department unit to filter apartments by',
  })
  unitNumber?: number;
}

/**
 * Args type wrapper for optional apartment filter input
 */
@ArgsType()
export class NullableApartmentFilterInput {
  @Field({ nullable: true, description: 'Filter options for apartments' })
  @IsOptional()
  @ValidateNested()
  filter?: ApartmentFilterInput;
}

/**
 * Input type for pagination parameters
 */
@InputType()
export class PaginatorInput {
  @Min(1)
  @Field({
    defaultValue: 1,
    description: 'Page number for pagination, starts from 1',
  })
  page?: number;

  @Min(1)
  @Field({ defaultValue: 10, description: 'Number of items per page' })
  limit?: number;
}

/**
 * Args type wrapper for optional pagination input
 */
@ArgsType()
export class NullablePaginatorInput {
  @Field({ nullable: true, description: 'Pagination options' })
  @IsOptional()
  @ValidateNested()
  paginate?: PaginatorInput;
}

/**
 * Input type for sorting apartment results
 */
@InputType()
export class ApartmentSortInput {
  @IsOptional()
  @Field(() => SortEnum, {
    nullable: true,
    defaultValue: SortEnum.DESC,
    description: 'Sort order for createdAt field',
  })
  @IsEnum(SortEnum)
  createdAt?: SortEnum;
}

/**
 * Args type wrapper for optional sorting input
 */
@ArgsType()
export class NullableApartmentSortInput {
  @Field({ nullable: true, description: 'Sorting options for apartments' })
  @IsOptional()
  @ValidateNested()
  sort?: ApartmentSortInput;
}
