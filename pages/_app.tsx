import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import Client from 'apollo-client';
import type { AppProps } from 'next/app';
import 'inter-ui/inter.css';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={Client}>
      <Head>
        <title>Search Registred ENS Domains</title>
        <meta name="description" content="ENS Domain Search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
