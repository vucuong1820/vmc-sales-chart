import axios from 'axios';
import { format } from 'date-fns';

export default async function getCompareChartData(dates) {
  const result = await axios.get(`/api/chart?startingDay=${format(dates?.start, 'MM/dd/yyyy')}&endingDay=${format(dates?.end, 'MM/dd/yyyy')}`);
  return result.data;
}
