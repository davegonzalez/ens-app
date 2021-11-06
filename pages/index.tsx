import { useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import {
  fetchRecentlyRegisteredDomains,
  searchRegistrations,
  OrderBy,
  searchDomains,
} from 'gql/recentRegistrationsQuery';
import { useLazyQuery } from '@apollo/client';

const RainbowText = styled.div`
  background: linear-gradient(to right, #a1e14e, #327bfd);
  font-size: 30px;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const mapRegistrationToDomainStructure = (data) => ({
  name: data.domain?.name,
  id: data.domain?.id,
});

export async function getServerSideProps() {
  const { data } = await fetchRecentlyRegisteredDomains();

  if (!data) {
    return {
      notFound: true,
    };
  }

  const domains = data.registrations.map(mapRegistrationToDomainStructure);

  return {
    props: { domains: [...domains] }, // will be passed to the page component as props
  };
}

const Home: NextPage = ({ domains }) => {
  const [ensData, setEnsData] = useState(domains);
  const [search] = useLazyQuery(searchDomains, {
    onCompleted(data) {
      setEnsData(data.domains);
    },
  });

  return (
    <div>
      <input
        type='text'
        onChange={(e) =>
          search({ variables: { first: 5, where: { name_contains: e.target.value } } })
        }
      />
      <button>sort a-z</button>
      <button>sort z-a</button>
      <button>newest to oldest</button>
      <button>oldest to newest</button>
      {ensData.map((domain: any) => {
        return <RainbowText key={Math.random()}>{domain.name}</RainbowText>;
      })}
    </div>
  );
};

export default Home;
