import { Request, Response } from 'express'
import { Model, DataTypes, } from 'sequelize'
import { sequelize } from '../instances/mysql'
import { SaleDetails, SaleDetailsInstance } from './SaleDetails'

import { ProductInstance } from './Product'


import { removeSpecialCharactersAndConvertToFloat, formatMoney } from '../helpers/formatNumber'



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




export interface SaleActionInstance {
  product?: ProductInstance | undefined
  quantity?: number
  req: Request
  res: Response
  cod?: number
  amountReceived?: number
}


export interface quantitySaleInterface {
  id: number,
  quantityStock: number
}

export interface finalizingTheSaleInterface {
  products: any[],
  subtractedValue: string
}



export interface idAndProducstSaleInteface {
  id_product: number,
  quantity: number,
}

export class SaleActions implements SaleActionInstance {
  product?: ProductInstance
  quantity?: number
  req: Request
  res: Response
  cod?: number
  amountReceived?: number


  constructor(options: SaleActions) {

    this.product = options.product
    this.quantity = options.quantity
    this.req = options.req
    this.res = options.res
    this.cod = options.cod
    this.amountReceived = options.amountReceived

  }


  verifyQuantityProduct(): boolean | undefined {

    if (this.product && this.quantity) {

      let idProduct = this.product.id
      let quantityAdd = this.quantity
      let verify = false

      let codes = this.getQuantitySession().map(item => {
        return item.id
      })


      if (codes.indexOf(this.product.id) > -1) {

        this.getQuantitySession().forEach(item => {
          if (item.id == idProduct) {
            verify = quantityAdd <= item.quantityStock ? true : false
          }
        })

      } else {
        verify = quantityAdd <= this.product.quantity ? true : false
      }

      return verify
    }

  }

  deleteProduct(): boolean {
    let status = false
    if (this.cod) {
      let productsSesison = this.getProductSession()
      let sessionQuantity = this.getQuantitySession()

      productsSesison.map((item, index) => {
        if (item.idUnique == this.cod) {

          sessionQuantity.map((itemQuantity, indexQuantity) => {
            if (itemQuantity.id == item.id) {
              if (itemQuantity.quantityStock == 0) {
                sessionQuantity.splice(indexQuantity, 1)
              } else {
                console.log('passou aqui')
                itemQuantity.quantityStock = itemQuantity.quantityStock + parseInt(item.quantitySale)
                return

              }
            }
          })
          productsSesison.splice(index, 1)
          status = true
          return
        }
      })



      console.log(sessionQuantity)
      console.log(productsSesison)
      this.req.session.sale = productsSesison


    }


    return status
  }

  updateQuantityProduct(): boolean | undefined {
    if (this.product && this.quantity) {


      let idProduct = this.product.id;
      let quantity = this.quantity


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
            if (item.id == idProduct) {
              item.quantityStock -= quantity
              return item
            } else {
              return item
            }
          })
          console.log(updateQuantity)
          this.req.session.quantitySale = updateQuantity

        }

      } else {
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
      let priceSale = removeSpecialCharactersAndConvertToFloat(this.product.price_sale.toString()) * this.quantity
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
    return products.map((item) => {
      delete item.quantityInStock

    })
  }


  getQuantitySession() {
    let dataQuantity: quantitySaleInterface[] = []
    if (this.req.session.quantitySale) return dataQuantity = this.req.session.quantitySale
    return dataQuantity
  }

  prepareProductToSession(): boolean | any {
    if (this.product) {
      if (this.verifyQuantityProduct()) {
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

  clearSession() {
    this.req.session.destroy(function (err) {
      console.log(err)
    })
  }

  sumAllProducts(): string {
    let products = this.getProductSession()
    if (products.length > 1) {
      let productsAmount = products.map(item => removeSpecialCharactersAndConvertToFloat(item.amount))
        .reduce((accumalator, current) => {
          return accumalator += current
        })

      return formatMoney(productsAmount)
    } else if (products.length == 1) {
      return products.map(item => item.amount).toString()
    } else {
      return ''
    }
  }

  lowestTotalValue() {
    let amountReceived = this.amountReceived
    if (amountReceived && amountReceived > 0) {
      let sumAllProducts = this.sumAllProducts()
      if (sumAllProducts != '') {
        let amountTotal = removeSpecialCharactersAndConvertToFloat(this.sumAllProducts())
        let subtractedValueOrigin = amountTotal - amountReceived

        if (subtractedValueOrigin > 1) {
          subtractedValueOrigin
        } else {
          subtractedValueOrigin.toFixed(2)
        }

        let subtractedValue = formatMoney(subtractedValueOrigin)
        console.log('subtractedValue', subtractedValue)
        let session = [{ products: this.getProductSession(), subtractedValue }]
        this.req.session.sale = session
      } else {

        let subtractedValueOrigin = removeSpecialCharactersAndConvertToFloat(this.getProductSession()[0].subtractedValue)

        subtractedValueOrigin = subtractedValueOrigin - amountReceived
        let products = this.getProductSession()[0].products
        if (subtractedValueOrigin > 1) {
          subtractedValueOrigin
        } else {
          subtractedValueOrigin.toFixed(2)
        }

        let subtractedValue = formatMoney(subtractedValueOrigin)

        let prepareSession: finalizingTheSaleInterface = {
          products,
          subtractedValue
        }
        let session = [prepareSession]
        this.req.session.sale = session
      }
    }
  }



  getfinalizingTheSaleSession() {
    let data: finalizingTheSaleInterface = this.getProductSession()[0]
    return data
  }

  getProductsAndIdForFinalizingSale() {
    let prapared: idAndProducstSaleInteface[]
    let data = this.getfinalizingTheSaleSession().products
    prapared = data.map((element) => {
      return { id_product: element.id, quantity: element.quantitySale }
    })
    return prapared
  }


  insertInSession() {

    if (this.verifyQuantityProduct()) {
      let dataSession = this.getProductSession()
      let dataProduct = this.prepareProductToSession()
      dataSession.unshift(dataProduct)
      this.req.session.sale = dataSession
      this.updateQuantityProduct()


      return true


    }
    return false
  }


}






