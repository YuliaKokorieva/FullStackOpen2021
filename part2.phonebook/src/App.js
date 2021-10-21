import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Search = (props) => {
  return (
    <div>
      search term: <input value={props.searchTerm} onChange={props.searchTermChanged}/> (case insensitive)
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
        <div>
          name: <input name="name" value = {props.newPerson.name} onChange={props.inputChanged}/>
          number: <input name="number" value = {props.newPerson.number} onChange={props.inputChanged}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({persons, searchTerm, deletePerson}) => {
  return (
    <ul>
    {searchTerm !== '' ?
      persons.filter(person=>person.name.toLowerCase().includes(searchTerm.toLowerCase())).map(person =><li key={person.id}>{person.name} {person.number}<button onClick = {()=>deletePerson(person.id)}>Delete</button></li>)
      : persons.map(person =><li key={person.id}>{person.name} {person.number}<button onClick = {()=>deletePerson(person.id)}>Delete</button></li>)}
  </ul>
  )
}

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    fontSize: '20px',
    padding: '10px',
    marginBottom: '10px'
  }
  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}
const ErrorNotification = ({ errorMessage }) => {
  const notificationStyle = {
    color: 'red',
    fontSize: '20px',
    padding: '10px',
    marginBottom: '10px'
  }
  if (errorMessage === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newPerson, setNewPerson ] = useState({
    name:'',
    number: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(()=>{
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)
    if (names.includes(newPerson.name)) {
      window.confirm(`${newPerson.name} already exists! 
        Do you want to replace the number with the new one?`)
        const personObject = {
        name: newPerson.name,
        number: newPerson.number
      }

      personService
      .update(persons.filter(p=>p.name===newPerson.name)[0].id, personObject)
      .then(
        returnedPerson => {
        setPersons(
          persons.filter(p=>p.id!==persons.filter(p=>p.name===newPerson.name)[0].id)
          .concat(returnedPerson)
        )
        setMessage(`${returnedPerson.name} modified`)
        setTimeout (()=> {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        if (error.response.data.error.includes('Validation')) {
        console.log(error.response.data.error)
        setErrorMessage(error.response.data.error)
        setTimeout (()=> {
          setErrorMessage(null)
        }, 5000)
      } else{
        setErrorMessage(`${persons.filter(p=>p.name===newPerson.name)[0].name} has already beed removed`)
        setTimeout (()=> {
          setErrorMessage(null)
        }, 5000)
        personService
        .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
      }
      })

    } else {
      const personObject = {
        name: newPerson.name,
        number: newPerson.number
      }

      personService
      .create(personObject)
      .then(returnedPerson => {
        console.log(returnedPerson)
        setPersons(persons.concat(returnedPerson))
        setMessage(`${returnedPerson.name} added`)
        setTimeout (()=> {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error.response.data.error)
        setErrorMessage(error.response.data.error)
        setTimeout (()=> {
          setErrorMessage(null)
        }, 5000)
      })
    }
  }

  const deletePerson = (id) => {
    window.confirm(`Delete '${persons.filter(p=>p.id===id)[0].name}'?`)
    personService
    .deleteAxios(id)
    .then(
      setPersons(persons.filter(p=>p.id!==id)),
      setMessage(`Deleted`),
      setTimeout (()=> {
        setMessage(null)
      }, 5000)
    )}

  const inputChanged = (event) => {
        setNewPerson({...newPerson, [event.target.name]: event.target.value })
  }

  const searchTermChanged = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <h3>Search</h3>
      <Search searchTerm = {searchTerm} searchTermChanged={searchTermChanged}/>

      <h3>Add a new contact</h3>
      <PersonForm 
        inputChanged = {inputChanged} 
        addPerson = {addPerson} 
        newPerson = {newPerson} 
      />

      <h3>Numbers</h3>
      <Persons 
        persons={persons} 
        searchTerm={searchTerm}
        deletePerson = {deletePerson}
      />
      <Notification message={message}/>
      <ErrorNotification errorMessage={errorMessage}/>
    </div>
  )
}

export default App