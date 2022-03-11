"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProfit = exports.checkIfStockIsLow = exports.priceBuyBigThePriceSale = void 0;
const formatNumber_1 = require("./formatNumber");
const priceBuyBigThePriceSale = (priceBuy, priceSale) => {
    return priceBuy <= priceSale ? true : false;
};
exports.priceBuyBigThePriceSale = priceBuyBigThePriceSale;
const checkIfStockIsLow = (quantityInStock, minimumAmountAllowed) => {
    return quantityInStock <= minimumAmountAllowed ? true : false;
};
exports.checkIfStockIsLow = checkIfStockIsLow;
const checkProfit = (priceBuy, priceSale) => {
    let profit = (0, formatNumber_1.removeSpecialCharactersAndConvertToFloat)(priceSale.toString()) - (0, formatNumber_1.removeSpecialCharactersAndConvertToFloat)(priceBuy.toString());
    if (profit > 0) {
        let data = {
            message: `Lucro com cada venda: ${profit.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`,
            status: true
        };
        return data;
    }
    else if (profit < 0) {
        let data = {
            message: `Você obterar Projuizo com a venda deste produto: ${profit.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`,
            status: false
        };
        return data;
    }
    else {
        let data = {
            message: `Produto sem lucro`,
            status: true
        };
        return data;
    }
};
exports.checkProfit = checkProfit;
