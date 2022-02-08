import { Request, Response } from 'express'
import { Model, DataTypes, } from 'sequelize'
import { sequelize } from '../instances/mysql'
import { SaleDetails, SaleDetailsInstance } from './SaleDetails'
import { ProductInstance } from './Product'

import { removeSpecialCharactersAndConvertToInt, formatMoney } from '../helpers/formatNumber'


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


export interface quantitySaleInterface {
  id: number,
  quantityStock: number
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
        if (item.idUnique == this.cod) {
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

  verifyQuantityProductAndUpdate(): boolean | undefined {
    if (this.product && this.quantity) {

   
      let idProduct = this.product.id;
      let quantity =  this.quantity
    

      if (this.getQuantitySession().length > 0) {

        ///   PEGAR A QUANTIDADE E O CÓDIGO DOS PRODUTOS ADICIONADOS
        let codesAndQuantity = this.getQuantitySession()


        let codes = codesAndQuantity.map(item => {
          return item.id
        })

        if (codes.indexOf(idProduct) == -1) { 

          codesAndQuantity.push({
            id: this.product.id,
            quantityStock: this.product.quantity - this.quantity
          })
          console.log(codesAndQuantity)
          this.req.session.quantitySale = codesAndQuantity
          return true

        } else {
          let updateQuantity = codesAndQuantity.map(item => {
            if(item.id == idProduct){
              item.quantityStock -= quantity
              return item
            }else{
              return item
            }
          })
          console.log(updateQuantity)
          this.req.session.quantitySale = updateQuantity
        
        }

      }else{
        let codesAndQuantity = this.getQuantitySession()
        codesAndQuantity.push({
          id: this.product.id,
          quantityStock: this.product.quantity - this.quantity
        })
        console.log(codesAndQuantity)
        this.req.session.quantitySale = codesAndQuantity
      }
    }


  }

  multiplyValueByQuantity(): number | undefined {
    if (this.product && this.quantity) {
      let priceSale = removeSpecialCharactersAndConvertToInt(this.product.price_sale.toString()) * this.quantity
      return priceSale
    }
  }


  getProductSession() {
    let dataSession: any[] = []
    if (this.req.session.sale) return dataSession = this.req.session.sale
    return dataSession
  }

  getSessionToCustomer() {

    let products = this.getProductSession()
    let dataProductsForCustomer = products.map((item) => {
      delete item.quantityStock
      return item
    })
  }


  getQuantitySession() {
    let dataQuantity: quantitySaleInterface[] = []
    if (this.req.session.quantitySale) return dataQuantity = this.req.session.quantitySale
    return dataQuantity
  }

  insertQuantityInSession(data: quantitySaleInterface[]) {
    this.req.session.quantitySale = data
  }


  prepareProductToSession(): boolean | any {
    if (this.product) {
     
        let quantityInStock = this.product.quantity
        let amount = formatMoney(this.multiplyValueByQuantity() as number)
        let idProductSession = this.getProductSession().length
        let id = this.product.id
        let idUnique = this.product.id + idProductSession + Math.random() * 900 | 0
        let description = this.product.description
        let priceSale = formatMoney(this.product.price_sale)
        let quantitySale = this.quantity

        let product = { id, idUnique, description, priceSale, quantitySale, amount, quantityInStock }
        return product
      }
    
    return false
  }


  productToSession() {
    let dataProduct = this.prepareProductToSession()
    if (dataProduct) {
      delete dataProduct.quantityStock
      return dataProduct
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

    let dataSession = this.getProductSession()
    let dataProduct = this.prepareProductToSession()
    dataSession.unshift(dataProduct)
    this.req.session.sale = dataSession
    this.verifyQuantityProductAndUpdate()

    return true
  }


}






