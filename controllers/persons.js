const personRouter = require('express').Router()
const Person = require('../models/person')


personRouter.get('/', (request, response) => {
    Person.find({}).then((result) => {
        response.json(result)
    })
})

personRouter.get('/info', (request, response) => {
    Person.find({}).then((result) => {
        let answer = `<p>The phonebook has info on ${result.length} persons</p>`
        response.send(answer)
    })
})

personRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((result) => {
            if (result) {
                response.json(result)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => next(error))
})

personRouter.delete('/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

personRouter.post('/', (request, response, next) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then((result) => {
            response.json(result)
        })
        .catch((error) => next(error))
})

personRouter.put('/:id', (request, response, next) => {
    const body = request.body
    console.debug('request to update ', body)
    let person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {
        new: true,
        runValidators: true,
        context: 'query',
    })
        .then((result) => response.json(result))
        .catch((error) => next(error))
})

module.exports = personRouter