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
const express_1 = require("express");
const homeController = __importStar(require("../controller/homeController"));
const productController = __importStar(require("../controller/productController"));
const customerController = __importStar(require("../controller/customerController"));
const saleController = __importStar(require("../controller/saleController"));
const middlewareSale_1 = require("../middleware/middlewareSale");
const middlewareGlobal_1 = require("../middleware/middlewareGlobal");
const router = (0, express_1.Router)();
router.get('/', homeController.home);
router.get('/product/:page', productController.product);
router.post('/new-product', middlewareGlobal_1.middlewareGlobal, productController.newProduct);
router.get('/new-product', middlewareGlobal_1.middlewareGlobal, productController.newProductView);
router.get('/products/:id', productController.getProductById);
router.get('/search-product', productController.searchProducts);
router.post('/edit-product/:id', productController.editProductAction);
router.get('/deleteProduct/:id', productController.deleteProductAction);
router.get('/customers', customerController.customers);
router.get('/search-customers', customerController.customersSearch);
router.post('/new-customer', customerController.newCustomers);
router.get('/new-customer', customerController.newCustomersView);
router.get('/customer/:id', customerController.getCustomerById);
router.get('/sale', middlewareSale_1.middlewareCheckSale, saleController.viewSale);
router.post('/sale', saleController.saleVerificationProduct);
router.post('/sale-product-delete', saleController.saleDeleteProduct);
router.post('/sale-product-all', saleController.getAllProductsSession);
router.post('/cancel-sale', saleController.cancelSale);
router.get('/finalizing-Sale', saleController.finalizingTheSale);
router.post('/finalizing-sale-fast', saleController.finalizingTheSalePostFast);
exports.default = router;
