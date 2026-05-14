"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const validate_request_1 = require("_middleware/validate-request");
const role_1 = require("_helpers/role");
const user_service_1 = require("users/user.service");
const router = express_1.default.Router();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', remove);
function getAll(req, res, next) {
    user_service_1.userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}
function getById(req, res, next) {
    user_service_1.userService.getById(Number(req.params.id))
        .then(user => res.json(user))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        role: joi_1.default.string().valid(...Object.values(role_1.Role)).required()
    });
    (0, validate_request_1.validateRequest)(req, next, schema);
}
function create(req, res, next) {
    const userData = {
        ...req.body,
        passwordHash: req.body.password
    };
    delete userData.password;
    user_service_1.userService.create(userData)
        .then(() => res.json({ message: 'User created successfully' }))
        .catch(next);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().empty(''),
        lastName: joi_1.default.string().empty(''),
        email: joi_1.default.string().email().empty(''),
        password: joi_1.default.string().min(6).empty(''),
        role: joi_1.default.string().valid(...Object.values(role_1.Role)).empty('')
    });
    (0, validate_request_1.validateRequest)(req, next, schema);
}
function update(req, res, next) {
    const params = { ...req.body };
    if (params.password) {
        params.passwordHash = params.password;
        delete params.password;
    }
    user_service_1.userService.update(Number(req.params.id), params)
        .then(() => res.json({ message: 'User updated successfully' }))
        .catch(next);
}
function remove(req, res, next) {
    user_service_1.userService.remove(Number(req.params.id))
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}
exports.default = router;
