import { Field, ObjectType } from '@nestjs/graphql';
import { Ulid } from 'id128';
import {
  CreateDateColumn,
  DeepPartial,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Base model class that provides common fields and functionality for all entities
 */
@ObjectType()
export class BaseModel {
  /**
   * Constructor that copies properties from input object to the new instance
   * @param input Optional partial object containing initial property values
   */
  protected constructor(input?: DeepPartial<BaseModel>) {
    if (input) {
      for (const [key, descriptor] of Object.entries(
        Object.getOwnPropertyDescriptors(input),
      )) {
        if (descriptor.get && !descriptor.set) {
          // A getter has been moved to the entity instance
          // by the CalculatedPropertySubscriber
          // and cannot be copied over to the new instance.
          continue;
        }
        (this as any)[key] = descriptor.value;
      }
    }
  }

  /**
   * Unique identifier for the entity using ULID format
   */
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id: string = Ulid.toRaw(Ulid.generate());

  /**
   * Timestamp when the entity was created
   */
  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  /**
   * Timestamp when the entity was last updated
   */
  @Field(() => String)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
