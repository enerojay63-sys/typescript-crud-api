"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../_helpers/db");
async function getAll() {
    return await db_1.db.User.findAll();
}
async function getById(id) {
    const user = await db_1.db.User.findByPk(id);
    if (!user)
        throw new Error('User not found');
    return user;
}
async function create(params) {
    const existing = await db_1.db.User.findOne({ where: { email: params.email } });
    if (existing)
        throw new Error(`Email "${params.email}" is already registered`);
    const user = new db_1.db.User();
    Object.assign(user, params);
    user.passwordHash = await bcryptjs_1.default.hash(params.passwordHash, 10);
    await user.save();
}
async function update(id, params) {
    const user = await db_1.db.User.findByPk(id);
    if (!user)
        throw new Error('User not found');
    const emailChanged = params.email && params.email !== user.email;
    if (emailChanged) {
        const existing = await db_1.db.User.findOne({ where: { email: params.email } });
        if (existing)
            throw new Error(`Email "${params.email}" is already taken`);
    }
    if (params.passwordHash) {
        params.passwordHash = await bcryptjs_1.default.hash(params.passwordHash, 10);
    }
    Object.assign(user, params);
    await user.save();
}
async function remove(id) {
    const user = await db_1.db.User.findByPk(id);
    if (!user)
        throw new Error('User not found');
    await user.destroy();
}
exports.userService = { getAll, getById, create, update, remove };
