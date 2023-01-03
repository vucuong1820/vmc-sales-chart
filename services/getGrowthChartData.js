import axios from 'axios';

export default async function getGrowthChartData(dates, themeId) {
  const result = await axios.get(`/api/chart?startingDay=${dates.start}&endingDay=${dates.end}&themeId=${themeId}`);
  return result.data;
}
