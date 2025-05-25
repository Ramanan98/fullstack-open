import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    personService.getAll().then(persons => { setPersons(persons) })
  }, [])
  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [filterTerm, setFilterTerm] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }
    personService.create(person).then(addedPerson => { setPersons(persons.concat(addedPerson)) })
  }

  const deletePerson = (id) => {
    if (window.confirm(`Delete ${persons.find(p => p.id === id)?.name}?`)) {
      console.log('calling deletePerson with id', id)
      personService.del(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
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
      <Persons data={persons} filter={filterTerm} deleteAction={deletePerson} />
    </div>
  )
}

export default App