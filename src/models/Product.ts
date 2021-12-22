import {Model, DataTypes, Op} from 'sequelize'
import { sequelize,} from '../instances/mysql'

export interface ProductInstance extends Model{
  id:number,
  description: string,
  price_buy: number,
  price_sale: number,
  quantity: number,
  number_category: number
}
export const Product = sequelize.define<ProductInstance>('Product',
{
  id:{
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  description:{
    type: DataTypes.STRING
  },
  price_buy:{
    type: DataTypes.INTEGER,
    get(){
      return this.getDataValue('price_buy').toLocaleString('pt-br', {style: 'currency', currency:'BRL'})
    }
  },
  
 price_sale:{
    type: DataTypes.INTEGER,
    get(){
      return this.getDataValue('price_sale').toLocaleString('pt-br', {style: 'currency', currency:'BRL'})
    }
  },
  quantity:{
    type: DataTypes.INTEGER
  },
 number_category:{
    type: DataTypes.INTEGER
  }
},{
  tableName:'products',
  timestamps:false
})

export const productModelActions = {
  getProductById: async(idOfProducts: number)=>{
      return await Product.findByPk(idOfProducts)
  },
  getProductByName: async (nameOfroduct: string)=>{
    return await Product.findAll({
      where:{
        description:{
          [Op.like]: `%${nameOfroduct}%`
        }
      }
    })
  },
  getAllProducts: async ()=>{
    return await Product.findAll()
  },
  registerProduct: async(nameOfProducts: ProductInstance) =>{
   return await Product.create({
      id: nameOfProducts.id,
      description: nameOfProducts.description,
      price_buy: nameOfProducts.price_buy,
      price_sale: nameOfProducts.price_sale,
      quantity: nameOfProducts.quantity,
      number_category: nameOfProducts.number_category
    })

  }
}
