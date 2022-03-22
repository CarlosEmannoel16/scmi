import {Model, DataTypes } from 'sequelize'

import { sequelize } from '../instances/mysql'


export interface SaleFastInstance extends Model{
  id: number,
  date: Date
}


export const SaleFast = sequelize.define<SaleFastInstance>('SaleFAst',{
  id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date:{
    type: DataTypes.DATE
  }
},
{
  tableName: 'sale_fast',
  timestamps: false

})


export const actionsSaleFast = {

  addSaleFast: async ()=>{

    let date = new Date()
    let dataSale = await SaleFast.create({
        date 
      })

     return dataSale.id
      
  }

}