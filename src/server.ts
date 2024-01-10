import express from 'express'
import bodyParser from 'body-parser'
import { notFound, errorHandler } from './middlewares/errors/errorHandlers.js'
import { dbConnection } from './config/db/dbConnection.js'
import { authRoutes } from './routes/auth.routes.js'
import { productRoutes } from './routes/product.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import * as dotEnv from 'dotenv'
const zahra_server = express()

dotEnv.config()

dbConnection()
const SESSION_SECRATE = process.env.SECRATE_KEY || 'mjibrail@optum.com'
zahra_server.use(
  session({
    secret: SESSION_SECRATE,
    resave: false,
    saveUninitialized: true,
  }),
)
zahra_server.use(cookieParser(process.env.SECRATE_KEY))
zahra_server.use(bodyParser.json())
zahra_server.use(bodyParser.urlencoded({ extended: false }))

zahra_server.use('/api/auth', authRoutes)
zahra_server.use('/api/prod', productRoutes)

zahra_server.use(notFound)
zahra_server.use(errorHandler)

zahra_server.listen(process.env.PORT, () => {
  console.log(`Server running :: ${process.env.PORT}`)
})
