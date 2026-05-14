"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
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
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use('/accounts', account_controller_1.default);
app.use('/api-docs', swagger_1.default);
app.use('/users', users_controller_1.default);
app.use(error_handler_1.errorHandler);
const PORT = process.env.PORT || 4000;
(0, db_1.initialize)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log('Failed to initialize database::', err);
    process.exit(1);
});
