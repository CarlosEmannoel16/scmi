import { Model, DataTypes, BelongsTo, HasMany, HasManyGetAssociationsMixin, } from 'sequelize'

import { sequelize } from '../instances/mysql'
import { SaleDetails, SaleDetailsInstance } from './SaleDetails'





export interface SaleInstance extends Model{
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


SaleDetails.belongsTo(Sale,{
  foreignKey: 'id_sale',

 
 })

Sale.hasMany(SaleDetails,{
  foreignKey:'id_sale',
 
})

export {Sale}






