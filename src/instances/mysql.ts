import {Sequelize, Model, DataTypes} from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE as string,
  process.env.MYSQL_USERNAME as string,
  process.env.MYSQL_PASSWORD as string
,{
  dialect: 'mysql',
  storage:'./session.mysql',
  port: parseInt(process.env.MYSQL_PORT as string)
})
