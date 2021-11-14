import { ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import abi from 'abi/index.json';
import { useState, useEffect } from 'react';

/**
 * Typically I'd set something like this as an environment variable so that it's easy
 * to switch out if we needed to. Due to the smaller scope of this project, I decided to just
 * make it a constant instead.
 */
const CONTRACT_ADDRESS = '0xB6F71724FCa391fC6A247AD47e5Dc0207bd22bae';

export const useContract = () => {
  /**
   * I followed the suggestion in the README files for each of these submodules -
   * useState/typescript was not happy with trying to implicitly decipher the correct types
   * so when I call provider?.send or contract.setEnsName, it would error. I had to dig into the
   * ethers packages to figure out that I could import these types separately.
   */
  const [provider, setProvider] = useState<Web3Provider>();
  const [contract, setContract] = useState<Contract>();

  const initContract = async () => {
    const ethersProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = ethersProvider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    setProvider(ethersProvider);
    setContract(contract);
  };

  useEffect(() => {
    initContract();
  }, []);

  return {
    provider,
    contract,
  };
};
