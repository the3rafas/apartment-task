import { ApartmentsDocument, ApartmentsQueryVariables } from "@/gql/graphql";
import { executeGraphQL } from "../graphql";

export async function apartmentsAction(variables: ApartmentsQueryVariables) {
  const { data } = await executeGraphQL(ApartmentsDocument, {
    variables,
  });
 return data
}
