"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerModelActions = exports.Customer = void 0;
const mysql_1 = require("../instances/mysql");
const sequelize_1 = require("sequelize");
exports.Customer = mysql_1.sequelize.define('Customer', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING
    },
    surname: {
        type: sequelize_1.DataTypes.STRING
    },
    street: {
        type: sequelize_1.DataTypes.STRING
    },
    district: {
        type: sequelize_1.DataTypes.STRING
    },
    city: {
        type: sequelize_1.DataTypes.STRING
    },
    number: {
        type: sequelize_1.DataTypes.STRING
    },
    phone: {
        type: sequelize_1.DataTypes.STRING
    },
    email: {
        type: sequelize_1.DataTypes.STRING
    },
    fullName: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return `${this.first_name} ${this.last_name}`;
        }
    },
    fullAddress: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return `${this.street}, ${this.district} - ${this.city} Nº ${this.number}`;
        }
    }
}, {
    tableName: 'customers',
    timestamps: false
});
exports.customerModelActions = {
    getProductById: async (idOfProduct) => {
        return await exports.Customer.findOne({
            where: {
                id: idOfProduct
            }
        });
    },
    getAllCustoemers: async () => {
        return await exports.Customer.findAll();
    },
    getCustomerByName: async (nameOfCustomer) => {
        return await exports.Customer.findAll({
            where: {
                first_name: {
                    [sequelize_1.Op.like]: `%${nameOfCustomer}%`
                }
            }
        });
    },
    registerCustomer: async (dataOfCustomers) => {
        await exports.Customer.create({
            first_name: dataOfCustomers.first_name,
            last_name: dataOfCustomers.last_name,
            surname: dataOfCustomers.surname,
            street: dataOfCustomers.street,
            district: dataOfCustomers.district,
            city: dataOfCustomers.city,
            number: dataOfCustomers.number,
            phone: dataOfCustomers.phone,
            email: dataOfCustomers.email
        });
    }
};
