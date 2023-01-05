import '../styles/globals.css';
import '@shopify/polaris/build/esm/styles.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Minimog Analytics</title>
      </Head>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
