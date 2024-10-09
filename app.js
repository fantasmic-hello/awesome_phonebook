const config = require('./utils/configs')
const express = require('express')
const app = express()
const cors = require('cors')
const personRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
logger.info(`connecting to ${config.MONGO_URL}`)
mongoose
    .connect(config.MONGO_URL)
    .then(() => {
        logger.info('connected to mongodb')
    })
    .catch((error) => {
        logger.error('could not connect to mongodb', error.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// app.use(middleware.morgan)

app.use('/api/persons', personRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
