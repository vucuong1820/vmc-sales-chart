import { AppProvider, Page } from "@shopify/polaris";
import Table from "../components/Table";
const Home = () => {
  return (
    <AppProvider>
      <Page title="DashBoard">
        <Table />
      </Page>
    </AppProvider>
  );
};

export default Home;
