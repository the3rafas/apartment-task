import { generateGqlResponseType } from '@libs/gql/gql-generator';
import { Apartment } from './model/apartment.entity';

// Generate GraphQL response type for single apartment
const GqlApartmentResponse = generateGqlResponseType(Apartment);
// Generate GraphQL response type for array of apartments
const GqlApartmentsResponse = generateGqlResponseType(Array(Apartment), false);

export { GqlApartmentResponse, GqlApartmentsResponse };
