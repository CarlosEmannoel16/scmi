"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerById = exports.customersSearch = exports.newCustomers = exports.newCustomersView = exports.customers = void 0;
const Customer_1 = require("../models/Customer");
const customers = async (req, res) => {
    const customersResult = await Customer_1.customerModelActions.getAllCustoemers();
    res.render('pages/customers', {
        customersResult
    });
};
exports.customers = customers;
const newCustomersView = async (req, res) => {
    res.render('pages/customers-add');
};
exports.newCustomersView = newCustomersView;
const newCustomers = async (req, res) => {
    let dataOfCustomer = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        surname: req.body.surname,
        street: req.body.street,
        district: req.body.district,
        city: req.body.city,
        number: req.body.number,
        phone: req.body.phone,
        email: req.body.email
    };
    if (dataOfCustomer.first_name && dataOfCustomer.last_name && dataOfCustomer.city) {
        await Customer_1.customerModelActions.registerCustomer(dataOfCustomer);
        res.redirect('/customer');
    }
    else {
        res.redirect('/new-customer');
    }
};
exports.newCustomers = newCustomers;
const customersSearch = async (req, res) => {
    let showSearch = false;
    let showButtonReturn = false;
    let searchCustomer = req.query.searchCustomer;
    let resultSearch;
    let searchResultById;
    if (searchCustomer) {
        resultSearch = await Customer_1.customerModelActions.getCustomerByName(searchCustomer);
        console.log(resultSearch.length);
        if (resultSearch.length > 0) {
            showSearch = true;
            showButtonReturn = true;
        }
        else if (resultSearch.length == 0) {
            searchResultById = parseInt(searchCustomer);
            if (!isNaN(searchResultById)) {
                resultSearch = await Customer_1.customerModelActions.getProductById(searchResultById);
                showSearch = true;
                showButtonReturn = true;
            }
            else {
                showSearch = true;
                showButtonReturn = true;
            }
        }
        else {
            showSearch = true;
            showButtonReturn = true;
        }
    }
    res.render('pages/customers', {
        showButtonReturn,
        showSearch,
        resultSearch
    });
};
exports.customersSearch = customersSearch;
const getCustomerById = async (req, res) => {
    let idOfProduct = parseInt(req.params.id);
    let dataCustomer;
    if (idOfProduct) {
        dataCustomer = await Customer_1.customerModelActions.getProductById(idOfProduct);
    }
    res.render('pages/customer-view', {
        dataCustomer
    });
};
exports.getCustomerById = getCustomerById;
