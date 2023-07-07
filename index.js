const express = require('express')
const app = express()
app.use(express.json())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }

]
//test
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (!person) {
    res.status(404)
  }
  res.json(person)
})

const generateId = () => {
  const min = Math.ceil(1);
  const max = Math.floor(1000);
  const maxId = Math.floor(Math.random() * (max - min) + min)
  return maxId
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({error: 'request body missing'})
  }

  if (!body.name || !body.number) {
    return res.status(400).json({error: 'name or number missing'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  res.json(person)

})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(note => note.id !== id)

  res.status(204)
})

app.get('/info', (req, res) => {
  const amount = persons.length
  const time = new Date(Date.now())
  res.send(`<div><p>Phonebook has info for ${amount} people</p><p>${time}</p></div>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})