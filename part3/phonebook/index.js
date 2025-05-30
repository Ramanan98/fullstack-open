const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id == id)
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id == id)
  if (person) {
    persons = persons.filter(person => person.id !== id);
    response.status(204).end()
  }
  else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }
  const nameExists = persons.some(person => person.name === name);
  if (nameExists) {
    return response.status(409).json({ error: 'Name must be unique' });
  }
  const id = Math.floor(Math.random() * 100);
  const person = { id, name, number };
  persons = persons.concat(person);
  response.status(201).json(person); // 201 Created
});


app.get('/api/info', (request, response) => {
  const now = new Date();
  const response_string = `Phonebook has info for ${persons.length} people\n${now}`;
  response.type('text/plain').send(response_string);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})