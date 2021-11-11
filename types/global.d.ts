declare global {
  interface Window {
    ethereum: EthereumProvider;
  }
}

let ethereum = window.ethereum;
