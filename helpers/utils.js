import axios from "axios";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const getDateChart = (date) => {
  let today = new Date();
  let dayOfLastWeek = new Date(new Date().setDate(new Date().getDate() - 7));
  const fixDate = (input) => {
    input = new Date(input);
    input.setDate(input.getDate() + 1);
    return input;
  };
  switch (date) {
    case "this_week":
      return {
        start: format(fixDate(startOfWeek(today)), "MM/dd/yyyy"),
        end: format(fixDate(endOfWeek(today)), "MM/dd/yyyy"),
      };
    case "last_week":
      return {
        start: format(fixDate(startOfWeek(dayOfLastWeek)), "MM/dd/yyyy"),
        end: format(fixDate(endOfWeek(dayOfLastWeek)), "MM/dd/yyyy"),
      };
    case "this_month":
      return {
        start: format(startOfMonth(today), "MM/dd/yyyy"),
        end: format(endOfMonth(today), "MM/dd/yyyy"),
      };

    default:
      break;
  }
};

export const buildAlert = (data) => {
  let revenueBreakdown = data
    .map(function (row) {
      return `<${themeChart[index]?.url}|${row[0]}>: ${row[2]}`;
    })
    .join("\n");
  console.log(revenueBreakdown);
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
            url: "http://chart.minimog.co",
          },
        ],
      },
    ],
  };
  return payload;
};

export const sendAlert = (payload) => {
  const webhook =
    "https://hooks.slack.com/services/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"; //Paste your webhook URL here

  try {
    axios.post(webhook, JSON.stringify(payload));
  } catch (e) {
    console.log(e);
  }
};
