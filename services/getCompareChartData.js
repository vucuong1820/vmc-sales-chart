import formatDate from '@helpers/formatDate';
import axios from 'axios';

export default async function getCompareChartData(dates) {
  const startDate = formatDate(dates?.start).startingDate;
  const endDate = formatDate(dates?.end).endingDate;
  const result = await axios.get(`/api/chart?startingDay=${startDate.toISOString()}&endingDay=${endDate.toISOString()}`);
  return result.data;
}
