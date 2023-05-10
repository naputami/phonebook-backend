require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/Person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}


app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
  Person.find({}).then(persons => {
    const count = persons.length
    const now = new Date()
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }
    response.send(`<p>Phonebook has info for ${count} people</p><br><p>${now.toLocaleString('en-US', options)}</p>`)
  })
    
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if(person) {
          response.json(person)
        } else {
          response.status(404).send({error: 'id is not found' })
        }
      })
      .catch(error => next(error))
    
})

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id)
      .then(result =>{
        if(result){
          response.status(204).end()
        } else {
          response.status(404).send({error: 'id is not found' })
        }
        
      })
      .catch(error => next(error))
   
})

    
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.number || !body.name) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson=> {
      response.json(savedPerson)
    })
     
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})




app.use(unknownEndpoint)
app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

