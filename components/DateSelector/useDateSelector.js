import { getCompareDate, getDateRange } from '@helpers/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export const DATE_OPTIONS = [
  { label: 'This week', value: 'this_week' },
  { label: 'Last week', value: 'last_week' },
  { label: 'This month', value: 'this_month' },
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
  { label: 'Last 90 days', value: 'last_90_days' },
  { label: 'This year', value: 'this_year' },
  { label: 'Last year', value: 'last_year' },
];

export default function useDateSelector({
  onConfirm,
  comparedDate,
  selectedDate,
  onlyCompare,
  onlyDefault,
  onChangeSelectedDate,
  onChangeComparedDate,
}) {
  const [active, setActive] = useState(false);
  const [dateSelectedOption, setDateSelectedOption] = useState('this_week');
  const [compare, setCompare] = useState(onlyCompare || !onlyDefault || false);
  const [dateOptions, setDateOptions] = useState(DATE_OPTIONS);
  const selectedRef = useRef();
  const comparedRef = useRef();
  const compareRef = useRef();
  const selectedOption = useRef();

  useEffect(() => {
    selectedRef.current = selectedDate;
    comparedRef.current = comparedDate;
    compareRef.current = compare;
    selectedOption.current = dateSelectedOption;
  }, []);

  useEffect(() => {
    if (!compare) onChangeComparedDate(null);
    else if (selectedDate) onChangeComparedDate(getCompareDate(selectedDate));
  }, [compare]);
  const handleChangeSelect = (newOpt) => {
    setDateOptions((prev) => prev.filter((opt) => opt.value !== 'custom'));
    setDateSelectedOption(newOpt);
    onChangeSelectedDate(getDateRange(newOpt));
  };

  const toggleDateSelector = useCallback(() => setActive((prev) => !prev), []);

  const handleCheck = (newValue) => {
    setCompare(newValue);
  };

  const handleCloseDateSelector = () => {
    setActive(false);
    onChangeSelectedDate(selectedRef.current);
    onChangeSelectedDate(comparedRef.current);
    setCompare(comparedRef.current);
    setDateSelectedOption(selectedOption.current);
  };

  const handleApply = () => {
    onConfirm();
    setActive(false);
    selectedRef.current = selectedDate;
    comparedRef.current = comparedDate;
    compareRef.current = compare;
    selectedOption.current = dateSelectedOption;
  };

  return {
    handleApply,
    handleCloseDateSelector,
    handleCheck,
    dateOptions,
    active,
    dateSelectedOption,
    handleChangeSelect,
    compare,
    setCompare,
    toggleDateSelector,
    setDateOptions,
    setDateSelectedOption,
  };
}
