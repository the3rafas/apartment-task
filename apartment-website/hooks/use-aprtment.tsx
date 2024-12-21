// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect } from 'react';
// import { ApartmentsDocument, ApartmentsQueryVariables } from '../gql/graphql';
// import { executeGraphQL } from '../lib/graphql';
// import { useStore } from '../store/index.tsx';

// function useToast() {
//   const { updateStore } = useStore();
//   const searchParams = useSearchParams();
//   async function apartmentsRequest(variables: ApartmentsQueryVariables) {
//     const { data } = await executeGraphQL(ApartmentsDocument, {
//       variables,
//     });
//     updateStore({
//       apartments: data?.Apartments.data!,
//       pageInfo: {
//         page: data?.Apartments.data?.pageInfo.page || 1,
//         limit: data?.Apartments.data?.pageInfo.page || 9,
//         totalCount: data?.Apartments?.data?.pageInfo?.totalCount || 0,
//         totalPage:
//           (data?.Apartments?.data?.pageInfo?.totalCount || 0) /
//           (data?.Apartments.data?.pageInfo.page || 9),
//       },
//     });
//   }
//   useEffect(() => {
//     (async function () {
//       await apartmentsRequest({
//         filter: {
//           searchKey: searchParams?.get('q') || '',
//         },
//         paginate: {
//           page: parseInt(searchParams?.get('page') || '1', 10) || 1,
//           limit: 9,
//         },
//       });
//     })();
//   }, []);

//   return {};
// }
