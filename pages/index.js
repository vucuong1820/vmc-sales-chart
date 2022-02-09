import { AppProvider, Layout, Page } from "@shopify/polaris";
import Chart from "../components/Chart/Chart";
import Table from "../components/Table";
import translations from "@shopify/polaris/locales/en.json";
const Home = () => {
  return (
    <AppProvider i18n={translations}>
      <Page title="DashBoard">
        <Layout>
          <Table />
          <Chart />
        </Layout>
      </Page>
    </AppProvider>
  );
};

export default Home;
