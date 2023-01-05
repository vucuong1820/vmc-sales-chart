import formatDate from '@helpers/formatDate';
import axios from 'axios';

export default async function getThemeData(dates, themeId) {
  const startDate = formatDate(dates?.start).startingDate;
  const endDate = formatDate(dates?.end).endingDate;
  const result = await axios.get(`/api/chart?startingDay=${startDate.toISOString()}&endingDay=${endDate.toISOString()}&themeId=${themeId}`);
  return result.data;
}
