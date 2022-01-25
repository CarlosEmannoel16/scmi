
import { Request, Response } from 'express'
import validator from 'validator'
import { productModelActions, ProductInstance } from '../models/Product'
import flash from 'connect-flash'
import { SaleActions } from '../models/Sale'


export const viewSale = async (req: Request, res: Response) => {
  // const saleData = await Sale.findAll( {include:[{model:SaleDetails}], where:{id:3}}) 
  //req.session.destroy((err) => { })

  console.log(req.session.sale)
  res.render('pages/sale', {

  })
}

export const saleVerificationProduct = async (req: Request, res: Response) => {

  let cod = req.body.cod
  let quantity = req.body.quantity
  if (validator.isInt(cod) && validator.isInt(quantity)) {
    let product = await productModelActions.getProductSale(cod)
    if (product) {
      parseInt(quantity)
      let Sale = new SaleActions(req, res, cod, product, quantity)
      if (Sale.insertInSession()) {
        console.log(Sale.sumAllProducts())
        res.json({
          session: req.session.sale,
          currentProduct: Sale.prepareSessionToReturnToCustomer(),
          amountSale: Sale.sumAllProducts(),
          statusAdd: 1
        })
        return true
      }
      return true
    }
  }
  res.json({ statusAdd: 0 })

}

export const saleDeleteProduct = async (req: Request, res: Response) => {

  let cod = req.body.cod
  let Sale = new SaleActions(req, res, cod)
  console.log(Sale.getProductSession())
  if (validator.isInt(cod) && Sale.getProductSession().length > 0) {
    let status = Sale.deleteProduct()
    res.json({ statusSale: status })
  }

  if (req.body.search) {

  }
}



export const getAllProductsSession = async (req: Request, res: Response) => {
  let Sale = new SaleActions(req, res)
  if (req.body.cod) {
    res.json({ status: true, session: Sale.getProductSession(), amountSale: Sale.sumAllProducts() })
  } else {
    res.json({ status: false })
  }
}

export const cancelSale = async (req: Request, res: Response) => {

  if (req.body.cod) {
    req.session.destroy(item => item)
    res.json({ status: true })
  } else {
    res.json({ status: false })
  }
}


