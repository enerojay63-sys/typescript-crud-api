"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load .env first
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
let configJson;
try {
    const configPath = path_1.default.resolve(__dirname, '../../config.json');
    configJson = JSON.parse(fs_1.default.readFileSync(configPath, 'utf-8'));
}
catch (error) {
    // Fallback to inline defaults if config.json is missing
    console.warn("config.json not found, using inline defaults");
    configJson = {
        database: {
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: '[PASSWORD]',
            database: 'users'
        },
        secret: 'THIS IS A SECRET (CHANGE THIS)',
        emailform: "[EMAIL_ADDRESS]",
        smtpOptions: {
            host: "smtp.ethereal.email",
            port: 587,
            service: "Gmail",
            auth: {
                user: "[EMAIL_ADDRESS]",
                pass: "[PASSWORD]"
            }
        }
    };
}
exports.config = {
    database: {
        host: process.env.DB_HOST || configJson.database.host,
        port: Number(process.env.DB_PORT || configJson.database.port),
        user: process.env.DB_USER || configJson.database.user,
        password: process.env.DB_PASSWORD || configJson.database.password,
        database: process.env.DB_NAME || configJson.database.database
    },
    secret: process.env.JWT_SECRET || configJson.secret,
    emailFrom: process.env.EMAIL_FROM || configJson.emailform,
    smtpOptions: {
        host: process.env.SMTP_HOST || configJson.smtpOptions.host || '',
        port: Number(process.env.SMTP_PORT || configJson.smtpOptions.port || 0),
        service: configJson.smtpOptions.service || undefined,
        auth: {
            user: process.env.SMTP_USER || configJson.smtpOptions.auth.user,
            pass: process.env.SMTP_PASS || configJson.smtpOptions.auth.pass
        }
    }
};
