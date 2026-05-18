"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../_helpers/db");
const jwt_1 = require("../_helpers/jwt");
const router = express_1.default.Router();
router.get('/accounts', jwt_1.authenticateToken, jwt_1.requireAdmin, getAccounts);
router.get('/departments', jwt_1.authenticateToken, jwt_1.requireAdmin, getDepartments);
function getAccounts(req, res, next) {
    db_1.db.User.findAll()
        .then(users => res.json({ accounts: users }))
        .catch(next);
}
function getDepartments(req, res, next) {
    db_1.db.Department.findAll()
        .then(departments => res.json({ departments }))
        .catch(next);
}
exports.default = router;
