const functions = require("firebase-functions");
const {
  website: { url: websiteUrl },
} = functions.config();

const WebhookType = {
  SLACK: "SLACK",
  MS_TEAMS: "MS_TEAMS",
};

const generateWebhookPayload = ({ person, webhookUrl }) => {
  const webhookType = (() => {
    if (webhookUrl.includes("https://hooks.slack.com"))
      return WebhookType.SLACK;
    if (webhookUrl.includes("https://outlook.office.com"))
      return WebhookType.MS_TEAMS;
  })();

  switch (webhookType) {
    case WebhookType.SLACK:
      return {
        text: `${person} is at the watercooler...`,
      };
    case WebhookType.MS_TEAMS:
      return {
        type: "message",
        attachments: [
          {
            contentType: "application/vnd.microsoft.card.adaptive",
            contentUrl: null,
            content: {
              $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
              type: "AdaptiveCard",
              version: "1.2",
              body: [
                {
                  type: "TextBlock",
                  text: `${person} is at [the watercooler.](${websiteUrl})`,
                },
              ],
            },
          },
        ],
      };
    default:
      return {};
  }
};

module.exports = {
  generateWebhookPayload,
};
