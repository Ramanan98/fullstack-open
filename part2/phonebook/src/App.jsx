import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(()=>{
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  }, [])
  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [filterTerm, setFilterTerm] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    setPersons(persons.concat({ name: newName, number: newNumber }))
  }

  const handleNameChange = (event) => {
    const nameExists = persons.some(person => person.name === event.target.value)

    if (nameExists) {
      alert(`${event.target.value} is already added to phonebook`)
    }

    if (!nameExists) {
      setNewName(event.target.value)
    }
  }

  const handleNumberChange = (event) => {
    setnewNumber(event.target.value)
  }

  const handleFilterTermChange = (event) => {
    setFilterTerm(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterTerm} onChange={handleFilterTermChange} />
      <h3>Add a new</h3>
      <PersonForm nameValue={newName} nameChange={handleNameChange} numberValue={newNumber} numberChange={handleNumberChange} onSubmit={addPerson} />
      <h2>Numbers</h2>
      <Persons data={persons} filter={filterTerm} />
    </div>
  )
}

export default App