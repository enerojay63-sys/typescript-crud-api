"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const config_json_1 = __importDefault(require("../../config.json"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.config = {
    database: {
        host: process.env.DB_HOST || config_json_1.default.database.host,
        port: Number(process.env.DB_PORT || config_json_1.default.database.port),
        user: process.env.DB_USER || config_json_1.default.database.user,
        password: process.env.DB_PASSWORD || config_json_1.default.database.password,
        database: process.env.DB_NAME || config_json_1.default.database.database
    },
    secret: process.env.JWT_SECRET || config_json_1.default.secret,
    emailFrom: process.env.EMAIL_FROM || config_json_1.default.emailform,
    smtpOptions: {
        host: process.env.SMTP_HOST || config_json_1.default.smtpOptions.host || '',
        port: Number(process.env.SMTP_PORT || config_json_1.default.smtpOptions.port || 0),
        service: config_json_1.default.smtpOptions.service || undefined,
        auth: {
            user: process.env.SMTP_USER || config_json_1.default.smtpOptions.auth.user,
            pass: process.env.SMTP_PASS || config_json_1.default.smtpOptions.auth.pass
        }
    }
};
