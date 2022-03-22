import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../instances/mysql'
import { Sale, SaleInstance } from './Sale'


export interface SaleDetailsInstance extends Model{
  id_sale: number,
  id_product: number,
  quantity: number,
}

export const SaleDetails = sequelize.define<SaleDetailsInstance>('saleDetails',
  {
    id_sale:{
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
    tableName: 'sale_details',
    underscored: true,
    timestamps: false
  }
)

SaleDetails.removeAttribute('id')


export const actionsModelSaleDetails = {


  getAmountOfSalesById: async(id: number)=>{

    return await SaleDetails.sum('quantity',{
      where:{
        id_product: id
      }
    })
    
  }

}