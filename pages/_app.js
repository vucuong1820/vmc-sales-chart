import '../styles/globals.css';
import '@shopify/polaris/build/esm/styles.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Minimog Analytics</title>
        <link rel="shortcut icon" href="/minimog.png" />
      </Head>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
