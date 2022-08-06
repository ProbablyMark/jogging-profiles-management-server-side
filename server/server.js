require('dotenv').config()
const express = require('express')
const connectToDb = require('./Config/db')
const app = express()
const https = require('https')
const fs = require('fs')
const { errorMiddleWare } = require('./Middlewares/errorMiddleWare')
const authRouter = require('./Routers/authRouter')
const userRouter = require('./Routers/userRouter')
const joggingProfileRouter = require('./Routers/joggingProfileRouter')
const body_parser = require('body-parser')

const morgan = require('morgan')

//listening to port 8000
const port = process.env.PORT

//use morgan
app.use(morgan(':method :url :status :http-version :response-time '))

// allow cross origin
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS')
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
//   next()
// })

// body parser
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))
//create server with https
https
  .createServer(
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    app,
  )

  .listen(port, async () => {
    try {
      await connectToDb()
      console.log(`server running on ${port}`)
    } catch (error) {
      console.log(error)
    }
  })
//routes
app.use(authRouter)

app.use(userRouter)

app.use(joggingProfileRouter)

//Not found MW
app.use((req, res) => {
  res.status(404).json({ page: 'Not Found' })
})
//error MW
app.use(errorMiddleWare)
