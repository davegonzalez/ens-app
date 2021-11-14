import { useState } from 'react';
import type { NextPage } from 'next';
import { useLazyQuery } from '@apollo/client';
import { Domain, ENSData, HomePageProps } from 'types';
import { useContract } from 'hooks/useContract';
import { useSort } from 'hooks/useSort';
import {
  fetchRecentlyRegisteredDomains,
  searchDomains,
  fetchRegistration,
} from 'gql/recentRegistrationsQuery';
import { Searchbar } from 'components/Input';
import { Pill } from 'components/Pill';
import { HorizontalList } from 'components/HorizontalList';
import { RainbowText } from 'components/RainbowText';
import { Main } from 'components/Main';
import { NoResults } from 'components/NoResults';

/**
 * The thought behind this function was that I wanted the data from the Domains
 * query and the Registrations query to match. Since this UI shows the data in the same manner,
 * I think it's easier to write the component when the data conforms to a particular structure.
 * Instead of setting up multiple conditionals throughout the component, we can just check for null/undefined
 * or set defaults.
 */
const registrationToDomainStructure = (data: ENSData) => ({
  name: data.domain?.name,
  id: data.id,
  registrationDate: new Date(data.registrationDate * 1000).toISOString(),
});

export async function getServerSideProps() {
  const { data } = await fetchRecentlyRegisteredDomains();

  if (!data) {
    return {
      notFound: true,
    };
  }

  const domains = data.registrations.map(registrationToDomainStructure);

  return {
    props: { domains: [...domains] },
  };
}

const Home: NextPage<HomePageProps> = ({ domains }) => {
  const [selected, setSelected] = useState<number>();
  const [searchText, setSearchText] = useState<string>('');

  const { contract } = useContract();
  const { ensData, setEnsData, sortAsc, sortDesc, sortOldToNew, sortNewToOld } =
    useSort(domains);

  const [searchAllDomains] = useLazyQuery(searchDomains, {
    onCompleted(data) {
      setEnsData(data.domains);
    },
  });

  const sendENSNameTransaction = async (name: string) => {
    await contract?.setENSName(name);
  };

  const noEnsData = ensData.length === 0;

  const filterTypes = [
    {
      method: sortAsc,
      text: 'Sort A-Z',
    },
    {
      method: sortDesc,
      text: 'Sort Z-A',
    },
    {
      method: sortNewToOld,
      text: 'Newest to Oldest',
    },
    {
      method: sortOldToNew,
      text: 'Oldest to Newest',
    },
  ];

  return (
    <Main>
      <Searchbar
        placeholder="Search for an ENS name"
        onChange={(e) => {
          setSearchText(e.target.value);

          searchAllDomains({
            variables: { first: 10, where: { name_contains: e.target.value } },
          });
        }}
      />
      <HorizontalList>
        {filterTypes.map((filter, index) => {
          return (
            <Pill
              key={index}
              selected={selected === filterTypes.indexOf(filterTypes[index])}
              onClick={() => {
                setSelected(index);
                filter.method();
              }}
            >
              {filter.text}
            </Pill>
          );
        })}
      </HorizontalList>
      {noEnsData && <NoResults>No results found for {searchText}</NoResults>}
      {ensData.map((domain: Domain) => {
        if (noEnsData) return <div />;

        return (
          <RainbowText
            key={domain.id}
            onClick={() => sendENSNameTransaction(domain.name)}
          >
            {domain.name}
          </RainbowText>
        );
      })}
    </Main>
  );
};

export default Home;

// const domainToStructure = async (domains: [Domain]) => {
//   const all = await Promise.all(
//     domains.map(async (domain) => {
//       getRegistration({
//         variables: {
//           labelhash: domain.labelhash,
//         },
//       });

//       // return regs;
//     })
//   );

//   console.log(all);
// };

// const [getRegistration] = useLazyQuery(fetchRegistration);

// domainToStructure(data.domains);
