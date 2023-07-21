import { useState, useEffect } from 'react'
import personService from './services/persons'

const ErrorNotification = ({ message }) => {
  if (message === '') {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const SuccessNotification = ({ message }) => {
  if (message === '') {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const Person = (params) => {
  return (
    <div>
      {params.values.name} {params.values.number}
      <button onClick={() => params.removePerson(params.values.id)}>delete</button>
    </div>
  )
}

const Persons = (params) => {
  return (
    params.values.map(person =>
      <Person key={person.id} values={person} removePerson={params.removePerson}></Person>
    )
  )
}

const FilterForm = (params) => {
  return (
    <form>
      <div>
        filter shown with <input value={params.value} onChange={params.onChange}></input>
      </div>
    </form>
  )
}

const PersonForm = (params) => {
  return (
    <form onSubmit={params.onSubmit}>
      <div>
        name: <input value={params.nameValue} onChange={params.onChangeName} />
      </div>
      <div>
        number: <input value={params.numberValue} onChange={params.onChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const hook = () => {
    personService
      .getAll()
      .then(personsData => {
        setPersons(personsData)
      })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const checkSimilar = persons.find(person => person.name === personObject.name)
    if (checkSimilar) {
      const confirmed = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (confirmed) {
        const id = checkSimilar.id
        personService
          .update(id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setSuccessMessage(`Changed number for ${personObject.name}`)
            setTimeout(() => {
              setSuccessMessage('')
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`${newName} does not exist on the server anymore`)
            setTimeout(() => {
              setErrorMessage('')
            }, 5000)
          })
      }
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setSuccessMessage(`Added ${personObject.name}`)
          setTimeout(() => {
            setSuccessMessage('')
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage('')
          }, 5000)
          console.log(error.response.data)
        })
    }
  }

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id)
    const confirmed = window.confirm(`Delete ${person.name} ?`)
    if (confirmed) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setSuccessMessage(`Removed ${person.name}`)
          setTimeout(() => {
            setSuccessMessage('')
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(`Information of ${person.name} has already been removed from the server`)
          setTimeout(() => {
            setErrorMessage('')
          }, 5000)
        })
        setPersons(persons.filter(p => p.id !== id))
    }
  }

  const filteredPersons = false ? persons : persons.filter(
    person => person.name.toLocaleLowerCase().includes(filterQuery.toLocaleLowerCase()))

  const handleChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleChangeQuery = (event) => {
    setFilterQuery(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      <FilterForm value={filterQuery} onChange={handleChangeQuery} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        numberValue={newNumber}
        onChangeName={handleChangeName}
        onChangeNumber={handleChangeNumber}
      />
      <h2>Numbers</h2>
      <Persons values={filteredPersons} removePerson={removePerson} />
    </div>
  )

}

export default App

