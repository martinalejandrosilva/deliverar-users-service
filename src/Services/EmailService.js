"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshTokenAndRetrieveNewAccessToken = exports.getAuthUrl = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const smtp_transport_1 = __importDefault(require("nodemailer/lib/smtp-transport"));
const googleapis_1 = require("googleapis");
const accountTransport = require("../../config/account_transport.json");
const oAuth2Data = {
    clientID: "647098315366-r86pqh99c3qmhp4b6fc64bnfq407dpk6.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//04x9CvHyUXEf2CgYIARAAGAQSNwF-L9IrpsXKpwEr17nqzd1Vcny4Fz_x6RetyyG4H5Al3Wn2U2HsVX1agH8CgxDku8FhLJ0A4Uk",
    user: "uadedeliverargrupo04@gmail.com",
};
const oAuth2Client = new googleapis_1.google.auth.OAuth2(oAuth2Data.clientID, oAuth2Data.clientSecret, "https://developers.google.com/oauthplayground");
oAuth2Client.setCredentials({
    refresh_token: oAuth2Data.refreshToken,
});
function createTransporter() {
    return __awaiter(this, void 0, void 0, function* () {
        const accessTokenResponse = yield oAuth2Client.getAccessToken();
        if (accessTokenResponse.token === null) {
            throw new Error("Access token is null");
        }
        return nodemailer_1.default.createTransport(new smtp_transport_1.default({
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
        }));
    });
}
const sendMail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = yield createTransporter();
        const mailOptions = {
            from: oAuth2Data.user,
            to: to,
            subject: subject,
            html: html,
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throwing to allow higher-level error handling or to inform the caller
    }
});
exports.sendMail = sendMail;
const getAuthUrl = () => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://mail.google.com/"],
    });
    return authUrl;
};
exports.getAuthUrl = getAuthUrl;
const setRefreshTokenAndRetrieveNewAccessToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokens } = yield oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    if (!tokens.refresh_token) {
        throw new Error("Failed to retrieve refresh token");
    }
    oAuth2Data.refreshToken = tokens.refresh_token;
    if (!tokens.access_token) {
        throw new Error("Failed to retrieve access token");
    }
    return tokens.access_token;
});
exports.setRefreshTokenAndRetrieveNewAccessToken = setRefreshTokenAndRetrieveNewAccessToken;
