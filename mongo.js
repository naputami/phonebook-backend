const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://nadiapujiutami06:${password}@cluster0.rfj90ai.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
//   id: Number
})

const Person = mongoose.model('Person', personSchema)


if(process.argv[3] !== undefined) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      //   id: 1123
      })
      
      person.save().then(result => {
        console.log(`added ${result.name} ${result.number}`)
        mongoose.connection.close()
      })
} else {
    Person.find({}).then(result => {
        console.log('Phonebook')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}



