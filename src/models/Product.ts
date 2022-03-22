import { rejects } from 'assert'
import { resolve } from 'path'
import { Model, DataTypes, Op, QueryTypes } from 'sequelize'
import { sequelize } from '../instances/mysql'
import { actionsModelSaleDetails } from './SaleDetails'
import { ActionsSaleDetailsFast } from './SaleDetaisFast'

export interface ProductInstance extends Model {
  id: number,
  description: string,
  price_buy: number,
  price_sale: number,
  quantity: number,
  number_category: number,
  minimum_quantity: number
}



export const Product = sequelize.define<ProductInstance>('Product',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING
    },
    price_buy: {
      type: DataTypes.INTEGER,
      get() {
        return this.getDataValue('price_buy').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
      }
    },

    price_sale: {
      type: DataTypes.INTEGER,
      get() {
        return this.getDataValue('price_sale').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
      }

    },
    quantity: {
      type: DataTypes.INTEGER
    },
    number_category: {
      type: DataTypes.INTEGER
    },
    minimum_quantity: {
      type: DataTypes.INTEGER
    }
  }, {
  tableName: 'products',
  timestamps: false
})

export const productModelActions = {


  getCountProduct: async () => {
    return await Product.count()
  },

  getProductSale: async (id: number) => {
    return await Product.findOne({
      attributes: ['id', 'description', 'price_sale', 'quantity'],
      where: {
        id
      }
    })

  },
  getProductById: async (idOfProducts: number) => {
    console.log("Pegando o id")
    return await Product.findOne({
      where: {
        id: idOfProducts
      }
    })
  },
  getProductByName: async (nameOfroduct: string) => {
    return await Product.findAll({
      where: {
        description: {
          [Op.like]: `%${nameOfroduct}%`
        }
      }
    })
  },
  getAllProducts: async () => {
    return await Product.findAll()
  },
  registerProduct: async (dataOfProducts: ProductInstance) => {
    return await Product.create({
      description: dataOfProducts.description,
      price_buy: dataOfProducts.price_buy,
      price_sale: dataOfProducts.price_sale,
      quantity: dataOfProducts.quantity,
      number_category: dataOfProducts.number_category,
      minimum_quantity: dataOfProducts.minimum_quantity

    })
  },
  updateProduct: async (id: number, dataOfProducts: ProductInstance) => {
    await Product.update(
      {
        description: dataOfProducts.description,
        price_buy: dataOfProducts.price_buy,
        price_sale: dataOfProducts.price_sale,
        quantity: dataOfProducts.quantity,
        number_category: dataOfProducts.number_category,
        minimum_quantity: dataOfProducts.minimum_quantity

      },
      {
        where: {
          id
        }
      })
  },

  deleteProductById: async (id: number) => {
    await Product.destroy({
      where: {
        id
      }
    })
  },

  getLimitProducts: async (offset: number, limit: number) => {
    return await Product.findAll({
      offset: offset,
      limit: limit,
    })
  },

  removerProductFromStock: async (quantity: number, id: number) => {

    let query = `UPDATE products SET quantity = '${quantity}' WHERE id = ${id}`
    await sequelize.query(query, {
      type: QueryTypes.UPDATE
    })
  },


  getCountOfProductsSold: async (idProduct: number) => {

    let countSales = await actionsModelSaleDetails.getAmountOfSalesById(idProduct)
    let countSalesFast = await ActionsSaleDetailsFast.getAmountOfSalesById(idProduct)
    return countSalesFast + countSales

  }


}






