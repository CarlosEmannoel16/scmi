import { sequelize } from "../instances/mysql";
import {Model, DataTypes} from 'sequelize'

export interface CustomerInsance extends Model {
  first_name: string,
  last_name: string,
  surname: string,
  street: string,
  district: string,
  city: string,
  number: number
  telephone: string
}

export const Customer = sequelize.define<CustomerInsance>('Customer',
{
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  first_name: {
    type: DataTypes.STRING
  },
  last_name: {
    type: DataTypes.STRING
  },
  street: {
    type: DataTypes.STRING
  },
  district: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  number: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  }
},{
  tableName:'customers',
  timestamps: false
})