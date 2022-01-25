import express from 'express'
import dotenv from 'dotenv'
import mustache from 'mustache-express'
import indexRouter from './routes/indexRouter'
import path from 'path'
import session from 'express-session'
import { sequelize } from './instances/mysql'
import sequelizeStore from 'connect-session-sequelize'
import flash from 'connect-flash';

let storage = sequelizeStore(session.Store)

dotenv.config()

declare module 'express-session'{
  interface Session{
    sale: any[]
  }
}

const server = express()
server.use(
  session({
    secret: 'jsjsjsjsioha',
    store: new storage({
      db: sequelize,
      expiration: 24 * 60 * 60 * 1000
    }),
    resave: false, 
    saveUninitialized: false
    
  })
)



server.use(flash())


server.use(express.static(path.join(__dirname, '../public')))
server.set('view engine', 'mustache')
server.set('views', path.join(__dirname, 'views'))
server.engine('mustache', mustache())

server.use(express.urlencoded({ extended: true }))
server.use(express.json())

server.use(indexRouter)



server.listen(process.env.PORT)