const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://part-3:${password}@cluster0.ystgp.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

const person = new Person({
  name: 'Petteri Vänttinen',
  number: '123',
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})