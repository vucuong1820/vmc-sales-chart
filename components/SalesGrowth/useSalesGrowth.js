import { CHART_GROWTH_MAPPING } from '@constants/chart';
import { themeShop } from '@constants/themeShop';
import { getCompareDate, getDateRange } from '@helpers/utils';
import { format } from 'date-fns';
import { useNotificationStore } from 'providers/NotificationProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import getGrowthChartData from 'services/getGrowthChartData';

const themeId = process.env.NEXT_PUBLIC_PRODUCT === 'minimogwp' ? 36947163 : 33380968;

const minimog = themeShop.find((theme) => theme.themeId === themeId);
export const selectOptions = [
  { label: 'This week', value: 'this_week' },
  { label: 'Last week', value: 'last_week' },
  { label: 'This month', value: 'this_month' },
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
  { label: 'Last 90 days', value: 'last_90_days' },
  { label: 'This year', value: 'this_year' },
  { label: 'Last year', value: 'last_year' },
];

export const FIXED_REVIEW_VALUE = 1;

export default function useSalesGrowth({ mode }) {
  const [total, setTotal] = useState(0);
  const [growthRate, setGrowthRate] = useState();
  const [rating, setRating] = useState(5.0);
  const [totalSelectedQty, setTotalSelectedQty] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getDateRange('this_week'));
  const [comparedDate, setComparedDate] = useState(getCompareDate(getDateRange('this_week')));
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const { showToast } = useNotificationStore();

  useEffect(() => {
    (async () => {
      if (selectedDate) {
        try {
          setLoading(true);
          await getDatasets({ dateSelected: selectedDate, dateCompared: comparedDate, compare });
          setLoading(false);
        } catch (error) {
          setLoading(false);
          showToast({
            error: true,
            message: error?.message,
          });
        }
      }
    })();
  }, []);

  useEffect(() => {
    setComparedDate(getCompareDate(selectedDate));
  }, [selectedDate]);

  const getTotalSalesOrReviewsPerDay = useCallback(
    (items) => {
      let quantity = 0;
      items.forEach((item) => {
        quantity += mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item.sales;
      });
      return quantity;
    },
    [mode],
  );

  const getTotalSalesOrReviewsAllTime = (item) => {
    return mode === CHART_GROWTH_MAPPING.REVIEWS.key ? (item?.reviewQuantity ?? 0) + minimog?.fixedReviews : item.quantity + minimog.fixedSales;
  };

  const fetchData = async (dates) => {
    if (!dates) return null;
    const result = await getGrowthChartData(dates, minimog.themeId);
    if (result) {
      setTotal(mode === CHART_GROWTH_MAPPING.REVIEWS.key ? result?.reviewQuantity : result?.totalSales);
    }
    return result;
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await getDatasets({ dateSelected: selectedDate, dateCompared: comparedDate, compare });
      setLoading(false);
    } catch (error) {
      showToast({
        error: true,
        message: error?.message,
      });
      setLoading(false);
    }
  };

  const getDatasets = async ({ dateSelected, dateCompared }) => {
    const [selectedData, comparedData] = await Promise.all([fetchData(dateSelected), fetchData(dateCompared || getCompareDate(dateSelected))]);
    setRating(selectedData.items[selectedData.items.length - 1]?.review);
    let result = [];
    const selectedQty = getTotalSalesOrReviewsPerDay(selectedData.items);
    const comparedQty = getTotalSalesOrReviewsPerDay(comparedData.items);
    const listData = [selectedData, comparedData].filter((x) => x);
    if (!dateCompared) {
      const data = listData[0];

      const smallestNumber = Math.min(...data.items.map((item) => getTotalSalesOrReviewsAllTime(item)));
      const fixedValue = smallestNumber - (smallestNumber % 10);

      const dataList = data.items.map((item) => {
        const originValue = getTotalSalesOrReviewsAllTime(item);

        return {
          key: format(new Date(item?.createdAt), 'MM/dd/yyyy'),
          value: originValue - fixedValue,
          originValue,
        };
      });

      result.push({
        data: dataList,
        name: 'Selected',
        color: minimog.color,
      });
    } else {
      for (let index = 0; index < listData.length; index++) {
        const data = listData[index];

        const dataList = data?.items?.map((item) => {
          const originValue = mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item?.sales;

          return {
            key: format(new Date(item?.createdAt), 'MM/dd/yyyy'),
            value: mode === CHART_GROWTH_MAPPING.REVIEWS.key ? originValue + FIXED_REVIEW_VALUE : originValue,
            originValue,
          };
        });

        result.push({
          data: dataList,
          name: index === 0 ? 'Selected' : 'Compared',
          isComparison: index === 1,
          color: minimog.color,
        });
      }
    }

    setTotalSelectedQty(selectedQty);
    const rate = ((selectedQty - comparedQty) / (comparedQty || 1)) * 100;
    setGrowthRate(rate);

    const newSelectedDatasets = result?.[0] ?? {};
    let newComparedDatasets = result?.[1];
    if (!newComparedDatasets) {
      setDatasets(result);
      return;
    }
    newComparedDatasets = {
      ...newComparedDatasets,
      data: newComparedDatasets.data.slice(0, newSelectedDatasets?.data?.length),
    };

    setDatasets([newSelectedDatasets, newComparedDatasets]);
  };

  const compare = useMemo(() => selectedDate && comparedDate, [selectedDate, comparedDate]);

  return {
    compare,
    handleConfirm,
    selectedDate,
    comparedDate,
    setSelectedDate,
    setComparedDate,
    total,
    growthRate,
    rating,
    totalSelectedQty,
    loading,
    datasets,
  };
}
