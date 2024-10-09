const morgan = require('morgan')

morgan.token('body', (req) => JSON.stringify(req.body))
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        response.status(400).send({ error: error.message })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    console.debug('unknown endpoint ', request.url)
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    morgan,
    errorHandler,
    unknownEndpoint,
}
