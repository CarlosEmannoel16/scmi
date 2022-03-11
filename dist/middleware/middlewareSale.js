"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareCheckSale = void 0;
let middlewareCheckSale = (req, res, next) => {
    let saleSession = req.session.saleInProcess;
    if (saleSession) {
        res.redirect('/finalizing-Sale');
    }
    else {
        next();
    }
};
exports.middlewareCheckSale = middlewareCheckSale;
