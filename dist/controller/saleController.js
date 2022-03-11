"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizingTheSalePostFast = exports.finalizingTheSale = exports.cancelSale = exports.getAllProductsSession = exports.saleDeleteProduct = exports.saleVerificationProduct = exports.viewSale = void 0;
const validator_1 = __importDefault(require("validator"));
const Product_1 = require("../models/Product");
const Sale_1 = require("../models/Sale");
const formatNumber_1 = require("../helpers/formatNumber");
const viewSale = async (req, res) => {
    const options = {
        req,
        res,
    };
    // const saleData = await Sale.findAll( {include:[{model:SaleDetails}], where:{id:3}}) 
    //req.session.destroy((Ferr) => { })
    let Sale = new Sale_1.SaleActions(options);
    console.log(Sale.getQuantitySession());
    res.render('pages/sale', {});
};
exports.viewSale = viewSale;
const saleVerificationProduct = async (req, res) => {
    let cod = req.body.cod;
    let quantity = req.body.quantity;
    if (validator_1.default.isInt(cod) && validator_1.default.isInt(quantity)) {
        let product = await Product_1.productModelActions.getProductSale(cod);
        if (product) {
            parseInt(quantity);
            const options = {
                req,
                res,
                cod,
                product,
                quantity
            };
            let Sale = new Sale_1.SaleActions(options);
            if (Sale.insertInSession()) {
                res.json({
                    session: Sale.getSessionToCustomer(),
                    currentProduct: Sale.productToSession(),
                    amountSale: Sale.sumAllProducts(),
                    statusAdd: 1,
                });
                return true;
            }
            else {
                res.json({ statusAdd: 0, message: 'Estoque Indisponível' });
            }
            return true;
        }
    }
    res.json({ statusAdd: 0, message: 'Produto não encontrado' });
};
exports.saleVerificationProduct = saleVerificationProduct;
const saleDeleteProduct = async (req, res) => {
    let cod = req.body.cod;
    const options = {
        req,
        res,
        cod,
    };
    let Sale = new Sale_1.SaleActions(options);
    if (validator_1.default.isInt(cod) && Sale.getProductSession().length > 0) {
        let status = Sale.deleteProduct();
        res.json({ statusSale: status });
    }
    if (req.body.search) {
    }
};
exports.saleDeleteProduct = saleDeleteProduct;
const getAllProductsSession = async (req, res) => {
    const options = {
        req,
        res,
    };
    let Sale = new Sale_1.SaleActions(options);
    if (req.body.cod) {
        res.json({ status: true, session: Sale.getProductSession(), amountSale: Sale.sumAllProducts() });
    }
    else {
        res.json({ status: false });
    }
};
exports.getAllProductsSession = getAllProductsSession;
const cancelSale = async (req, res) => {
    if (req.body.cod) {
        const options = {
            req,
            res,
        };
        let Sale = new Sale_1.SaleActions(options);
        Sale.clearSession();
        res.json({ status: true });
    }
    else {
        res.json({ status: false });
    }
};
exports.cancelSale = cancelSale;
const finalizingTheSale = async (req, res) => {
    const options = {
        req,
        res,
    };
    let Sale = new Sale_1.SaleActions(options);
    let allProductsSale = Sale.getProductSession();
    let sumAllSale = Sale.sumAllProducts();
    if (allProductsSale.length == 0) {
        res.redirect('/sale');
    }
    else {
        res.render('pages/finalizing-sale', {
            allProductsSale
        });
    }
};
exports.finalizingTheSale = finalizingTheSale;
const finalizingTheSalePostFast = async (req, res) => {
    let amountReceived = req.body.amountReceived ? (0, formatNumber_1.removeSpecialCharactersAndConvertToFloat)(req.body.amountReceived) : undefined;
    const options = {
        req,
        res,
        amountReceived
    };
    let Sale = new Sale_1.SaleActions(options);
    let sumAllProductsOrigin = Sale.sumAllProducts() ? Sale.sumAllProducts() : Sale.getfinalizingTheSaleSession().subtractedValue;
    let sumAllProducts = (0, formatNumber_1.removeSpecialCharactersAndConvertToFloat)(sumAllProductsOrigin);
    console.log(sumAllProducts);
    console.log(req.session.sale);
    if (amountReceived) {
        if (amountReceived <= sumAllProducts) {
            console.log('passou aqui');
            Sale.lowestTotalValue();
            req.session.saleInProcess = true;
            let data = Sale.getProductSession();
            data = data[0];
            res.json({
                data
            });
        }
        else {
            res.json({ message: 'Valor Superior' });
        }
    }
    else {
        if (Sale.sumAllProducts()) {
            res.json({
                data: { subtractedValue: Sale.sumAllProducts() }
            });
        }
        else {
            let data = Sale.getfinalizingTheSaleSession();
            res.json({
                data
            });
        }
    }
};
exports.finalizingTheSalePostFast = finalizingTheSalePostFast;
