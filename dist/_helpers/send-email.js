"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("./config");
async function sendEmail({ to, subject, html, from = config_1.config.emailFrom }) {
    const transporter = nodemailer_1.default.createTransport(config_1.config.smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}
