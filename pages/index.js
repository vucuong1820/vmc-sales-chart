import CompareChart from '@components/CompareChart';
import SaleGrowthChart from '@components/SalesGrowth';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import autoCrawl from '@services/autoCrawl';
import { AppProvider, DisplayText, Layout, Page, Stack } from '@shopify/polaris';
import '@shopify/polaris-viz/build/esm/styles.css';
import en from '@shopify/polaris/locales/en.json';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import crawlThemeShops from 'services/crawlThemeShops';
const PolarisVizProvider = dynamic(() => import('@shopify/polaris-viz').then((module) => module.PolarisVizProvider), { ssr: false });

function Home() {
  useEffect(() => {
    (async () => {
      await autoCrawl();
      await crawlThemeShops();
    })();
  }, []);

  return (
    <AppProvider i18n={en}>
      <PolarisVizProvider>
        <div style={{ padding: '3rem 0' }}>
          <Page>
            <Layout>
              <Layout.Section>
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
              </Layout.Section>
            </Layout>
          </Page>
        </div>
      </PolarisVizProvider>
    </AppProvider>
  );
}

export default Home;
