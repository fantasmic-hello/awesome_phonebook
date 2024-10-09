const mongoose = require('mongoose')

// if (process.argv.length <2 ) {
//     console.log('give password as argument')
//     process.exit(1)
// }

const url = process.env.MONGO_URL

mongoose.set('strictQuery', false)


mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//     content: String,
//     important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//     content: 'scary stuff',
//     important: true,
// })

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3){
  console.log('Adding person')
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  person.save().then(() => {
    console.log('person saved')
    mongoose.connection.close()
  })
} else {
  console.log('Retrieving all persons')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}