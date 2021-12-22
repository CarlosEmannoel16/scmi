import {Request, Response} from 'express'

export const customers = (req: Request, res: Response)=>{
  res.render('pages/customers')
}

export const newCustomers = (req: Request, res: Response)=>{
  res.render('pages/customers-add')
}

