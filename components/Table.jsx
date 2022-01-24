import { Button, Card, DataTable, Layout } from "@shopify/polaris";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const Table = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get("/api/customers");
      setData(data);
    };
    getData();
  }, [data]);

  const handleClick = async () => {
    try {
      const { data } = await axios.get("/api/crawl");
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const rows = [];

  data.map((item) => {
    rows.push([item.name, item.quantity]);
  });
  return (
    <Layout>
      <Layout.Section>
        <Card title="Table of sales in the week" sectioned>
          <DataTable
            columnContentTypes={["text", "numeric"]}
            headings={["Name", "Sales"]}
            rows={rows}
          />
          <div style={{ textAlign: "center" }}>
            <Button onClick={handleClick}>Update</Button>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export default Table;
