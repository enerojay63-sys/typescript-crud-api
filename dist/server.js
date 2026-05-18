"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_handler_1 = require("./_middleware/error-handler");
const db_1 = require("./_helpers/db");
const users_controller_1 = __importDefault(require("./users/users.controller"));
const swagger_1 = __importDefault(require("./_helpers/swagger"));
const account_controller_1 = __importDefault(require("./accounts/account.controller"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ['http://localhost:4200', 'https://enero-frontend-smel.onrender.com'],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use('/accounts', account_controller_1.default);
app.use('/api-docs', swagger_1.default);
app.use('/users', users_controller_1.default);
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
app.use(error_handler_1.errorHandler);
const PORT = process.env.PORT || 4000;
// Start database initialization immediately
const initPromise = (0, db_1.initialize)();
initPromise.catch((err) => {
    console.error('Failed to initialize database:', err);
    if (!process.env.VERCEL) {
        process.exit(1);
    }
});
// Middleware to ensure database is initialized before handling requests
app.use(async (req, res, next) => {
    try {
        await initPromise;
        next();
    }
    catch (err) {
        next(err);
    }
});
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
    });
}
exports.default = app;
