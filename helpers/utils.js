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
    .map((row) => {
      let result;
      themeShop.forEach((theme) => {
        if (theme.name === row[0]) {
          result = `<${theme.url}|${row[0]}>: ${row[2]}`;
        }
      });
      return result;
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

export const sendAlert = (payload) => {
  console.log(process.env.NEXT_PUBLIC_SLACK_WEBHOOK, "SLACK_WEBHOOK");
  try {
    axios.post("https://hooks.slack.com/services/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", JSON.stringify(payload));
  } catch (e) {
    console.log(e);
  }
};
