import { Request, Response } from 'express'
import { sequelize } from '../instances/mysql'
import { productModelActions, ProductInstance } from '../models/Product'

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

  let description = req.body.description
  let price_buy = req.body.price_buy
  let price_sale = req.body.price_sale
  let quantity = req.body.quantity
  let number_category = req.body.number_category

  if (description && price_buy && price_sale && quantity && number_category) {
    console.log('passou')
    const productData: ProductInstance = {
      description,
      price_buy,
      price_sale,
      quantity,
      number_category

    } as ProductInstance

    await productModelActions.registerProduct(productData)
  }

  res.render("pages/product-add")

}



export const getProductById = async (req: Request, res: Response) => {
  let idProduct = parseInt(req.params.id as string)
  let product

  if (idProduct) {
    product = await productModelActions.getProductById(idProduct)
  }

  res.render('pages/products-view', {
    product
  })

}

export const searchProducts = async (req: Request, res: Response) => {
  let showSearch = false
  let showButtonReturn = false
  const nameProduct: string = req.query.nameSearch as string

  if (nameProduct) {
    const resultSearch = await productModelActions.getProductByName(nameProduct)
    if (resultSearch) {
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