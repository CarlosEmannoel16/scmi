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
  let showUpdate = false
  let id: number = parseInt(req.params.id)
  if (!isNaN(id)) {
    let productResult = await productModelActions.getProductById(id)
    let dataOfProduct = {
      description: req.body.description,
      price_buy: parseInt(req.body.price_buy.replace('R$', '')),
      price_sale: parseInt(req.body.price_sale.replace('R$', '')),
      quantity: parseInt(req.body.quantity),
      number_category: req.body.number_category
    } as ProductInstance
    console.log(dataOfProduct)
    if (productResult) {
      await productModelActions.updateProduct(id, dataOfProduct)
      showUpdate = true
      res.redirect(`/products/${id}`)

    }
  }
}
