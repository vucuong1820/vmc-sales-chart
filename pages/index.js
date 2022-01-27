import { AppProvider, Button, Layout, Page } from "@shopify/polaris";
import Chart from "../components/Chart/Chart";
import Table from "../components/Table";
const Home = () => {
  // const handleClick = () => {};
  return (
    <AppProvider>
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
