import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@src/libs/db/base-model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApartmentLocation } from './apartment-location.entity';

/**
 * Entity representing an apartment in the system
 */
@Entity({
  name: 'apartments',
})
@ObjectType()
export class Apartment extends BaseModel {
  constructor(partial: Partial<Apartment>) {
    super(partial);
  }

  /**
   * The name of the apartment
   */
  @Field(() => String, { description: 'The name of the apartment' })
  @Column({ nullable: false })
  public name!: string;

  /**
   * The Description of the apartment
   */
  @Field(() => String, {
    description: 'Description of the apartment.',
  })
  @Column({
    nullable: false,
    default:
      'Discover your ideal apartment with our comprehensive listings. Explore detailed pages featuring amenities, photos, and neighborhood insights to find your perfect home.',
  })
  description!: string;

  /**
   * The name of the project this apartment belongs to
   */
  @Field(() => String, {
    description: 'The name of the project this apartment belongs to',
  })
  @Column({ nullable: false })
  public projectName!: string;

  /**
   * The unit number of the apartment
   */
  @Field(() => Int, { description: 'The number of a department unit' })
  @Column({ nullable: false })
  public unitNumber!: number;

  /**
   * Foreign key reference to the apartment's location
   */
  @Column({ nullable: false })
  public locationId!: number;

  /**
   * Relation to the ApartmentLocation entity
   */
  @ManyToOne(() => ApartmentLocation, { nullable: false })
  @JoinColumn({ name: 'locationId' })
  location!: ApartmentLocation;

  /**
   * The area of the apartment (optional)
   */
  @Field(() => String, {
    nullable: true,
    description: 'The area of the apartment',
  })
  @Column({ nullable: true })
  area?: string;

  /**
   * Detailed address information of the apartment
   */
  @Field(() => String, {
    description: 'Detailed address information of the apartment',
  })
  @Column({ nullable: false })
  public addressInfo!: string;

  /**
   * Specifications and features of the apartment
   */
  @Field(() => String, {
    description: 'Specifications and features of the apartment',
  })
  @Column({ nullable: false })
  public specifications!: string;
}
