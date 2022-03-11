"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareGlobal = void 0;
const middlewareGlobal = async (req, res, next) => {
    res.locals.errors = req.flash('errors');
    next();
};
exports.middlewareGlobal = middlewareGlobal;
