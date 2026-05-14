"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("_helpers/db");
const role_1 = require("_helpers/role");
const config = require('../../config.json');
async function register(params) {
    const existing = await db_1.db.User.findOne({
        where: { email: params.email }
    });
    if (existing)
        throw new Error(`Email "${params.email}" is already registered`);
    const user = db_1.db.User.build({
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        role: role_1.Role.User,
        passwordHash: await bcryptjs_1.default.hash(params.password, 10),
        verified: false
    });
    await user.save();
}
async function verifyEmail(email) {
    const user = await db_1.db.User.findOne({
        where: { email }
    });
    if (!user)
        throw new Error('User not found');
    user.verified = true;
    await user.save();
}
async function login(email, password) {
    const user = await db_1.db.User.scope('withPassword').findOne({
        where: { email }
    });
    if (!user)
        throw new Error('Invalid credentials');
    if (!user.verified)
        throw new Error('Please verify your email first');
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid)
        throw new Error('Invalid credentials');
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, config.secret, { expiresIn: '24h' });
    return {
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        }
    };
}
async function getProfile(id) {
    const user = await db_1.db.User.findByPk(id);
    if (!user)
        throw new Error('User not found');
    return user;
}
exports.authService = { register, verifyEmail, login, getProfile };
