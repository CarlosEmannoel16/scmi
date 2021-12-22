import {Router} from 'express'
import * as homeController from '../controller/homeController'
import * as productController from '../controller/productController'
import * as customerController from  '../controller/customerController'


const router = Router()

router.get('/', homeController.home)
router.get('/product', productController.product)
router.post('/new-product', productController.newProduct)
router.get('/new-product', productController.newProductView)
router.get('/products/:id', productController.getProductById)
router.get('/search-product', productController.searchProducts)
router.get('/customers', customerController.customers)
router.get('/new-customer', customerController.newCustomers)

export default router