import {AppProvider, Layout, Page, Card, Stack, DisplayText, TextStyle} from "@shopify/polaris";
import Chart from "../components/Chart";
import SaleGrowthChart from "../components/SalesGrowth";
import React, {useCallback, useEffect, useState} from "react";
import {themeShop} from "../constants/themeShop";
import axios from "axios";
import {getDateRange} from "../helpers/utils";
import Options from "../components/Options";
const Home = () => {
  const [selectedDates, setSelectedDates] = useState(getDateRange('this_week'));

  useEffect(() => {
    const getData = async () => {
      try {
        themeShop.forEach(async (item) => {
          await axios.get(`/api/crawl?theme=${item.name}`);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handleChange = ({selectedDates, compareDates}) => {
    if (selectedDates) setSelectedDates(selectedDates)
  }
  return (
    <AppProvider>
      <div style={{padding: '3rem 0'}}>
        <Page>
          <Layout>
            <Layout.Section>
              <div style={{paddingBottom: '2rem'}}>
                <Stack>
                  <Stack.Item fill>
                    <DisplayText>Analytics for Minimog</DisplayText>
                  </Stack.Item>

                  <Stack.Item>
                    <Options dates={selectedDates} handleChange={handleChange} />
                  </Stack.Item>
                </Stack>
              </div>
              <Chart selectedDates={selectedDates}  />
              <SaleGrowthChart selectedDates={selectedDates} />
            </Layout.Section>
          </Layout>
        </Page>
      </div>
    </AppProvider>
  );
};

export default Home;
