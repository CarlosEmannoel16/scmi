"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleActions = exports.Sale = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
const SaleDetails_1 = require("./SaleDetails");
const formatNumber_1 = require("../helpers/formatNumber");
const Sale = mysql_1.sequelize.define('Sale', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    id_customer: {
        type: sequelize_1.DataTypes.INTEGER
    },
    date: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    tableName: 'sales',
    underscored: true,
    timestamps: false
});
exports.Sale = Sale;
SaleDetails_1.SaleDetails.belongsTo(Sale, {
    foreignKey: 'id_sale',
});
Sale.hasMany(SaleDetails_1.SaleDetails, {
    foreignKey: 'id_sale',
});
class SaleActions {
    constructor(options) {
        this.product = options.product;
        this.quantity = options.quantity;
        this.req = options.req;
        this.res = options.res;
        this.cod = options.cod;
        this.amountReceived = options.amountReceived;
    }
    verifyQuantityProduct() {
        if (this.product && this.quantity) {
            let idProduct = this.product.id;
            let quantityAdd = this.quantity;
            let verify = false;
            let codes = this.getQuantitySession().map(item => {
                return item.id;
            });
            if (codes.indexOf(this.product.id) > -1) {
                this.getQuantitySession().forEach(item => {
                    if (item.id == idProduct) {
                        verify = quantityAdd <= item.quantityStock ? true : false;
                    }
                });
            }
            else {
                verify = quantityAdd <= this.product.quantity ? true : false;
            }
            return verify;
        }
    }
    deleteProduct() {
        let status = false;
        if (this.cod) {
            let productsSesison = this.getProductSession();
            productsSesison.map((item, index) => {
                if (item.idUnique == this.cod) {
                    productsSesison.splice(index, 1);
                    status = true;
                    return;
                }
            });
            this.req.session.sale = productsSesison;
            return status;
        }
        return status;
    }
    updateQuantityProduct() {
        if (this.product && this.quantity) {
            let idProduct = this.product.id;
            let quantity = this.quantity;
            if (this.getQuantitySession().length > 0) {
                ///   PEGAR A QUANTIDADE E O CÓDIGO DOS PRODUTOS ADICIONADOS
                let codesAndQuantity = this.getQuantitySession();
                let codes = codesAndQuantity.map(item => {
                    return item.id;
                });
                if (codes.indexOf(idProduct) == -1) {
                    codesAndQuantity.push({
                        id: this.product.id,
                        quantityStock: this.product.quantity - this.quantity
                    });
                    console.log(codesAndQuantity);
                    this.req.session.quantitySale = codesAndQuantity;
                    return true;
                }
                else {
                    let updateQuantity = codesAndQuantity.map(item => {
                        if (item.id == idProduct) {
                            item.quantityStock -= quantity;
                            return item;
                        }
                        else {
                            return item;
                        }
                    });
                    console.log(updateQuantity);
                    this.req.session.quantitySale = updateQuantity;
                }
            }
            else {
                let codesAndQuantity = this.getQuantitySession();
                codesAndQuantity.push({
                    id: this.product.id,
                    quantityStock: this.product.quantity - this.quantity
                });
                console.log(codesAndQuantity);
                this.req.session.quantitySale = codesAndQuantity;
            }
        }
    }
    multiplyValueByQuantity() {
        if (this.product && this.quantity) {
            let priceSale = (0, formatNumber_1.removeSpecialCharactersAndConvertToFloat)(this.product.price_sale.toString()) * this.quantity;
            return priceSale;
        }
    }
    getProductSession() {
        let dataSession = [];
        if (this.req.session.sale)
            return dataSession = this.req.session.sale;
        return dataSession;
    }
    getSessionToCustomer() {
        let products = this.getProductSession();
        let dataProductsForCustomer = products.map((item) => {
            delete item.quantityStock;
            return item;
        });
    }
    getQuantitySession() {
        let dataQuantity = [];
        if (this.req.session.quantitySale)
            return dataQuantity = this.req.session.quantitySale;
        return dataQuantity;
    }
    prepareProductToSession() {
        if (this.product) {
            if (this.verifyQuantityProduct()) {
                let quantityInStock = this.product.quantity;
                let amount = (0, formatNumber_1.formatMoney)(this.multiplyValueByQuantity());
                let idProductSession = this.getProductSession().length;
                let id = this.product.id;
                let idUnique = this.product.id + idProductSession + Math.random() * 900 | 0;
                let description = this.product.description;
                let priceSale = (0, formatNumber_1.formatMoney)(this.product.price_sale);
                let quantitySale = this.quantity;
                let product = { id, idUnique, description, priceSale, quantitySale, amount, quantityInStock };
                return product;
            }
        }
        return false;
    }
    productToSession() {
        let dataProduct = this.prepareProductToSession();
        if (dataProduct) {
            delete dataProduct.quantityStock;
            return dataProduct;
        }
    }
    clearSession() {
        this.req.session.sale = [];
    }
    sumAllProducts() {
        let products = this.getProductSession();
        if (products.length > 1) {
            let productsAmount = products.map(item => (0, formatNumber_1.removeSpecialCharactersAndConvertToFloat)(item.amount))
                .reduce((accumalator, current) => {
                return accumalator += current;
            });
            return (0, formatNumber_1.formatMoney)(productsAmount);
        }
        else if (products.length == 1) {
            return products.map(item => item.amount).toString();
        }
        else {
            return '';
        }
    }
    lowestTotalValue() {
        let amountReceived = this.amountReceived;
        if (amountReceived && amountReceived > 0) {
            let sumAllProducts = this.sumAllProducts();
            if (sumAllProducts != '') {
                let amountTotal = (0, formatNumber_1.removeSpecialCharactersAndConvertToFloat)(this.sumAllProducts());
                console.log('AmountTotal da função', amountTotal);
                let subtractedValueOrigin = amountTotal - amountReceived;
                console.log('subtractedValueOrigin', subtractedValueOrigin);
                if (subtractedValueOrigin > 1) {
                    subtractedValueOrigin;
                }
                else {
                    subtractedValueOrigin.toFixed(2);
                }
                let subtractedValue = (0, formatNumber_1.formatMoney)(subtractedValueOrigin);
                console.log('subtractedValue', subtractedValue);
                let session = [{ products: this.getProductSession(), subtractedValue }];
                this.req.session.sale = session;
            }
            else {
                let subtractedValueOrigin = (0, formatNumber_1.removeSpecialCharactersAndConvertToFloat)(this.getProductSession()[0].subtractedValue);
                subtractedValueOrigin = subtractedValueOrigin - amountReceived;
                let products = this.getProductSession()[0].products;
                if (subtractedValueOrigin > 1) {
                    subtractedValueOrigin;
                }
                else {
                    subtractedValueOrigin.toFixed(2);
                }
                let subtractedValue = (0, formatNumber_1.formatMoney)(subtractedValueOrigin);
                let prepareSession = {
                    products,
                    subtractedValue
                };
                let session = [prepareSession];
                this.req.session.sale = session;
            }
        }
    }
    getfinalizingTheSaleSession() {
        let data = this.getProductSession()[0];
        return data;
    }
    insertInSession() {
        if (this.verifyQuantityProduct()) {
            let dataSession = this.getProductSession();
            let dataProduct = this.prepareProductToSession();
            dataSession.unshift(dataProduct);
            this.req.session.sale = dataSession;
            this.updateQuantityProduct();
            return true;
        }
        return false;
    }
}
exports.SaleActions = SaleActions;
