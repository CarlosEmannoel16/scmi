import { Model, DataTypes, QueryTypes } from 'sequelize'
import { sequelize } from '../instances/mysql'
import { Sale, SaleInstance, idAndProducstSaleInteface } from './Sale'
import { ProductInstance, productModelActions } from '../models/Product'
import { resolve } from 'path'
import { Product } from '../models/Product'
import { rejects } from 'assert'
import { json } from 'stream/consumers'

export interface SaleDetailsFastInstance extends Model {
  id_sale: number,
  id_product: number,
  quantity: number,
}

export const SaleDetailsFast = sequelize.define<SaleDetailsFastInstance>('saleDetailsFast',
  {
    id_sale: {
      type: DataTypes.INTEGER,
    },
    id_product: {
      type: DataTypes.INTEGER
    },
    quantity: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: 'sale_fast_details',

    timestamps: false
  }
)

SaleDetailsFast.removeAttribute('id')

export const ActionsSaleDetailsFast = {

  addSaleDetails: async (idSale: number, idAndQuantity: idAndProducstSaleInteface[]) => {
    let result = false
    for (const productCurrent of idAndQuantity) {
      let saleDetailsFast = SaleDetailsFast.build({
        id_sale: idSale,
        id_product: productCurrent.id_product,
        quantity: productCurrent.quantity
      })
      await saleDetailsFast.save()

      let product = await productModelActions.getProductById(productCurrent.id_product)

      if (product) {
        let stockFinaly: number = product.quantity - productCurrent.quantity
        let id = productCurrent.id_product
        await productModelActions.removerProductFromStock(stockFinaly, id)
      }
      result = true
    }
  },
  getAmountOfSalesById: async (id: number) => {

  return SaleDetailsFast.sum('quantity', {
     where:{
       id_product: id
     }
   })

  }
}


