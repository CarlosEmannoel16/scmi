"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMoney = exports.removeSpecialCharactersAndConvertToFloat = void 0;
const removeSpecialCharactersAndConvertToFloat = (value) => {
    return parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.'));
};
exports.removeSpecialCharactersAndConvertToFloat = removeSpecialCharactersAndConvertToFloat;
const formatMoney = (value) => {
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
};
exports.formatMoney = formatMoney;
