import { themeChart } from '@constants/themeChart';
import { themeShop } from '@constants/themeShop';
import { dataSolving } from '@helpers/dataSolving';
import { sendAlert } from '@helpers/utils';
import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function useCompareChart({ selectedDates }) {
  const [datasets, setDatasets] = useState([]);
  const [rows, setRows] = useState(themeChart.map((theme) => [theme.label, 0, 0, 0]));

  useEffect(() => {
    (async () => {
      if (selectedDates) await handleChange();
    })();
  }, [selectedDates]);

  const handleChange = async () => {
    const result = await fetchData(selectedDates);
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
  };

  const fetchData = async (dates) => {
    const result = await axios.get(`/api/chart?startingDay=${format(dates?.start, 'MM/dd/yyyy')}&endingDay=${format(dates?.end, 'MM/dd/yyyy')}`);
    return result?.data;
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
