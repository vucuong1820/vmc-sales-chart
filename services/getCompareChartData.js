import axios from 'axios';

export default async function getCompareChartData(dates) {
  const result = await axios.get(`/api/chart?startingDay=${dates?.start}&endingDay=${dates?.end}`);
  return result.data;
}
