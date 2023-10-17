import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from "googleapis";

const accountTransport = require("../../config/account_transport.json");

const oAuth2Data = {
  clientID:
    "647098315366-r86pqh99c3qmhp4b6fc64bnfq407dpk6.apps.googleusercontent.com",
  clientSecret: "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",
  refreshToken:
    "1//04UJ4tvkTsB0XCgYIARAAGAQSNwF-L9IrGaLchheGj4T7SaHV19pB6-TnHauCRETcJef6vYWCSpEfMxsHO51VwWV0x-4vjlZGBEU",
  user: "uadedeliverargrupo04@gmail.com",
};

const oAuth2Client = new google.auth.OAuth2(
  oAuth2Data.clientID,
  oAuth2Data.clientSecret,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: oAuth2Data.refreshToken,
});

async function createTransporter(): Promise<Transporter> {
  const accessTokenResponse = await oAuth2Client.getAccessToken();

  if (accessTokenResponse.token === null) {
    throw new Error("Access token is null");
  }

  return nodemailer.createTransport(
    new SMTPTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: oAuth2Data.user,
        clientId: oAuth2Data.clientID,
        clientSecret: oAuth2Data.clientSecret,
        refreshToken: oAuth2Data.refreshToken,
        accessToken: accessTokenResponse.token,
      },
    })
  );
}

export const sendMail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    const transporter = await createTransporter();

    const mailOptions: SendMailOptions = {
      from: oAuth2Data.user,
      to: to,
      subject: subject,
      html: html,
    };
    // Logging commented out for security reasons
    // console.log("EMAIL! ", mailOptions);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throwing to allow higher-level error handling or to inform the caller
  }
};

export const getAuthUrl = (): string => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://mail.google.com/"],
  });

  return authUrl;
};

export const setRefreshTokenAndRetrieveNewAccessToken = async (
  code: string
): Promise<string> => {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  if (!tokens.refresh_token) {
    throw new Error("Failed to retrieve refresh token");
  }

  oAuth2Data.refreshToken = tokens.refresh_token;

  if (!tokens.access_token) {
    throw new Error("Failed to retrieve access token");
  }

  return tokens.access_token;
};
