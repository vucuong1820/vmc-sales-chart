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
  const [rowsOfSlackTest, setRowsOfSlackTest] = useState([
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
      return theme.reduce((prev, cur) => {
        if (!prev[0] && !prev[1] && !prev[2]) {
          prev[0] = "";
          prev[1] = 0;
          prev[2] = 0;
        }
        prev[0] = cur.name;
        prev[1] = cur.review;
        prev[2] += cur.sales;
        return prev;
      }, []);
    });

    result.map((result) => {
      data.forEach((test) => {
        if (result[0] === test[0]) {
          result[1] = test[1];
          result[2] = test[2];
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
        // Test
        const filterData = [];
        await Promise.all(
          themeShop.map(async (theme) => {
            const { data } = await axios.get(`/api/crawl?shop=${theme.name}`);
            filterData.push(data);
          })
        );

        const testResult = [...rowsOfSlackTest];
        const testData = filterData.map((theme) => {
          return theme.reduce((prev, cur) => {
            if (!prev[0] && !prev[1] && !prev[2]) {
              prev[0] = "";
              prev[1] = 0;
              prev[2] = 0;
            }
            prev[0] = cur.name;
            prev[1] = cur.review;
            prev[2] += cur.sales;
            return prev;
          }, []);
        });

        testResult.map((result) => {
          testData.forEach((test) => {
            if (result[0] === test[0]) {
              result[1] = test[1];
              result[2] = test[2];
            }
          });
        });

        testResult.sort((a, b) => {
          return b[2] - a[2];
        });
        setRowsOfSlackTest(testResult);
        console.log(rowsOfSlackTest);
        // Test

        // themeShop.forEach(async (item) => {
        //   const { data } = await axios.get(`/api/crawl?shop=${item.name}`);
        //   const result = [...rowsOfSlack];
        //   result.forEach((item1) => {
        //     data.forEach((item2) => {
        //       if (item1[0] === item2.name) {
        //         item1[1] = item2.review;
        //         item1[2] += item2.sales;
        //       }
        //     });
        //   });
        //   result.sort((a, b) => {
        //     return b[2] - a[2];
        //   });
        //   setRowsOfSlack(result);
        // });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  const handleClick = () => {
    sendAlert(buildAlert(rowsOfSlackTest));
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
