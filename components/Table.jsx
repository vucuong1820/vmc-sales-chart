import { Card, DataTable, Layout } from "@shopify/polaris";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { buildAlert, sendAlert } from "../helpers/utils";
import { themeShop } from "../constants/themeShop";
const Table = ({ state }) => {
  const [rowsUpdate, setRowsUpdate] = useState([
    ["Minimog", 0, 0],
    ["Wokiee", 0, 0],
    ["Kalles", 0, 0],
    ["Shella", 0, 0],
    ["Gecko", 0, 0],
    ["Ella", 0, 0],
  ]);

  const [rowsOfSlack, setRowsOfSlack] = useState([
    ["Minimog", 0, 0],
    ["Wokiee", 0, 0],
    ["Kalles", 0, 0],
    ["Shella", 0, 0],
    ["Gecko", 0, 0],
    ["Ella", 0, 0],
  ]);

  const [title, setTitle] = useState("");

  useEffect(() => {
    let filterData = [];

    for (let i = 0; i < themeShop.length; i++) {
      filterData.push(state.filter((item) => themeShop[i].name === item.name));
    }

    const result = [...rowsUpdate];

    const data = filterData.map((theme) => {
      return theme.reduce(
        (prev, cur) => {
          prev[0] = cur.name;
          prev[1] = cur.review;
          prev[2] += cur.sales;
          return prev;
        },
        ["", 0, 0]
      );
    });

    result.map((result) => {
      data.forEach((item) => {
        if (result[0] === item[0]) {
          result[1] = item[1];
          result[2] = item[2];
        }
      });
    });

    result.sort((a, b) => {
      return b[2] - a[2];
    });
    setRowsUpdate(result);

    //Setting up title of table
    const filterDate = [
      ...new Map(
        state.map((item) => [item.created_at, item.created_at])
      ).values(),
    ];
    let startingText = "Table of sales in ";
    setTitle((prev) => {
      if (filterDate.length === 0) {
        prev = startingText;
      } else if (filterDate.length === 1) {
        prev = startingText + filterDate[0];
      } else {
        prev =
          startingText +
          filterDate[0] +
          " to " +
          filterDate[filterDate.length - 1];
      }
      return prev;
    });
  }, [state]);

  //Data of Sending to Slack
  useEffect(() => {
    const getData = async () => {
      try {
        const filterData = [];
        await Promise.all(
          themeShop.map(async (theme) => {
            const { data } = await axios.get(`/api/crawl?shop=${theme.name}`);
            filterData.push(data);
          })
        );

        const result = [...rowsOfSlack];
        const data = filterData.map((theme) => {
          return theme.reduce(
            (prev, cur) => {
              prev[0] = cur.name;
              prev[1] = cur.review;
              prev[2] += cur.sales;
              return prev;
            },
            ["", 0, 0]
          );
        });

        result.map((result) => {
          data.forEach((item) => {
            if (result[0] === item[0]) {
              result[1] = item[1];
              result[2] = item[2];
            }
          });
        });

        result.sort((a, b) => {
          return b[2] - a[2];
        });
        setRowsOfSlack(result);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  const handleClick = () => {
    sendAlert(buildAlert(rowsOfSlack));
  };

  return (
    <Layout.Section fullWidth>
      <Card
        title={title}
        sectioned
        actions={[{ content: "Post to Slack", onAction: () => handleClick() }]}
      >
        <DataTable
          columnContentTypes={["text", "numeric", "numeric"]}
          headings={["Name", "Rating", "Sales"]}
          rows={rowsUpdate}
        />
      </Card>
    </Layout.Section>
  );
};

export default Table;
