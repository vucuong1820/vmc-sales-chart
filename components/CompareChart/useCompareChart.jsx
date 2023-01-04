/* eslint-disable no-console */
import { themeShop } from '@constants/themeShop';
import { getDateRange, sendAlert } from '@helpers/utils';
import getThemeData from '@services/getThemeData';
import { SkeletonDisplayText, SkeletonThumbnail } from '@shopify/polaris';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';

const initRows = themeShop.map(() => [
  <SkeletonDisplayText key={1} />,
  <div className="skeleton-item" key={2}>
    <SkeletonThumbnail size="small" />
  </div>,
  <div className="skeleton-item" key={3}>
    <SkeletonThumbnail size="small" />
  </div>,
  <div className="skeleton-item" key={4}>
    <SkeletonThumbnail size="small" />
  </div>,
]);

export default function useCompareChart() {
  const [datasets, setDatasets] = useState([]);
  const [rows, setRows] = useState(initRows);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getDateRange('this_week'));

  const handleChangeDate = (newSelectedDate) => {
    if (newSelectedDate) setSelectedDate(newSelectedDate);
  };

  useEffect(() => {
    handleChange();
  }, []);

  const handleChange = async () => {
    setRows(initRows);
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
        cloneData[index] = formatThemeRow(result);
        return cloneData;
      });
    } catch (error) {
      console.log(error);
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
  return {
    handleChange,
    handleChangeDate,
    selectedDate,
    loading,
    handleClick,
    rows,
    datasets,
  };
}
