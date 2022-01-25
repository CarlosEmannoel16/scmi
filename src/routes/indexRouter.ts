import {Router} from 'express'
import * as homeController from '../controller/homeController'
import * as productController from '../controller/productController'
import * as customerController from  '../controller/customerController'
import * as saleController from '../controller/saleController'


const router = Router()

router.get('/', homeController.home)
router.get('/product', productController.product)
router.post('/new-product', productController.newProduct)
router.get('/new-product', productController.newProductView)
router.get('/products/:id', productController.getProductById)
router.get('/search-product', productController.searchProducts)
router.post('/edit-product/:id' , productController.editProductAction)
router.get('/deleteProduct/:id',productController.deleteProductAction)

router.get('/customers', customerController.customers)
router.get('/search-customers', customerController.customersSearch)
router.post('/new-customer', customerController.newCustomers)
router.get('/new-customer', customerController.newCustomersView)
router.get('/customer/:id', customerController.getCustomerById)

router.get('/sale', saleController.viewSale)
router.post('/sale', saleController.saleVerificationProduct)
router.post('/sale-product-delete', saleController.saleDeleteProduct)
router.post('/sale-product-all', saleController.getAllProductsSession)
router.post('/cancel-sale', saleController.cancelSale)



export default router