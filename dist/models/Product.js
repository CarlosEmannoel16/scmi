"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModelActions = exports.Product = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.Product = mysql_1.sequelize.define('Product', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    price_buy: {
        type: sequelize_1.DataTypes.INTEGER,
        get() {
            return this.getDataValue('price_buy').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        }
    },
    price_sale: {
        type: sequelize_1.DataTypes.INTEGER,
        get() {
            return this.getDataValue('price_sale').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        }
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER
    },
    number_category: {
        type: sequelize_1.DataTypes.INTEGER
    },
    minimum_quantity: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'products',
    timestamps: false
});
exports.productModelActions = {
    getCountProduct: async () => {
        return await exports.Product.count();
    },
    getProductSale: async (id) => {
        return await exports.Product.findOne({
            attributes: ['id', 'description', 'price_sale', 'quantity'],
            where: {
                id
            }
        });
    },
    getProductById: async (idOfProducts) => {
        return await exports.Product.findOne({
            where: {
                id: idOfProducts
            }
        });
    },
    getProductByName: async (nameOfroduct) => {
        return await exports.Product.findAll({
            where: {
                description: {
                    [sequelize_1.Op.like]: `%${nameOfroduct}%`
                }
            }
        });
    },
    getAllProducts: async () => {
        return await exports.Product.findAll();
    },
    registerProduct: async (dataOfProducts) => {
        return await exports.Product.create({
            description: dataOfProducts.description,
            price_buy: dataOfProducts.price_buy,
            price_sale: dataOfProducts.price_sale,
            quantity: dataOfProducts.quantity,
            number_category: dataOfProducts.number_category,
            minimum_quantity: dataOfProducts.minimum_quantity
        });
    },
    updateProduct: async (id, dataOfProducts) => {
        await exports.Product.update({
            description: dataOfProducts.description,
            price_buy: dataOfProducts.price_buy,
            price_sale: dataOfProducts.price_sale,
            quantity: dataOfProducts.quantity,
            number_category: dataOfProducts.number_category,
            minimum_quantity: dataOfProducts.minimum_quantity
        }, {
            where: {
                id
            }
        });
    },
    deleteProductById: async (id) => {
        await exports.Product.destroy({
            where: {
                id
            }
        });
    },
    getLimitProducts: async (offset, limit) => {
        return await exports.Product.findAll({
            offset: offset,
            limit: limit,
        });
    }
};
