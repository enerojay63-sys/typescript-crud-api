"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_json_1 = __importDefault(require("../../config.json"));
async function sendEmail({ to, subject, html, from = config_json_1.default.emailform }) {
    try {
        const transporter = nodemailer_1.default.createTransport(config_json_1.default.smtpOptions);
        console.log(`Attempting to send email to: ${to}`);
        await transporter.sendMail({ from, to, subject, html });
        console.log('Email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow so the calling function knows it failed
    }
}
