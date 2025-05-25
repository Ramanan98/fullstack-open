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

    const nameExists = persons.some(p => p.name === newName)
    const newNumberExists = persons.some(p => p.number === newNumber)
    if (nameExists && !newNumberExists) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const id = persons.find(p => p.name === newName)?.id
        personService.update(id, person).then(response => {
          setPersons(persons.map(p => p.id !== id ? p : response))
        })
      }
    }

    personService.create(person).then(addedPerson => { setPersons(persons.concat(addedPerson)) })
  }

  const deletePerson = (id) => {
    if (window.confirm(`Delete ${persons.find(p => p.id === id)?.name}?`)) {
      personService.del(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
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