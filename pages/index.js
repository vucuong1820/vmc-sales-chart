import CompareChart from '@components/CompareChart';
import Options from '@components/Options';
import SaleGrowthChart from '@components/SalesGrowth';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import { getDateRange } from '@helpers/utils';
import { AppProvider, DisplayText, Layout, Page, Stack } from '@shopify/polaris';
import '@shopify/polaris-viz/build/esm/styles.css';
import en from '@shopify/polaris/locales/en.json';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import crawlThemeShops from 'services/crawlThemeShops';
const PolarisVizProvider = dynamic(() => import('@shopify/polaris-viz').then((module) => module.PolarisVizProvider), { ssr: false });

function Home() {
  const [selectedDates, setSelectedDates] = useState(getDateRange('this_week'));

  useEffect(() => {
    (async () => {
      try {
        await crawlThemeShops();
      } catch (error) {
        // console.log(error);
      }
    })();
  }, []);

  const handleChange = ({ selectedDates }) => {
    if (selectedDates) setSelectedDates(selectedDates);
  };
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
                      <DisplayText>
                        Analytics for
                        {process.env.NEXT_PUBLIC_PRODUCT === 'minimogwp' ? 'MinimogWP' : 'Minimog'}
                      </DisplayText>
                    </Stack.Item>

                    <Stack.Item>
                      <Options dates={selectedDates} handleChange={handleChange} />
                    </Stack.Item>
                  </Stack>
                </div>
                <CompareChart selectedDates={selectedDates} />
                <SaleGrowthChart dates={selectedDates} mode={CHART_GROWTH_MAPPING.SALES.key} />
                <SaleGrowthChart dates={selectedDates} mode={CHART_GROWTH_MAPPING.REVIEWS.key} />
              </Layout.Section>
            </Layout>
          </Page>
        </div>
      </PolarisVizProvider>
    </AppProvider>
  );
}

export default Home;
