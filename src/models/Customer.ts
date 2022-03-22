import { sequelize } from "../instances/mysql";
import { Model, DataTypes, Op, where,  } from 'sequelize'

export interface CustomerInstance extends Model {
  first_name: string,
  last_name: string,
  surname: string,
  street: string,
  district: string,
  city: string,
  number: number,
  phone: string,
  email: string
}

export const Customer = sequelize.define<CustomerInstance>('Customer',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    surname:{
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
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.first_name} ${this.last_name}`
      }
    },
    fullAddress:{
      type: DataTypes.VIRTUAL,
      get(){
        return `${this.street}, ${this.district} - ${this.city} Nº ${this.number}`
      }
    }
  }, {
  tableName: 'customers',
  timestamps: false
})

export const customerModelActions = {
  getProductById: async (idOfProduct: number)=>{
    return await Customer.findOne({
      where:{
        id: idOfProduct
      }
    })
  },
  getAllCustoemers: async () => {
    return await Customer.findAll()
  },
  getCustomerByName: async (nameOfCustomer: string) => {
    return await Customer.findAll({
      where: {
        first_name: {
          [Op.like]: `%${nameOfCustomer}%`
        }
      }
    })
  },
  registerCustomer: async (dataOfCustomers: CustomerInstance) => {
    await Customer.create({
      first_name: dataOfCustomers.first_name,
      last_name: dataOfCustomers.last_name,
      surname: dataOfCustomers.surname,
      street: dataOfCustomers.street,
      district: dataOfCustomers.district,
      city: dataOfCustomers.city,
      number: dataOfCustomers.number,
      phone: dataOfCustomers.phone,
      email: dataOfCustomers.email
    })
  }

}