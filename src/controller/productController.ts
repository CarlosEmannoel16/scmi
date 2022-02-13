import { Request, Response } from 'express'
import { sequelize } from '../instances/mysql'
import * as verification from '../helpers/verification'
import * as formatNumber from '../helpers/formatNumber'
import { productModelActions, ProductInstance } from '../models/Product'
import validator from 'validator'



export const product = async (req: Request, res: Response) => {

  const productSearchResult = await productModelActions.getAllProducts()


  res.render("pages/products", {
    productSearchResult
  })
}
export const newProductView = (req: Request, res: Response) => {
  res.render("pages/product-add")
}

export const newProduct = async (req: Request, res: Response) => {

  let showAdd = false

  let description = req.body.description
  let price_buy = req.body.price_buy
  let price_sale = req.body.price_sale
  let quantity = req.body.quantity
  let number_category = req.body.number_category
  let minimum_quantity = req.body.minimum_quantity

  if (description && price_buy && price_sale && quantity && number_category) {
   
      const productData: ProductInstance = {
        description,
        price_buy: formatNumber.removeSpecialCharactersAndConvertToFloat(price_buy),
        price_sale: formatNumber.removeSpecialCharactersAndConvertToFloat(price_sale),
        quantity,
        number_category,
        minimum_quantity

      } as ProductInstance

      await productModelActions.registerProduct(productData)

  } else {
    req.flash('exceptions', 'Revise os Campos e tente novamente')
  }

  res.render("pages/product-add", {
    showAdd,
    exception: req.flash('exceptions')
  })


}

export const getProductById = async (req: Request, res: Response) => {
  let idProduct = parseInt(req.params.id as string)
  let product

  if (idProduct) {
    product = await productModelActions.getProductById(idProduct)
    if (product) {
      let checkStock = verification.checkIfStockIsLow(product.quantity, product.minimum_quantity)
      let checkProfit = verification.checkProfit(product.price_buy, product.price_sale)
      res.render('pages/products-view', {
        product,
        checkStock,
        checkProfit
      })
    } else {
      res.redirect('/product')
    }
  }



}

export const searchProducts = async (req: Request, res: Response) => {
  let showSearch = false
  let showButtonReturn = false
  let searchResultById: number
  let resultSearch
  const searchProduct: string = req.query.searchProduct as string

  if (searchProduct) {
    resultSearch = await productModelActions.getProductByName(searchProduct)
    if (resultSearch.length > 0) {
      showSearch = true
      showButtonReturn = true
    } else if (resultSearch.length == 0) {
      searchResultById = parseInt(searchProduct)
      if (!isNaN(searchResultById)) {
        resultSearch = await productModelActions.getProductById(searchResultById)
        showSearch = true
        showButtonReturn = true
      }
      showSearch = true
      showButtonReturn = true
    } else {
      showSearch = true
      showButtonReturn = true
    }
    res.render('pages/products', {
      showSearch,
      resultSearch,
      showButtonReturn
    })

  }
}



export const editProductAction = async (req: Request, res: Response) => {
  let id: number = parseInt(req.params.id)
  if (id) {
    let productResult = await productModelActions.getProductById(id)
    if (productResult) {
      let dataOfProduct = {
        description: req.body.description,
        price_buy: formatNumber.removeSpecialCharactersAndConvertToFloat(req.body.price_buy),
        price_sale: formatNumber.removeSpecialCharactersAndConvertToFloat(req.body.price_sale),
        quantity: parseInt(req.body.quantity),
        number_category: req.body.number_category,
        minimum_quantity: req.body.minimum_quantity
      } as ProductInstance

      if (true /*verification.priceBuyBigThePriceSale(dataOfProduct.price_buy, dataOfProduct.price_sale)*/) {
        await productModelActions.updateProduct(id, dataOfProduct)
        console.log(dataOfProduct)
      }

    }
  }
  res.redirect('/product')
}

export const deleteProductAction = async (req: Request, res: Response) => {

  let id: number = parseInt(req.params.id)
  if (id) {
    await productModelActions.deleteProductById(id)
    res.redirect('/product')
  }

}
