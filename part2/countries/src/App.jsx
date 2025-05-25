import { useState, useEffect } from 'react'
import Countries from './components/Countries'
import CountryInfo from './components/CountryInfo'
import axios from 'axios'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const [names, setNames] = useState(null)
  const [message, setMessage] = useState('')
  const [countryData, setCountryData] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const countries_names = response.data.map(country => country.name.common)
        setNames(countries_names)
      })
  }, [])

  if (!names) {
    return null
  }

  const setCountryView = (name) => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        const data = response.data
        setCountryData({ 'name': data.name.common, 'capital': data.capital[0], 'area': data.area, 'languages': data.languages, 'flag_url': data.flags.png })
      })
  }

  const search = (term) => {
    if (!term) {
      setCountries([])
      setMessage('')
      setCountryData(null)
      return
    }
    const matches = names.filter(name => name.toLowerCase().includes(term.toLowerCase()))
    const count = matches.length
    if (count > 10) {
      setMessage('Too many matches. Specify another filter.')
      setCountries([])
      setCountryData(null)
    }
    else if (count == 1) {
      setCountries(matches)
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${matches[0]}`)
        .then(response => {
          const data = response.data
          setCountryData({ 'name': data.name.common, 'capital': data.capital[0], 'area': data.area, 'languages': data.languages, 'flag_url': data.flags.png })
        })
    }
    else {
      setMessage('')
      setCountries(matches)
      setCountryData(null)
    }
  }

  const handleChange = (event) => {
    const newTerm = event.target.value
    setSearchTerm(newTerm)
    search(newTerm)
  }

  return (
    <div>
      Find countries: <input value={searchTerm} onChange={handleChange} /> <br />
      {message}
      <Countries data={countries} showAction={setCountryView}/>
      {/* <pre>
        {JSON.stringify(countries, null, 2)}
      </pre> */}
      <CountryInfo data={countryData}/>
    </div>
  )
}

export default App