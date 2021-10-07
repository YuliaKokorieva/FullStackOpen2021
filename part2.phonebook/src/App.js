import React, { useState, useEffect } from 'react'
import axios from 'axios'

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

const Persons = ({persons, searchTerm}) => {
  return (
    <ul>
    {searchTerm !== '' ?
      persons.filter(person=>person.name.toLowerCase().includes(searchTerm.toLowerCase())).map(person =><li key={person.id}>{person.name} {person.number}</li>)
      : persons.map(person =><li key={person.id}>{person.name} {person.number}</li>)}
  </ul>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newPerson, setNewPerson ] = useState({
    name:'',
    number: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(()=>{
    axios
      .get('http://localhost:3001/persons')
      .then(response=> {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)
    if (names.includes(newPerson.name)) {
           alert(`${newPerson.name} already exists!`)
    } else {
      setPersons(persons.concat({name:newPerson.name, number: newPerson.number, id: persons.length+1}))
      setNewPerson({name: '', number: '', id: 0})
    }
  }

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
      <PersonForm inputChanged = {inputChanged} addPerson = {addPerson} newPerson = {newPerson}/>

      <h3>Numbers</h3>
      <Persons persons={persons} searchTerm={searchTerm}/>
    </div>
  )
}

export default App