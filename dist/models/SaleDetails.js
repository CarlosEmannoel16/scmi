"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleDetails = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.SaleDetails = mysql_1.sequelize.define('saleDetails', {
    id_sale: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    id_product: {
        type: sequelize_1.DataTypes.INTEGER
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'sale_details',
    underscored: true,
    timestamps: false
});
exports.SaleDetails.removeAttribute('id');
