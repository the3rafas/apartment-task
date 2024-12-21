import { Field, Int, ObjectType } from '@nestjs/graphql';

interface ClassType<T = any> {
  new (...args: any[]): T;
}

export interface IGqlSuccessResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T | PaginationRes<T>;
}
export interface PaginationRes<T> {
  items: T[];
  pageInfo: {
    page?: number;
    limit?: number;
    totalCount?: number;
  };
}

@ObjectType()
abstract class PageInfo {
  @Field((type) => Int, { nullable: true })
  page?: number;

  @Field((type) => Int)
  limit: number;

  @Field(() => Int, { nullable: true })
  totalCount?: number;
}

export function generateGqlResponseType<T, K>(
  TClass: ClassType<T> | ClassType<T>[],
  isRawArray?: K,
): any {
  interface DataSingleItemType {
    data: T;
  }

  interface DataPaginatedType {
    data: PaginationRes<T>;
  }

  interface DataTypeAsArray {
    data: T[];
  }

  type DataType = T extends string
    ? 'string'
    : T extends number
      ? 'number'
      : T extends boolean
        ? 'boolean'
        : T extends undefined
          ? 'undefined'
          : K extends boolean
            ? DataTypeAsArray
            : T extends any[]
              ? DataPaginatedType
              : DataSingleItemType;

  const filedType = isRawArray
    ? TClass
    : Array.isArray(TClass)
      ? generateGqlPaginationResponseType<T>(TClass)
      : TClass;
  const className = isRawArray
    ? `${TClass[0].name}sArray`
    : Array.isArray(TClass)
      ? `${TClass[0].name}s`
      : TClass.name;

  @ObjectType(`Gql${className}Response`)
  abstract class GqlResponse {
    @Field(() => filedType, {
      ...(isRawArray ? { nullable: 'itemsAndList' } : { nullable: true }),
    })
    data?: DataType;

    @Field(() => Int)
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
  }

  return GqlResponse;
}

function generateGqlPaginationResponseType<T>(TClass: ClassType<T>[]): any {
  @ObjectType(`Gql${TClass[0].name}sPagination`)
  abstract class GqlPaginationResponse {
    @Field(() => TClass, { nullable: 'itemsAndList' })
    items?: T[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }

  return GqlPaginationResponse;
}

export const GqlStringArrayResponse = generateGqlResponseType([String], true);
