import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { ethers } from 'ethers';
import { useLazyQuery } from '@apollo/client';
import { Domain, ENSData } from 'types';
import { RainbowText } from 'styles/root';
import abi from 'abi/index.json';
import {
  fetchRecentlyRegisteredDomains,
  searchDomains,
} from 'gql/recentRegistrationsQuery';

const CONTRACT_ADDRESS = '0xB6F71724FCa391fC6A247AD47e5Dc0207bd22bae';

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
    props: { domains: [...domains] }, // will be passed to the page component as props
  };
}

type Props = {
  domains: [Domain];
};

const Home: NextPage<Props> = ({ domains }) => {
  const [provider, setProvider] = useState({});
  const [contract, setContract] = useState({});
  const [ensData, setEnsData] = useState(domains);
  const [searchAllDomains] = useLazyQuery(searchDomains, {
    onCompleted(data) {
      domainToStructure(data.domains);
      setEnsData(data.domains);
    },
  });

  const domainToStructure = async (domains: [Domain]) => {
    Promise.all(
      domains.map(async (domain) => {
        const block = await provider.getBlockNumber(
          domain.events[0].blockNumber
        );

        console.log(block);
        const blockTxn = await provider.getBlock(block);
      })
    );

    // return domains.map(async (domain) => {
    // console.log(domain.events);

    // const block = await provider.getBlockNumber(domain.events[0].blockNumber);
    // const blockTxn = await provider.getBlock(block);

    // console.log(blockTxn.timestamp);

    //   return {
    //     name: domain.name,
    //     id: domain.id,
    //   };
    // });
  };

  const initContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    // @ts-ignore
    window.PROVIDE = provider;

    setProvider(provider);
    setContract(contract);
  };

  useEffect(() => {
    initContract();
  }, []);

  const sendENSNameTransaction = async (name: string) => {
    contract.setENSName(name);
  };

  const sort = (type: any) => {
    return [...ensData].sort((a, b) => a[type].localeCompare(b[type]));
  };

  const sortAsc = () => {
    const reversed = sort('name').reverse();

    setEnsData(reversed);
  };

  const sortDesc = () => {
    setEnsData(sort('name'));
  };

  const sortOldToNew = () => {
    setEnsData(sort('registrationDate'));
  };

  const sortNewToOld = () => setEnsData(sort('registrationDate').reverse());

  return (
    <div>
      <input
        type="text"
        onChange={(e) =>
          searchAllDomains({
            variables: { first: 10, where: { name_contains: e.target.value } },
          })
        }
      />
      <button onClick={sortAsc}>sort a-z</button>
      <button onClick={sortDesc}>sort z-a</button>
      <button onClick={sortNewToOld}>newest to oldest</button>
      <button onClick={sortOldToNew}>oldest to newest</button>
      {ensData.map((domain: Domain) => {
        return (
          <RainbowText
            key={domain.id}
            onClick={() => sendENSNameTransaction(domain.name)}
          >
            {domain.name} | {domain.registrationDate}
          </RainbowText>
        );
      })}
    </div>
  );
};

export default Home;
