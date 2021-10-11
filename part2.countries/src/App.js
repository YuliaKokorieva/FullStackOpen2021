import React, {useState, useEffect } from 'react'
import axios from 'axios'

const Weather=({city})=> {
const [weather, setWeather] = useState({
  temp: '',
  pic: '',
  desc: '',
  wind: ''
})

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=409c72b4881deed116b8bdc957ae4360&units=metric`)
      .then(response=> {
       setWeather({
         temp: "Temperature: " + response.data.main.temp + " Celcius",
         pic: "http://openweathermap.org/img/w/"+ response.data.weather[0].icon + ".png",
         desc: response.data.weather[0].main,
         wind: "Wind speed: " + response.data.wind.speed
       })
  })
}, [])

return(
  <div>
    <h3>Weather in {city}</h3>
    <img src={weather.pic} alt=""/><br/>
    {weather.desc} <br/>
    {weather.temp}<br/>
    {weather.wind}
  </div>
)
}

const ShowCountry = ({searchRes}) => {
  if (searchRes.length===0) {
    return (
      <div>
        <p>No countries found, try another filter</p>
      </div>
    )
  } else if (searchRes.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  } else if (searchRes.length<=10 && searchRes.length>1) {
      return (
        <div>
          <ul>
            {searchRes.map(country=> <li key={country.idd.suffixes[0]}>{country.name.common}</li>)}
          </ul>
        </div>
      )
  } else {
    return (
      <div>
        <h2>{searchRes[0].name.common}</h2>
        capital: {searchRes[0].capital[0]}<br/>
        population: {searchRes[0].population}<br/>
        <p>languages: </p>
        <ul>
          {Object.values(searchRes[0].languages).map((lang,i)=><li key={i}>{lang}</li>)}
        </ul>    
        <img src={searchRes[0].flags.svg} width='50' alt='flag'/>
        <Weather city={searchRes[0].capital[0]}/>
      </div>
    )
  }  
}

function App() {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response=> {
        setCountries(response.data)
      })
  }, [])

  const searchTermChanged = (event) => {
    setSearchTerm(event.target.value)
  }
  const searchRes = countries.filter(country => country.name.common.toLowerCase().includes(searchTerm.toLowerCase())) 
 
  
  return (
    <div>
      find country: <input value={searchTerm} onChange={searchTermChanged}/>   
      {searchTerm !== '' ?
      <ShowCountry searchRes={searchRes}/>
      : <p>Enter filter</p>}   
    </div>
  );
}

export default App
