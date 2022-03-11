"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mustache_express_1 = __importDefault(require("mustache-express"));
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const mysql_1 = require("./instances/mysql");
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
const connect_flash_1 = __importDefault(require("connect-flash"));
let storage = (0, connect_session_sequelize_1.default)(express_session_1.default.Store);
dotenv_1.default.config();
const server = (0, express_1.default)();
server.use((0, express_session_1.default)({
    secret: 'jsjsjsjsioha',
    store: new storage({
        db: mysql_1.sequelize,
        expiration: 24 * 60 * 60 * 1000
    }),
    resave: false,
    saveUninitialized: false
}));
server.use((0, connect_flash_1.default)());
server.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
server.set('view engine', 'mustache');
server.set('views', path_1.default.join(__dirname, 'views'));
server.engine('mustache', (0, mustache_express_1.default)());
server.use(express_1.default.urlencoded({ extended: true }));
server.use(express_1.default.json());
server.use(indexRouter_1.default);
server.listen(process.env.PORT);
