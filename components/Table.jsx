import { Card, DataTable, Layout } from "@shopify/polaris";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { buildAlert, sendAlert } from "../helpers/utils";
import { themeShop } from "../constants/themeShop";
const Table = ({ state }) => {
  const [rows, setRows] = useState([
    ["Minimog", 0, 0],
    ["Wokiee", 0, 0],
    ["Kalles", 0, 0],
    ["Shella", 0, 0],
    ["Gecko", 0, 0],
    ["Ella", 0, 0],
  ]);
  const [rowsUpdate, setRowsUpdate] = useState([
    ["Minimog", 0, 0],
    ["Wokiee", 0, 0],
    ["Kalles", 0, 0],
    ["Shella", 0, 0],
    ["Gecko", 0, 0],
    ["Ella", 0, 0],
  ]);
  useEffect(() => {
    let data = [];

    for (let i = 0; i < themeShop.length; i++) {
      data.push(state.filter((item) => themeShop[i].name === item.name));
    }
    data.forEach((theme) => {
      let sale = 0;
      let rating = 0;
      let name;
      const result = [...rowsUpdate];
      themeShop.forEach((item) => {
        for (let i = 0; i < theme.length; i++) {
          if (item.name === theme[i].name) {
            sale += theme[i].sales;
            rating = theme[i].review;
            name = item.name;
          }
        }
      });
      result.forEach((item) => {
        if (item[0] === name) {
          item[2] = sale;
          item[1] = rating;
        }
      });
      setRows(result);
    });
  }, [state]);
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
