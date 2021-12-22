import express from 'express'
import dotenv from 'dotenv'
import mustache from 'mustache-express'
import indexRouter from './routes/indexRouter'
import path from 'path'
import { truncate } from 'fs'


dotenv.config()
const server = express()
server.use(express.static(path.join(__dirname, '../public')))
server.set('view engine', 'mustache')
server.set('views', path.join(__dirname, 'views'))
server.engine('mustache', mustache())
server.use(express.urlencoded({ extended: true }))

server.use(indexRouter)



server.listen(process.env.PORT)