import { CHART_GROWTH_MAPPING } from '@constants/chart';
import { themeShop } from '@constants/themeShop';
import { getCompareDate, getDateRange } from '@helpers/utils';
import axios from 'axios';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

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

export default function useSalesGrowth({ dates, mode }) {
  const [datasets, setDatasets] = useState([]);
  const [total, setTotal] = useState(0);
  const [growthRate, setGrowthRate] = useState({});
  const [rating, setRating] = useState(5.0);
  const [totalSelectedQty, setTotalSelectedQty] = useState(0);
  const [datePickerActive, setDatePickerActive] = useState(false);
  const [selectedDates, setSelectedDates] = useState(getDateRange('this_week'));
  const [comparedDates, setComparedDates] = useState(getCompareDate(getDateRange('this_week')));
  const [defaultDatasets, setDefaultDatasets] = useState([]);
  const [selected, setSelected] = useState('this_week');
  const [options, setOptions] = useState(selectOptions);
  const [compare, setCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (dates) {
        setLoading(true);

        const data = await fetchData(dates);
        let newDefaultDatasets = [];
        const smallestNumber = Math.min(
          ...data.items.map((item) =>
            mode === CHART_GROWTH_MAPPING.REVIEWS.key ? (item?.reviewQuantity ?? 0) + minimog?.fixedReviews : item.quantity + minimog.fixedSales,
          ),
        );
        const fixedValue = smallestNumber - (smallestNumber % 10);
        newDefaultDatasets.push({
          data: data.items.map((item) => {
            const originValue =
              mode === CHART_GROWTH_MAPPING.REVIEWS.key ? (item?.reviewQuantity ?? 0) + minimog?.fixedReviews : item.quantity + minimog.fixedSales;
            return {
              key: item.created_at,
              value: originValue - fixedValue,
              originValue,
            };
          }),
          name: 'Selected',
          color: minimog.color,
        });
        setDefaultDatasets(newDefaultDatasets);

        let newTotalSelectedQty = 0;
        data?.items?.forEach((item) => {
          newTotalSelectedQty += mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item.sales;
          setRating(item.review);
        });
        setTotalSelectedQty(newTotalSelectedQty);
        await fetchPreviousPeriodQty({ dates, total: newTotalSelectedQty });
        setLoading(false);
      }
    })();
  }, [dates]);

  useEffect(() => {
    setComparedDates(getCompareDate(selectedDates));
  }, [selectedDates]);

  useEffect(() => {
    (async () => {
      if (selectedDates) {
        setLoading(true);
        await handleChange({ dateSelected: selectedDates, dateCompared: comparedDates });
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = async ({ dateSelected, dateCompared }) => {
    const [selectedData, comparedData] = await Promise.all([fetchData(dateSelected), fetchData(dateCompared)]);

    let newTotalSelectedQty = 0;
    selectedData?.items?.forEach((item) => {
      newTotalSelectedQty += mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item.sales;
      setRating(item.review);
    });
    setTotalSelectedQty(newTotalSelectedQty);

    let comparedQty = 0;
    comparedData?.items?.slice(0, selectedData?.items?.length)?.forEach((item) => {
      comparedQty += mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item?.sales;
    });

    const rate = ((newTotalSelectedQty - comparedQty) / (comparedQty || 1)) * 100;
    setGrowthRate((prev) => ({ ...prev, custom: rate }));

    let newDatasets = [];
    for (let index = 0; index < [selectedData, comparedData].length; index++) {
      const data = [selectedData, comparedData][index];
      if (!data) continue;
      const dataItems = data?.items?.slice(0, selectedData?.items?.length) ?? [];
      const dataList = dataItems?.map((item) => ({
        key: item?.created_at,
        value: mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item?.sales,
      }));
      newDatasets.push({
        data: dataList,
        name: index === 0 ? 'Selected' : 'Compared',
        isComparison: index === 1,
        color: minimog.color,
      });
    }
    setDatasets(newDatasets);
  };

  const fetchData = async (dates) => {
    if (!dates) return null;
    const result = await axios.get(
      `/api/chart?startingDay=${format(dates?.start, 'MM/dd/yyyy')}&endingDay=${format(dates?.end, 'MM/dd/yyyy')}&themeId=${minimog.themeId}`,
    );
    if (result) {
      setTotal(mode === CHART_GROWTH_MAPPING.REVIEWS.key ? result.data?.reviewQuantity : result.data?.totalSales);
    }
    return result?.data;
  };

  const toggleDatePicker = useCallback(() => setDatePickerActive((prev) => !prev), []);

  const handleConfirm = async () => {
    setLoading(true);
    await handleChange({ dateSelected: selectedDates, dateCompared: comparedDates });
    setLoading(false);
  };

  const fetchPreviousPeriodQty = async ({ dates, total }) => {
    const prevDates = getCompareDate(dates);
    const result = await fetchData(prevDates);
    let qty = 0;
    result?.items?.forEach((item) => {
      qty += mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item?.sales;
    });

    const rate = ((total - qty) / (qty || 1)) * 100;
    setGrowthRate((prev) => ({ ...prev, default: rate }));
  };

  const handleChangeSelect = (value) => {
    setOptions((prev) => prev.filter((opt) => opt.value !== 'custom'));
    setSelected(value);
    setSelectedDates(getDateRange(value));
  };

  return {
    compare,
    handleChangeSelect,
    options,
    selected,
    defaultDatasets,
    handleConfirm,
    selectedDates,
    comparedDates,
    setSelectedDates,
    setComparedDates,
    datePickerActive,
    toggleDatePicker,
    datasets,
    total,
    growthRate: compare ? growthRate?.custom : growthRate?.default,
    rating,
    totalSelectedQty,
    setSelected,
    setOptions,
    setCompare,
    loading,
  };
}
