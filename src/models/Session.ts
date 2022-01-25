import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../instances/mysql'



export interface SessionInstance extends Model {
  sid: string,
  expires: string,
  data: Date,

}


export const Session = sequelize.define<SessionInstance>('Session',{
  sid:{
    type: DataTypes.STRING,
    primaryKey: true
  },
  expires:{
    type: DataTypes.DATE
  },
  data:{
    type: DataTypes.STRING(50000)
  }
},
{
  tableName: 'Sessions'
}
)




