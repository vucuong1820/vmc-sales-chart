import { themeChart } from '@constants/themeChart';
import { themeShop } from '@constants/themeShop';
import { dataSolving } from '@helpers/dataSolving';
import { sendAlert } from '@helpers/utils';
import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import getCompareChartData from 'services/getCompareChartData';

export default function useCompareChart({ selectedDates }) {
  const [datasets, setDatasets] = useState([]);
  const [rows, setRows] = useState(themeChart.map((theme) => [theme.label, 0, 0, 0]));

  useEffect(() => {
    (async () => {
      if (selectedDates) await handleChange();
    })();
  }, [selectedDates]);

  const handleChange = async () => {
    try {
      const result = await getCompareChartData(selectedDates);
      if (result) {
        formatData(result.items);
        let newDatasets = themeShop.map((theme) => {
          return {
            name: theme.name,
            data: result.items
              .filter((item) => item?.name === theme.name)
              .map((item) => ({
                key: item.created_at,
                value: item?.sales,
              })),
            color: theme.color,
          };
        });
        setDatasets(newDatasets);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const formatData = (data) => {
    const filterData = [];

    for (let i = 0; i < themeShop.length; i++) {
      filterData.push({
        items: data.filter((item) => themeShop[i].name === item.name),
        fixedSales: themeShop[i].fixedSales,
      });
    }

    setRows(dataSolving(rows, filterData));
  };

  const handleClick = () => {
    sendAlert(rows);
  };
  return {
    handleClick,
    rows,
    datasets,
  };
}
