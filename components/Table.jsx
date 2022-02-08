import { Card, DataTable, Layout } from "@shopify/polaris";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { buildAlert, sendAlert } from "../helpers/utils";
import { themeShop } from "../constants/themeShop";
const Table = () => {
  const [rows, setRows] = useState([
    ["Minimog", 0, 0],
    ["Wokiee", 0, 0],
    ["Kalles", 0, 0],
    ["Shella", 0, 0],
    ["Gecko", 0, 0],
    ["Ella", 0, 0],
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        themeShop.forEach(async (item) => {
          const { data } = await axios.get(`/api/crawl?shop=${item.name}`);
          const result = [...rows];
          result.forEach((item1) => {
            data.forEach((item2) => {
              if (item1[0] === item2.name) {
                item1[1] = item2.review;
                item1[2] += item2.sales;
              }
            });
          });
          result.sort((a, b) => {
            return b[2] - a[2];
          });
          setRows(result);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handleClick = () => {
    sendAlert(buildAlert(rows));
  };
  return (
    <Layout.Section fullWidth>
      <Card
        title="Table of sales in the week"
        sectioned
        actions={[{ content: "Post to Slack", onAction: () => handleClick() }]}
      >
        <DataTable
          columnContentTypes={["text", "numeric", "numeric"]}
          headings={["Name", "Rating", "Sales"]}
          rows={rows}
        />
      </Card>
    </Layout.Section>
  );
};

export default Table;
