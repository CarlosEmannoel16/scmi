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
    surname: req.body.surname,
    street: req.body.street,
    district: req.body.district,
    city: req.body.city,
    number: req.body.number,
    phone: req.body.phone,
    email: req.body.email
  } as CustomerInstance

  if (dataOfCustomer.first_name && dataOfCustomer.last_name && dataOfCustomer.city) {
    await customerModelActions.registerCustomer(dataOfCustomer)
    res.redirect('/customer')
  } else {
    res.redirect('/new-customer')
  }

}

export const customersSearch = async (req: Request, res: Response) => {

  let showSearch = false
  let showButtonReturn = false
  let searchCustomer: string = req.query.searchCustomer as string
  let resultSearch
  let searchResultById: number

  if (searchCustomer) {
    resultSearch = await customerModelActions.getCustomerByName(searchCustomer)
    console.log(resultSearch.length)
    if (resultSearch.length > 0) {
      showSearch = true
      showButtonReturn = true
    } else if (resultSearch.length == 0) {
      searchResultById = parseInt(searchCustomer)
      if(!isNaN(searchResultById)){
        resultSearch = await customerModelActions.getProductById(searchResultById)
        showSearch = true
        showButtonReturn = true
      }else{
        showSearch = true
        showButtonReturn = true
      }
    } else {
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

export const getCustomerById = async (req: Request, res: Response) => {

  let idOfProduct: number = parseInt(req.params.id)
  let dataCustomer

  if (idOfProduct) {
    dataCustomer = await customerModelActions.getProductById(idOfProduct)
  }

  res.render('pages/customer-view', {
    dataCustomer
  })

}

