/* eslint-disable no-console */
import { themeShop } from '@constants/themeShop.js';
import { getDateRange, sendAlert } from '@helpers/utils';
import getThemeData from '@services/getThemeData';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import { useNotificationStore } from 'providers/NotificationProvider';
import { useEffect, useState } from 'react';

export default function useCompareChart() {
  const [datasets, setDatasets] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getDateRange('this_week'));
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const { showToast } = useNotificationStore();
  const handleChangeDate = (newSelectedDate) => {
    if (newSelectedDate) setSelectedDate(newSelectedDate);
  };

  useEffect(() => {
    handleChange();
  }, []);

  const handleChange = async () => {
    for (let index = 0; index < themeShop.length; index++) {
      const theme = themeShop[index];
      getData(index, theme);
    }
  };

  const getData = async (index, theme) => {
    try {
      const result = await getThemeData(selectedDate, theme.themeId);
      setDatasets((prev) => {
        const cloneData = cloneDeep(prev);
        const indexChange = cloneData.findIndex((item) => item.name === theme.name);
        const payload = {
          name: theme.name,
          data: result.items
            .filter((item) => item?.name === theme.name)
            .map((item) => ({
              key: format(new Date(item?.createdAt), 'MM/dd/yyyy'),
              value: item?.sales,
            })),
          color: theme.color,
        };

        if (indexChange > -1) {
          cloneData[indexChange] = payload;
          return cloneData;
        }

        return [...prev, payload];
      });
      setRows((prev) => {
        const cloneData = cloneDeep(prev);
        const index = cloneData.findIndex((item) => item?.[0] === theme.name);
        if (index !== -1) {
          cloneData[index] = formatThemeRow(result);
          return cloneData;
        } else {
          return [...cloneData, formatThemeRow(result)];
        }
      });
    } catch (error) {
      showToast({
        error: true,
        message: error?.message,
      });
    }
  };

  const formatThemeRow = (data) => {
    const items = data.items;
    let sales = 0;
    let rating = 5;
    for (const item of items) {
      sales += item?.sales;
      rating = item?.review;
    }

    return [items?.[0]?.name, data?.totalSales.toLocaleString('en-US'), rating, sales];
  };

  const handleClick = () => {
    sendAlert(rows);
  };

  const handleSelectLegend = (item) => {
    setSelectedDatasets((prev) => {
      const index = prev.findIndex((data) => data?.name === item?.name);
      if (index !== -1) {
        const cloneData = cloneDeep(prev);
        cloneData.splice(index, 1);
        return cloneData;
      }
      return [...prev, item];
    });
  };

  return {
    handleChange,
    handleChangeDate,
    selectedDate,
    loading,
    handleClick,
    rows: Array.from(rows).sort((a, b) => Number.parseFloat(b[3]) - Number.parseFloat(a[3])),
    datasets,
    selectedDatasets,
    handleSelectLegend,
  };
}
