"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initialize = initialize;
const promise_1 = __importDefault(require("mysql2/promise"));
const mysql2_1 = __importDefault(require("mysql2"));
const sequelize_1 = require("sequelize");
const config_json_1 = __importDefault(require("../../config.json"));
exports.db = {};
async function initialize() {
    const host = process.env.DB_HOST || config_json_1.default.database.host;
    const port = Number(process.env.DB_PORT || config_json_1.default.database.port);
    const user = process.env.DB_USER || config_json_1.default.database.user;
    const password = process.env.DB_PASSWORD || config_json_1.default.database.password;
    const database = process.env.DB_NAME || config_json_1.default.database.database;
    try {
        const connection = await promise_1.default.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        await connection.end();
    }
    catch (err) {
        console.warn('Could not ensure database existence (this is normal on shared hosting):', err.message);
    }
    const sequelize = new sequelize_1.Sequelize(database, user, password, {
        dialect: 'mysql',
        dialectModule: mysql2_1.default,
        host,
        port
    });
    const { UserModel } = await Promise.resolve().then(() => __importStar(require('../users/user.model')));
    const { default: accountModel } = await Promise.resolve().then(() => __importStar(require('../accounts/account.model')));
    const { default: refreshTokenModel } = await Promise.resolve().then(() => __importStar(require('../accounts/refresh-token.model')));
    exports.db.User = UserModel(sequelize);
    exports.db.Account = accountModel(sequelize);
    exports.db.RefreshToken = refreshTokenModel(sequelize);
    exports.db.Account.hasMany(exports.db.RefreshToken, { onDelete: 'CASCADE' });
    exports.db.RefreshToken.belongsTo(exports.db.Account);
    const isServerlessOrProd = !!process.env.VERCEL || process.env.NODE_ENV === 'production';
    const shouldAlter = process.env.DB_ALTER === 'true' || (!isServerlessOrProd && process.env.NODE_ENV !== 'production');
    if (shouldAlter) {
        console.log('Syncing database with { alter: true }...');
        await sequelize.sync({ alter: true });
    }
    else {
        console.log('Syncing database with standard sync...');
        await sequelize.sync();
    }
    console.log('______DATABASE INITIALIZED AND MODELS SYNCED______');
}
