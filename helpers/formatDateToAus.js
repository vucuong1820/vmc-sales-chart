import { TIME_ZONE } from '@constants';
import { endOfDay, startOfDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export default function formatDateToAus(input) {
  const starting = input.start;
  const ending = input.end;
  const start = zonedTimeToUtc(new Date(startOfDay(starting)), TIME_ZONE);

  const end = zonedTimeToUtc(new Date(endOfDay(ending)), TIME_ZONE);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}
