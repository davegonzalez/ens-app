import { gql } from '@apollo/client';
import client from 'apollo-client';

export enum OrderBy {
  DESC = 'desc',
  ASC = 'asc',
}

export const searchDomains = gql`
  query searchDomains($first: Int, $where: Domain_filter) {
    domains(first: $first, where: $where) {
      id
      name
      labelhash
    }
  }
`;

export const searchRegistrations = gql`
  query getRegistrations($first: Int, $orderDirection: String) {
    registrations(
      first: $first
      orderDirection: $orderDirection
      orderBy: registrationDate
    ) {
      domain {
        name
      }
      id
      registrationDate
    }
  }
`;

export const fetchRecentlyRegisteredDomains = async (
  first = 10,
  orderDirection = OrderBy.DESC
) =>
  client.query({
    query: searchRegistrations,
    variables: {
      first,
      orderDirection,
    },
  });
