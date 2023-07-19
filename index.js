const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


const Person = require('./models/person')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//test
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ error: 'request body missing' })
  }

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })

})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  // Without this validation it is very easy to crash the server
  if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(400).json({error: 'malformatted id'});

  Person.findById(id).then(person => {
    if (person) {
      res.json(person)
    }
    else {
      res.status(404).end()
    }
  }).catch(error => {
    console.log(error)
    res.status(500).end()
  })

})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204)
})

app.get('/info', (req, res) => {
  const amount = persons.length
  const time = new Date(Date.now())
  res.send(`<div><p>Phonebook has info for ${amount} people</p><p>${time}</p></div>`)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})