import dotenv from 'dotenv';
import path from 'path';
import configJson from '../../config.json';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
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
        host: process.env.SMTP_HOST || (configJson.smtpOptions as any).host || '',
        port: Number(process.env.SMTP_PORT || (configJson.smtpOptions as any).port || 0),
        service: (configJson.smtpOptions as any).service || undefined,
        auth: {
            user: process.env.SMTP_USER || configJson.smtpOptions.auth.user,
            pass: process.env.SMTP_PASS || configJson.smtpOptions.auth.pass
        }
    }
};