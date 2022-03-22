
import { Request, Response } from 'express'
import validator from 'validator'
import { productModelActions } from '../models/Product'
import { SaleActions, SaleActionInstance, idAndProducstSaleInteface } from '../models/Sale'
import { removeSpecialCharactersAndConvertToFloat } from '../helpers/formatNumber'
import { actionsSaleFast } from '../models/SaleFast'
import { ActionsSaleDetailsFast } from '../models/SaleDetaisFast'


export const viewSale = async (req: Request, res: Response) => {
  const options: SaleActions = {
    req,
    res,

  } as SaleActions

  // const saleData = await Sale.findAll( {include:[{model:SaleDetails}], where:{id:3}}) 
  //req.session.destroy((Ferr) => { })
  let Sale = new SaleActions(options)
  console.log(Sale.getQuantitySession())
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

      const options: SaleActions = {
        req,
        res,
        cod,
        product,
        quantity
      } as SaleActions

      let Sale = new SaleActions(options)
      if (Sale.insertInSession()) {
        res.json({
          session: Sale.getSessionToCustomer(),
          currentProduct: Sale.productToSession(),
          amountSale: Sale.sumAllProducts(),
          statusAdd: 1,
        })

        return true
      } else {
        res.json({ statusAdd: 0, message: 'Estoque Indisponível' })
      }
      return true
    }
  }
  res.json({ statusAdd: 0, message: 'Produto não encontrado' })
}


export const saleDeleteProduct = async (req: Request, res: Response) => {

  let cod = req.body.cod
  const options: SaleActions = {
    req,
    res,
    cod,
  } as SaleActions

  let Sale = new SaleActions(options)

  if (validator.isInt(cod) && Sale.getProductSession().length > 0) {
    let status = Sale.deleteProduct()
    res.json({ statusSale: status })
  }
  if (req.body.search) {

  }
}

export const getAllProductsSession = async (req: Request, res: Response) => {

  const options: SaleActions = {
    req,
    res,
  } as SaleActions

  let Sale = new SaleActions(options)
  if (req.body.cod) {
    res.json({ status: true, session: Sale.getProductSession(), amountSale: Sale.sumAllProducts() })
  } else {
    res.json({ status: false })
  }
}

export const cancelSale = async (req: Request, res: Response) => {
  if (req.body.cod) {

    const options: SaleActions = {
      req,
      res,
    } as SaleActions

    let Sale = new SaleActions(options)
    Sale.clearSession()
    res.json({ status: true })
  } else {
    res.json({ status: false })
  }
}


export const finalizingTheSale = async (req: Request, res: Response) => {



  const options: SaleActions = {
    req,
    res,
  } as SaleActions

  let Sale = new SaleActions(options)
  let allProductsSale = Sale.getProductSession()
  let sumAllSale = Sale.sumAllProducts()


  if (allProductsSale.length == 0) {
    res.redirect('/sale')
  } else {
    res.render('pages/finalizing-sale', {
      allProductsSale

    })
  }
}

export const finalizingTheSalePostFast = async (req: Request, res: Response) => {


  let amountReceived = req.body.amountReceived ? removeSpecialCharactersAndConvertToFloat(req.body.amountReceived) : undefined


  const options: SaleActions = {
    req,
    res,
    amountReceived
  } as SaleActions

  let Sale = new SaleActions(options);
  let sumAllProductsOrigin = Sale.sumAllProducts() ? Sale.sumAllProducts() : Sale.getfinalizingTheSaleSession().subtractedValue

  let sumAllProducts = removeSpecialCharactersAndConvertToFloat(sumAllProductsOrigin)

  if (amountReceived) {

    if (amountReceived <= sumAllProducts) {
      Sale.lowestTotalValue()
      req.session.saleInProcess = true
      let sumAllProducts =  removeSpecialCharactersAndConvertToFloat(Sale.getfinalizingTheSaleSession().subtractedValue)

      if (sumAllProducts == 0) {

        let idSaleFast = await actionsSaleFast.addSaleFast()
        
        let products = Sale.getProductsAndIdForFinalizingSale()
        console.log(products)
        await ActionsSaleDetailsFast.addSaleDetails(idSaleFast, products)  
      }

      res.json({
        sumAllProducts
      })
    } else {
      res.json({ message: 'Valor Superior' })
    }

  } else {
    if (Sale.sumAllProducts()) {
      res.json({
        data: { subtractedValue: Sale.sumAllProducts() }
      })
    } else {
      let data = Sale.getfinalizingTheSaleSession()
      res.json({
        data
      })
    }


  }
}

