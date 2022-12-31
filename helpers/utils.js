import { themeShop } from '@constants/themeShop';
import axios from 'axios';
import {
  compareDesc,
  differenceInDays,
  endOfToday,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  subDays,
} from 'date-fns';

export const getDateRange = (date) => {
  const today = new Date();
  const dayOfLastWeek = new Date(new Date().setDate(new Date().getDate() - 7));

  let range;

  switch (date) {
    case 'today':
      range = { start: startOfToday(), end: endOfToday() };
      break;
    case 'yesterday':
      range = { start: startOfYesterday(), end: endOfYesterday() };
      break;
    case 'last_7_days':
      range = { start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date(new Date().setDate(new Date().getDate() - 1)) };
      break;
    case 'last_30_days':
      range = { start: new Date(new Date().setDate(new Date().getDate() - 30)), end: new Date(new Date().setDate(new Date().getDate() - 1)) };
      break;
    case 'last_90_days':
      range = { start: new Date(new Date().setDate(new Date().getDate() - 90)), end: new Date(new Date().setDate(new Date().getDate() - 1)) };
      break;
    case 'last_year':
      range = {
        start: startOfYear(new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
        end: endOfYear(new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
      };
      break;
    case 'this_year':
      range = { start: startOfYear(new Date()), end: endOfToday() };
      break;
    case 'this_week': {
      const endOfWeekDay = endOfWeek(today, { weekStartsOn: 1 });
      range = {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: compareDesc(endOfWeekDay, today) === -1 ? today : endOfWeekDay,
      };
      break;
    }
    case 'last_week':
      range = {
        start: startOfWeek(dayOfLastWeek, { weekStartsOn: 1 }),
        end: endOfWeek(dayOfLastWeek, { weekStartsOn: 1 }),
      };
      break;
    case 'this_month':
      range = {
        start: startOfMonth(today, { weekStartsOn: 1 }),
        end: today,
      };
      break;
    default:
      break;
  }
  return {
    start: range?.start,
    end: range?.end,
  };
};

export const getCompareDate = (dates) => {
  const { start, end } = dates;

  const distance = differenceInDays(end, start);
  const prevEnd = subDays(new Date(start), 1);

  const prevStart = subDays(prevEnd, distance);

  return {
    start: prevStart,
    end: prevEnd,
  };
};

export const buildAlert = (data) => {
  const revenueBreakdown = data
    .map((row, index) => {
      const theme = themeShop[index];
      const url = `${theme.url}/${theme.themeId}`;
      return `<${url}|${row[0]}>: ${row[3]}`;
    })
    .join('\n');
  const payload = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Weekly Best Selling Chart Report*',
        },
      },

      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: revenueBreakdown,
        },
      },

      {
        type: 'divider',
      },

      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View chart',
              emoji: true,
            },
            value: 'click_me_123',
            url: process.env.NEXT_PUBLIC_DOMAIN,
          },
        ],
      },
    ],
  };
  return payload;
};

export const sendAlert = (data) => {
  const payload = buildAlert(data);
  try {
    axios.post('https://hooks.slack.com/services/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', JSON.stringify(payload));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};
