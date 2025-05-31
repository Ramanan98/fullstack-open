require('dotenv').config()
const cors = require('cors')
const express = require('express')
const Person = require('./models/person')

const app = express()

let persons = []

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('headers:  ', request.headers)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body.name)
  console.log(body.number)

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      if (!deletedPerson) {
        return response.status(404).json({ error: 'person not found' })
      }
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Uses database
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  console.log(request.body)

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number }
  )
    .then(updatedPerson => {
      if (!updatedPerson) {
        return response.status(404).json({ error: 'person not found' })
      }
      return response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Moved error handling to middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})