import axios from "axios";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { themeShop } from "../constants/themeShop";
export const getDateChart = (date) => {
  let today = new Date();

  let dayOfLastWeek = new Date(new Date().setDate(new Date().getDate() - 7));

  switch (date) {
    case "this_week":
      return {
        start: format(startOfWeek(today, { weekStartsOn: 1 }), "MM/dd/yyyy"),
        end: format(endOfWeek(today, { weekStartsOn: 1 }), "MM/dd/yyyy"),
      };
    case "last_week":
      return {
        start: format(
          startOfWeek(dayOfLastWeek, { weekStartsOn: 1 }),
          "MM/dd/yyyy"
        ),
        end: format(
          endOfWeek(dayOfLastWeek, { weekStartsOn: 1 }),
          "MM/dd/yyyy"
        ),
      };
    case "this_month":
      return {
        start: format(startOfMonth(today, { weekStartsOn: 1 }), "MM/dd/yyyy"),
        end: format(endOfMonth(today, { weekStartsOn: 1 }), "MM/dd/yyyy"),
      };

    default:
      break;
  }
};

export const buildAlert = (data) => {
  let revenueBreakdown = data
    .map(function (row, index) {
      return `<${themeShop[index]}|${row[0]}>: ${row[2]}`;
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
    "https://hooks.slack.com/services/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";

  try {
    axios.post(webhook, JSON.stringify(payload));
  } catch (e) {
    console.log(e);
  }
};
