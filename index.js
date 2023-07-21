const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(cors())

//app.use(express.static('build'))

const errorHandler = require('./middlewares/errorHandler')
const Person = require('./models/person')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//test
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.post('/api/persons', (req, res, next) => {
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
  }).catch(error =>  next(error) )

})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id).then(person => {
    if (person) {
      res.json(person)
    }
    else {
      res.status(404).end()
    }
  }).catch(error => {
    next(error)
  })

})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => { next(error) })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'malformatted id' });

  Person.findByIdAndDelete(id).then(result => { res.status(204).end() }).catch(error => {
    next(error)
  })
})

app.get('/info', async (req, res) => {
  Person.find({}).then(result => {
    const amount = result.length
    const time = new Date(Date.now())
    res.send(`<div><p>Phonebook has info for ${amount} people</p><p>${time}</p></div>`)
  }).catch(error => {
    next(error)
  })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})