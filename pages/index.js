import CompareChart from '@components/CompareChart';
import Loading from '@components/layout/Loading';
import SaleGrowthChart from '@components/SalesGrowth';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import { AppProvider, DisplayText, Frame, Layout, Page, Stack } from '@shopify/polaris';
import '@shopify/polaris-viz/build/esm/styles.css';
import en from '@shopify/polaris/locales/en.json';
import dynamic from 'next/dynamic';
import NotificationProvider from 'providers/NotificationProvider';
import { useEffect, useState } from 'react';
import crawlThemeShops from 'services/crawlThemeShops';
const PolarisVizProvider = dynamic(() => import('@shopify/polaris-viz').then((module) => module.PolarisVizProvider), { ssr: false });

function Home() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await crawlThemeShops();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <AppProvider i18n={en}>
      <PolarisVizProvider>
        <Frame>
          <NotificationProvider>
            <div style={{ padding: '3rem 0' }}>
              <Page>
                <Layout>
                  <Layout.Section>
                    {loading ? (
                      <Loading.Center size="large" />
                    ) : (
                      <>
                        <div style={{ paddingBottom: '2rem' }}>
                          <Stack>
                            <Stack.Item fill>
                              <DisplayText element="h1">
                                Analytics for
                                {process.env.NEXT_PUBLIC_PRODUCT === 'minimogwp' ? ' MinimogWP' : ' Minimog'}
                              </DisplayText>
                            </Stack.Item>
                          </Stack>
                        </div>
                        <SaleGrowthChart mode={CHART_GROWTH_MAPPING.SALES.key} />
                        <SaleGrowthChart mode={CHART_GROWTH_MAPPING.REVIEWS.key} />
                        <CompareChart />
                      </>
                    )}
                  </Layout.Section>
                </Layout>
              </Page>
            </div>
          </NotificationProvider>
        </Frame>
      </PolarisVizProvider>
    </AppProvider>
  );
}

export default Home;
