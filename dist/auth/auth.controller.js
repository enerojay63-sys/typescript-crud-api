"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const validate_request_1 = require("_middleware/validate-request");
const auth_service_1 = require("auth/auth.service");
const jwt_1 = require("_helpers/jwt");
const router = express_1.default.Router();
router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmail);
router.post('/login', loginSchema, login);
router.get('/profile', jwt_1.authenticateToken, getProfile);
function registerSchema(req, res, next) {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required()
    });
    (0, validate_request_1.validateRequest)(req, next, schema);
}
function register(req, res, next) {
    auth_service_1.authService
        .register(req.body)
        .then(() => res.json({ message: 'Registration successful! Please verify your email.' }))
        .catch(next);
}
function verifyEmail(req, res, next) {
    const { email } = req.body;
    auth_service_1.authService
        .verifyEmail(email)
        .then(() => res.json({ message: 'Email verified successfully! You can now login.' }))
        .catch(next);
}
function loginSchema(req, res, next) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required()
    });
    (0, validate_request_1.validateRequest)(req, next, schema);
}
function login(req, res, next) {
    const { email, password } = req.body;
    auth_service_1.authService
        .login(email, password)
        .then(data => res.json(data))
        .catch(next);
}
function getProfile(req, res, next) {
    auth_service_1.authService
        .getProfile(req.user.id)
        .then(user => res.json(user))
        .catch(next);
}
exports.default = router;
