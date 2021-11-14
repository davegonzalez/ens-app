import { useState } from 'react';
import { Domain } from 'types';

/**
 * I went a few different routes when implementing this filtering and sorting, and this is where
 * I landed due to simplicity.
 *
 * First, I considered using graphql requests to handle the filtering and sorting; I decided against
 * that since we're not concerned with pagination for this app. Issuing extra gql requests to handle
 * it at this level felt too expensive.
 *
 * Secondly, implementation details of the sorting algo:
 * - I learned about using `localCompare` through a stackoverflow post. It's more readable than the following
 * kind of sort algorithm:
 * ===================================
 * if (a[key] < b[key]) return -1
 * if (a[key] > b[key]) return 1
 * return 0
 * ====================================
 * The downside to using localCompare is that it's currently slower; but we can consider that a
 * micro-optimization for this exercise.
 *
 * Thirdly, I like to nerd out on functional programming concepts and almost used that here,
 * i.e. setEnsData(reverse(sort('name')))
 * but felt like that might look a little too weird when I should really just
 * be focusing on readability.
 *
 */

export const useSort = (domains: Domain[]) => {
  const [ensData, setEnsData] = useState(domains);

  const sort = (type: string) => {
    return [...ensData].sort((a, b) =>
      a[type as keyof Domain].localeCompare(b[type as keyof Domain])
    );
  };

  const sortAsc = () => setEnsData(sort('name').reverse());

  const sortDesc = () => setEnsData(sort('name'));

  const sortOldToNew = () => setEnsData(sort('registrationDate'));

  const sortNewToOld = () => setEnsData(sort('registrationDate').reverse());

  return {
    ensData,
    setEnsData,
    sortAsc,
    sortDesc,
    sortOldToNew,
    sortNewToOld,
  };
};
