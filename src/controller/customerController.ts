import { Request, Response } from 'express'
import { customerModelActions, CustomerInstance } from '../models/Customer'

export const customers = async (req: Request, res: Response) => {

  const customersResult = await customerModelActions.getAllCustoemers()
  res.render('pages/customers', {
    customersResult
  })
}

export const newCustomersView = async (req: Request, res: Response) => {
  res.render('pages/customers-add')
}

export const newCustomers = async (req: Request, res: Response) => {

  let dataOfCustomer = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    street: req.body.street,
    district: req.body.district,
    city: req.body.city,
    number: req.body.number,
    phone: req.body.phone,
    email: req.body.email
  } as CustomerInstance

  if (dataOfCustomer.first_name && dataOfCustomer.last_name && dataOfCustomer.city) {
    await customerModelActions.registerCustomer(dataOfCustomer)
    res.redirect('/customers')
  }

}

export const customersSearch = async (req: Request, res: Response) => {

  let showSearch = false
  let showButtonReturn = false
  let nameCustomer: string = req.query.nameSearch as string
  let resultSearch

  if (nameCustomer) {
    resultSearch = await customerModelActions.getCustomerByName(nameCustomer)
    if (resultSearch) {
      showSearch = true
      showButtonReturn = true
    }
  }


  res.render('pages/customers', {
    showButtonReturn,
    showSearch,
    resultSearch
  })
}

