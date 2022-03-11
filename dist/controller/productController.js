"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductAction = exports.editProductAction = exports.searchProducts = exports.getProductById = exports.newProduct = exports.newProductView = exports.product = void 0;
const verification = __importStar(require("../helpers/verification"));
const formatNumber = __importStar(require("../helpers/formatNumber"));
const Product_1 = require("../models/Product");
const product = async (req, res) => {
    let limit = 15;
    let page = parseInt(req.params.page);
    let pageRange = page >= 1 ? page * limit : 1;
    let productSearchResult = await Product_1.productModelActions.getLimitProducts(pageRange, limit);
    let numberOfProducts = await Product_1.productModelActions.getCountProduct();
    let numberOfPages = Math.round(numberOfProducts / limit);
    let numberViewOfPages = 5;
    let arrayPage = [];
    console.log(numberOfProducts);
    console.log(numberViewOfPages);
    if (page < 5) {
        let index = 0;
        while (index < numberViewOfPages) {
            index++;
            arrayPage.push({ 'page': index });
        }
    }
    else if (page >= 5) {
        let limitPage = numberViewOfPages + page;
        let index = page - 3;
        while (index < limitPage) {
            console.log('jhjh');
            if (index == numberOfPages) {
                arrayPage.push({ 'page': index });
                break;
            }
            arrayPage.push({ 'page': index });
            index++;
        }
    }
    res.render("pages/products", {
        productSearchResult,
        currentPage: page,
        arrayPage
    });
};
exports.product = product;
const newProductView = (req, res) => {
    res.render("pages/product-add", {
        valuesInput: true
    });
};
exports.newProductView = newProductView;
const newProduct = async (req, res) => {
    let showAdd = false;
    let description = req.body.description;
    let price_buy = req.body.price_buy;
    let price_sale = req.body.price_sale;
    let quantity = req.body.quantity;
    let number_category = req.body.number_category;
    let minimum_quantity = req.body.minimum_quantity;
    let sucess = false;
    if (description && price_buy && price_sale && quantity && number_category) {
        const productData = {
            description,
            price_buy: formatNumber.removeSpecialCharactersAndConvertToFloat(price_buy),
            price_sale: formatNumber.removeSpecialCharactersAndConvertToFloat(price_sale),
            quantity,
            number_category,
            minimum_quantity
        };
        await Product_1.productModelActions.registerProduct(productData);
        sucess = true;
    }
    else {
        req.flash('errors', 'Ops!, Revise os Campos e tente novamente');
    }
    res.render("pages/product-add", {
        showAdd,
        exception: res.locals.errors,
        valuesInput: req.body,
        sucess
    });
};
exports.newProduct = newProduct;
const getProductById = async (req, res) => {
    let idProduct = parseInt(req.params.id);
    let product;
    if (idProduct) {
        product = await Product_1.productModelActions.getProductById(idProduct);
        if (product) {
            let checkStock = verification.checkIfStockIsLow(product.quantity, product.minimum_quantity);
            let checkProfit = verification.checkProfit(product.price_buy, product.price_sale);
            res.render('pages/products-view', {
                product,
                checkStock,
                checkProfit
            });
        }
        else {
            res.redirect('/product');
        }
    }
};
exports.getProductById = getProductById;
const searchProducts = async (req, res) => {
    let showSearch = false;
    let showButtonReturn = false;
    let searchResultById;
    let resultSearch;
    const searchProduct = req.query.searchProduct;
    if (searchProduct) {
        resultSearch = await Product_1.productModelActions.getProductByName(searchProduct);
        if (resultSearch.length > 0) {
            showSearch = true;
            showButtonReturn = true;
        }
        else if (resultSearch.length == 0) {
            searchResultById = parseInt(searchProduct);
            if (!isNaN(searchResultById)) {
                resultSearch = await Product_1.productModelActions.getProductById(searchResultById);
                showSearch = true;
                showButtonReturn = true;
            }
            showSearch = true;
            showButtonReturn = true;
        }
        else {
            showSearch = true;
            showButtonReturn = true;
        }
        res.render('pages/products', {
            showSearch,
            resultSearch,
            showButtonReturn
        });
    }
};
exports.searchProducts = searchProducts;
const editProductAction = async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
        let productResult = await Product_1.productModelActions.getProductById(id);
        if (productResult) {
            let dataOfProduct = {
                description: req.body.description,
                price_buy: formatNumber.removeSpecialCharactersAndConvertToFloat(req.body.price_buy),
                price_sale: formatNumber.removeSpecialCharactersAndConvertToFloat(req.body.price_sale),
                quantity: parseInt(req.body.quantity),
                number_category: req.body.number_category,
                minimum_quantity: req.body.minimum_quantity
            };
            if (true /*verification.priceBuyBigThePriceSale(dataOfProduct.price_buy, dataOfProduct.price_sale)*/) {
                await Product_1.productModelActions.updateProduct(id, dataOfProduct);
                console.log(dataOfProduct);
            }
        }
    }
    res.redirect('/product');
};
exports.editProductAction = editProductAction;
const deleteProductAction = async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
        await Product_1.productModelActions.deleteProductById(id);
        res.redirect('/product');
    }
};
exports.deleteProductAction = deleteProductAction;
