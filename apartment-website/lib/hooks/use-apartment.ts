// import { useState } from 'react';

import {
  ApartmentsDocument,
  ApartmentsQuery,
  ApartmentsQueryVariables,
} from '../../gql/graphql';
import { executeGraphQL } from '../graphql';

let apartments: any = {
  items: [],
  pageInfo: {
    page: 1,
    limit: 9,
    totalCount: 0,
  },
};
export default function useApartmentFactory(): {
  apartments: ApartmentsQuery['Apartments']['data'];
  apartmentsFetch: (input?: ApartmentsQueryVariables) => Promise<void>;
} {
  async function apartmentsFetch(
    input: ApartmentsQueryVariables = { paginate: { limit: 9 } }
  ) {
    const { data } = await executeGraphQL(ApartmentsDocument, {
      variables: input,
    });
    apartments = data?.Apartments.data!;
  }

  return { apartmentsFetch, apartments };
}
