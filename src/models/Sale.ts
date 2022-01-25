import { Request, Response } from 'express'
import { Model, DataTypes, } from 'sequelize'
import { sequelize } from '../instances/mysql'
import { SaleDetails, SaleDetailsInstance } from './SaleDetails'
import { ProductInstance } from './Product'

import { removeSpecialCharactersAndConvertToInt, formatMoney } from '../helpers/formatNumber'
import { product } from '../controller/productController'





export interface SaleInstance extends Model {
  id?: number,
  id_customer: number,
  date: Date,
  saleDetails?: SaleDetailsInstance
}

const Sale = sequelize.define<SaleInstance>('Sale',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    id_customer: {
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATE
    },

  },
  {
    tableName: 'sales',
    underscored: true,
    timestamps: false
  },

)


SaleDetails.belongsTo(Sale, {
  foreignKey: 'id_sale',


})

Sale.hasMany(SaleDetails, {
  foreignKey: 'id_sale',

})

export { Sale }




interface SaleActionInstance {
  product?: ProductInstance | undefined
  quantity?: number
  req: Request
  res: Response
  cod?: number
}

export class SaleActions implements SaleActionInstance {

  product?: ProductInstance
  quantity?: number
  req: Request
  res: Response
  cod?: number

  constructor(req: Request, res: Response, cod: number | undefined = undefined, product: ProductInstance | undefined = undefined, quantity: number = 1) {

    this.product = product
    this.quantity = quantity
    this.req = req
    this.res = res
    this.cod = cod

  }


  deleteProduct(): boolean {
    let status = false
    if (this.cod) {
      let productsSesison = this.getProductSession()
      productsSesison.map((item, index) => {
        if (item.id == this.cod) {
          productsSesison.splice(index, 1)
          status = true
          return
        }
      })
      this.req.session.sale = productsSesison
      return status
    }
    return status
  }

  verifyQuantityProduct(): boolean | undefined {
    if (this.product && this.quantity) {
      return this.product.quantity < this.quantity ? false : true
    }
  }
  getProductSession() {
    let dataSesison: any[] = []
    if (this.req.session.sale) return dataSesison = this.req.session.sale
    return dataSesison
  }


  multiplyValueByQuantity(): number | undefined {
    if (this.product && this.quantity) {
      let priceSale = removeSpecialCharactersAndConvertToInt(this.product.price_sale.toString()) * this.quantity
      return priceSale
    }


  }

  prepareSessionToReturnToCustomer() {
    if (this.product) {
      if (this.verifyQuantityProduct()) {
        let amount = formatMoney(this.multiplyValueByQuantity() as number)

        let idProductSession = this.getProductSession().length
        let id = this.product.getDataValue('id') + idProductSession + Math.random() *  900 | 0
        let description = this.product.getDataValue('description')
        let price_sale = formatMoney(this.product.getDataValue('price_sale'))
        let quantity = this.quantity
        let product = { id, description, price_sale, quantity, amount }
        return product
      } else {
        return false
      }
    }
  }



  sumAllProducts() {
    let products = this.getProductSession()
    if (products.length > 1) {
      let productsAmount = products.map(item => removeSpecialCharactersAndConvertToInt(item.amount))
        .reduce((accumalator, current) => {
          return accumalator += current
        })

      return formatMoney(productsAmount)
    } else if (products.length == 1) {
      return products.map(item => item.amount)
    } else {
      return 0
    }


  }

  insertInSession() {
    if (this.verifyQuantityProduct()) {
      let dataSession = this.getProductSession()
      let dataProduct = this.prepareSessionToReturnToCustomer()
      dataSession.unshift(dataProduct)
      this.req.session.sale = dataSession
      return true
    } else {
      return false
    }

  }
}







