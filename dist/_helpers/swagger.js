"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const swaggerPath = path_1.default.join(process.cwd(), 'swagger.yaml');
const swaggerDocument = yamljs_1.default.load(swaggerPath);
const options = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css'
};
router.use('/', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument, options));
exports.default = router;
