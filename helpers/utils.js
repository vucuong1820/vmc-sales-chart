import axios from "axios";
import {
  subDays, endOfToday,
  endOfWeek, endOfYear, endOfYesterday,
  getDate, compareDesc,
  startOfMonth, startOfToday,
  startOfWeek, startOfYear, startOfYesterday, differenceInDays
} from "date-fns";
import { themeChart } from "../constants/themeChart";

export const getDateRange = (date) => {
  let today = new Date();
  let dayOfLastWeek = new Date(new Date().setDate(new Date().getDate() - 7));

  let range

  switch (date) {
    case "today":
      range = {start: startOfToday(), end: endOfToday()}
      break
    case "yesterday":
      range = {start: startOfYesterday(), end: endOfYesterday()}
      break
    case "last_7_days":
      range = {start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date(new Date().setDate(new Date().getDate() - 1))}
      break
    case "last_30_days":
      range = {start: new Date(new Date().setDate(new Date().getDate() - 30)), end: new Date(new Date().setDate(new Date().getDate() - 1))}
      break
    case "last_90_days":
      range = {start: new Date(new Date().setDate(new Date().getDate() - 90)), end: new Date(new Date().setDate(new Date().getDate() - 1))}
      break
    case "last_year":
      range = {start: startOfYear(new Date(new Date().setFullYear(new Date().getFullYear() - 1))), end: endOfYear(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))}
      break
    case "this_year":
      range = {start: startOfYear(new Date()), end: endOfToday()}
      break
    case "this_week":
      const endOfWeekDay = endOfWeek(today, { weekStartsOn: 1 })
      range = {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: compareDesc(endOfWeekDay, today) === -1 ? today : endOfWeekDay
      };
      break
    case "last_week":
      range = {
        start: startOfWeek(dayOfLastWeek, { weekStartsOn: 1 }),
        end: endOfWeek(dayOfLastWeek, { weekStartsOn: 1 })
      };
      break
    case "this_month":
      range = {
        start: startOfMonth(today, { weekStartsOn: 1 }),
        end: today,
      };
      break
    default:
      break;
  }
  return {
    start: range?.start,
    end: range?.end,
  }
};

export const getCompareDate = (dates) => {
  const {start, end} = dates

  let distance = differenceInDays(end, start)
  const prevEnd = subDays(new Date(start), 1)

  const prevStart = subDays(prevEnd, distance)

  return {
    start: prevStart,
    end: prevEnd
  }
}

export const buildAlert = (data) => {
  let revenueBreakdown = data
    .map(function (row, index) {
      return `<${themeChart[index]?.url}|${row[0]}>: ${row[3]}`;
    })
    .join("\n");
  let payload = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*[Shopify] Weekly BestSelling Chart Report*",
        },
      },

      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: revenueBreakdown,
        },
      },

      {
        type: "divider",
      },

      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View chart",
              emoji: true,
            },
            value: "click_me_123",
            url: "https://chart.minimog.co/",
          },
        ],
      },
    ],
  };
  return payload;
};

export const sendAlert = (data) => {
  const payload = buildAlert(data)
  console.log(process.env.NEXT_PUBLIC_SLACK_WEBHOOK, 'SLACK_WEBHOOK')
  try {
    axios.post(process.env.NEXT_PUBLIC_SLACK_WEBHOOK, JSON.stringify(payload));
  } catch (e) {
    console.log(e);
  }
};
