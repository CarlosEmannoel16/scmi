import { reverse } from 'dns'
import { Request, Response } from 'express'
import { Sale } from '../models/Sale'
import { SaleDetails } from '../models/SaleDetails'
import { Product, productModelActions } from '../models/Product'

export const viewSale = async (req: Request, res: Response) => {
  // const saleData = await Sale.findAll( {include:[{model:SaleDetails}], where:{id:3}}) 




  res.render('pages/sale', {

  })
}

export const saleVerificationProduct = async (req: Request, res: Response) => {

  let cod = parseInt(req.params.cod)

  if (!isNaN(cod)) {
    let product = await productModelActions.getProductById(cod)
    if (product) {
      res.json({ product })
    }

  }

}

export const saleRenderProduct = async (req: Request, res: Response) => {

  let dataProducts = req.body

  res.json(dataProducts)

}





