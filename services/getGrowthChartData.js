import axios from 'axios';
import { format } from 'date-fns';

export default async function getGrowthChartData(dates, themeId) {
  const result = await axios.get(
    `/api/chart?startingDay=${format(dates?.start, 'MM/dd/yyyy')}&endingDay=${format(dates?.end, 'MM/dd/yyyy')}&themeId=${themeId}`,
  );
  return result.data;
}
