import { ApolloProvider } from '@apollo/client';
import Client from '../apollo-client';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={Client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
