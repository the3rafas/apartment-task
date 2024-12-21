import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class FindApartmentInput {
  @IsUUID()
  @Field(() => String)
  apartmentId!: string;
}
