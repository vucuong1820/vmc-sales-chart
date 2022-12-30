import { themeChart } from '@constants/themeChart';
import { themeShop } from '@constants/themeShop';
import { dataSolving } from '@helpers/dataSolving';
import { getDateRange, sendAlert } from '@helpers/utils';
import { useEffect, useState } from 'react';
import getCompareChartData from 'services/getCompareChartData';

export default function useCompareChart() {
  const [datasets, setDatasets] = useState([]);
  const [rows, setRows] = useState(themeChart.map((theme) => [theme.label, 0, 0, 0]));
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getDateRange('this_week'));

  const handleChangeDate = ({ newSelectedDate }) => {
    if (newSelectedDate) setSelectedDate(newSelectedDate);
  };

  useEffect(() => {
    (async () => {
      if (selectedDate) await handleChange();
    })();
  }, [selectedDate]);

  const handleChange = async () => {
    try {
      setLoading(true);
      const result = await getCompareChartData(selectedDate);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
    handleChangeDate,
    selectedDate,
    loading,
    handleClick,
    rows,
    datasets,
  };
}
