import { IsNotBlank } from '@libs/utils/validators/is-blank.validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, MaxLength } from 'class-validator';

/**
 * Input type for creating an apartment
 */
@InputType()
export class CreateApartmentInput {
  /**
   * Name of the apartment
   */
  @IsNotBlank({ message: 'Name is required and cannot accept white spaces' })
  @MaxLength(50, { message: 'Name must be less than 50 characters' })
  @Field(() => String, {
    description:
      'Name of the apartment. Must be less than 50 characters and cannot be blank.',
  })
  name!: string;
  /**
   * Description of the apartment
   */
  @IsNotBlank({
    message: 'Description is required and cannot accept white spaces',
  })
  @MaxLength(250, { message: 'Description must be less than 250 characters' })
  @Field(() => String, {
    description:
      'Description of the apartment. Must be less than 50 characters and cannot be blank.',
  })
  description!: string;

  /**
   * Name of the project the apartment belongs to
   */
  @IsNotBlank({
    message: 'Project Name is required and cannot accept white spaces',
  })
  @MaxLength(50, { message: 'Project Name must be less than 50 characters' })
  @Field(() => String, {
    description:
      'Name of the project the apartment belongs to. Must be less than 50 characters and cannot be blank.',
  })
  projectName!: string;

  /**
   * The unit number of the apartment
   */
  @IsNumber()
  @Field(() => Int, { description: 'The number of a department unit' })
  public unitNumber!: number;

  /**
   * Country where the apartment is located
   */
  @IsNotBlank({ message: 'Country is required and cannot accept white spaces' })
  @Field(() => String, {
    description: 'Country where the apartment is located. Cannot be blank.',
  })
  country!: string;

  /**
   * City where the apartment is located
   */
  @IsNotBlank({ message: 'City is required and cannot accept white spaces' })
  @Field(() => String, {
    description: 'City where the apartment is located. Cannot be blank.',
  })
  city!: string;

  /**
   * Area of the apartment (optional)
   */
  @IsOptional()
  @IsNotBlank({ message: 'Area is required and cannot accept white spaces' })
  @Field(() => String, {
    nullable: true,
    description: 'Area of the apartment. Cannot be blank if provided.',
  })
  area?: string;

  /**
   * Detailed address information of the apartment
   */
  @IsNotBlank({
    message: 'Address information is required and cannot accept white spaces',
  })
  @MaxLength(500, {
    message: 'Address information must be less than 500 characters',
  })
  @Field(() => String, {
    description:
      'Detailed address information of the apartment. Must be less than 500 characters and cannot be blank.',
  })
  addressInfo!: string;

  /**
   * Specifications and details of the apartment
   */
  @IsNotBlank({
    message:
      'Apartment specifications is required and cannot accept white spaces',
  })
  @MaxLength(1000, {
    message: 'Apartment specifications must be less than 1000 characters',
  })
  @Field(() => String, {
    description:
      'Specifications and details of the apartment. Must be less than 1000 characters and cannot be blank.',
  })
  specification!: string;
}
