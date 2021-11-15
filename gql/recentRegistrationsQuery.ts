import { gql } from '@apollo/client';
import client from 'apollo-client';

/**
 * An enum here might be unnecessary for now, but thought it might be useful
 * if we were to later add more queries that require desc/asc ordering to be defined.
 */
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

/**
 * So this method isn't being used anywhere; it's what I was trying to use in order to asynchronously get
 * a domain's registration date (see README).
 */

export const fetchRegistration = gql`
  query fetchRegistration($labelhash: ID) {
    registration(id: $labelhash) {
      registrationDate
    }
  }
`;

export const searchRegistrations = gql`
  query getRegistrations($first: Int, $orderDirection: String) {
    registrations(first: $first, orderDirection: $orderDirection, orderBy: registrationDate) {
      domain {
        name
      }
      id
      registrationDate
    }
  }
`;

export const fetchRecentlyRegisteredDomains = async (first = 10, orderDirection = OrderBy.DESC) =>
  client.query({
    query: searchRegistrations,
    variables: {
      first,
      orderDirection,
    },
  });
