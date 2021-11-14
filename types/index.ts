export type Domain = {
  id: string;
  name: string;
  labelhash: string;
};

export type ENSData = {
  domain: {
    name: string;
  };
  id: string;
  registrationDate: number;
};

export type HomePageProps = {
  domains: [Domain];
};

export type Contract = {
  contract: {
    setENSName: Function;
  };
};
