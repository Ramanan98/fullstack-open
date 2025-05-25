import { useState, useEffect } from 'react'
import Countries from './components/Countries'
import CountryInfo from './components/CountryInfo'
import WeatherInfo from './components/WeatherInfo'
import axios from 'axios'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const [names, setNames] = useState(null)
  const [message, setMessage] = useState('')
  const [countryData, setCountryData] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY

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
        setCountryData({ 'name': data.name.common, 'capital': data.capital[0], 'area': data.area, 'languages': data.languages, 'flag_url': data.flags.png });
        setWeatherView(data.capital[0])
      })
  }

  const setWeatherView = (city) => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
    .then(response => {
      const data = response.data
      setWeatherData({'temp': data.main.temp, 'wind': data.wind.speed, 'icon_url': `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`})
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
      setWeatherData(null)
    }
    else if (count == 1) {
      setCountries(matches)
      setCountryView(matches[0])
    }
    else {
      setMessage('')
      setCountries(matches)
      setCountryData(null)
      setWeatherData(null)
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
      <CountryInfo data={countryData}/>
      <WeatherInfo data={weatherData}/>
    </div>
  )
}

export default App