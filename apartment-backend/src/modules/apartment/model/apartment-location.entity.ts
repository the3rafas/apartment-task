import { MinModel } from '@libs/db/min-model';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Unique } from 'typeorm';

/**
 * Entity representing the location of an apartment
 * Contains country and city information for  normalization throw database and analytics
 * Ensures unique combination of country and city
 */
@Entity({
  name: 'apartment_locations',
})
@Unique(['country', 'city'])
@ObjectType()
export class ApartmentLocation extends MinModel {
  constructor(partial: Partial<ApartmentLocation>) {
    super(partial);
  }

  /**
   * The country where the apartment is located
   */
  @Field(() => String, { description: 'The country where the apartment is located' })
  @Column({ nullable: false })
  country: string;

  /**
   * The city where the apartment is located
   */
  @Field(() => String, { description: 'The city where the apartment is located' })
  @Column({ nullable: false })
  city: string;
}
