import { useState } from 'react'

const Statistics = (props) => {
  return (
    <>
    Good {props.good} <br/>
    Neutral {props.neutral} <br/>
    Bad {props.bad} <br/>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1> Give feedback </h1>
      <button onClick = {handleGood}>Good</button>
      <button onClick = {handleNeutral}>Neutral</button>
      <button onClick = {handleBad}>Bad</button>
      <h1> Statistics </h1>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

export default App