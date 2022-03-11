"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.Session = mysql_1.sequelize.define('Session', {
    sid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    expires: {
        type: sequelize_1.DataTypes.DATE
    },
    data: {
        type: sequelize_1.DataTypes.STRING(50000)
    }
}, {
    tableName: 'Sessions'
});
