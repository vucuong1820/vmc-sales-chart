import { AppProvider, Layout, Page, Card } from "@shopify/polaris";
import Chart from "../components/Chart";
import SaleGrowthChart from "../components/SalesGrowth";
import {useEffect} from "react";
import {themeShop} from "../constants/themeShop";
import axios from "axios";
const Home = () => {
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
  return (
    <AppProvider>
      <div style={{padding: '3rem 0'}}>
        <Page>
          <Layout>
            <Layout.Section>
              <Chart />
              <SaleGrowthChart />
            </Layout.Section>
          </Layout>
        </Page>
      </div>
    </AppProvider>
  );
};

export default Home;
