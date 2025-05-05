import { useState } from 'react'

const Button = (props) => {
  return (
    <>
      <button onClick={props.onClick}>{props.text}</button>
    </>
  )
}

const StatisticLine = (props) => {
  return (
    <>
      {props.text} {props.value} <br/>
    </>
  )
}

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  const avg = (props.good - props.bad) / all
  const positive = (props.good / all) * 100
  if (all == 0) {
    return (
      <>
        No feedback given
      </>
    )
  }
  // return (
  //   <>
  //     Good {props.good} <br />
  //     Neutral {props.neutral} <br />
  //     Bad {props.bad} <br />
  //     All {all} <br />
  //     Average {avg} <br />
  //     Positive {positive}%
  //   </>
  // )
  return (
    <div>
      <StatisticLine text="Good" value ={props.good} />
      <StatisticLine text="Neutral" value ={props.neutral} />
      <StatisticLine text="Bad" value ={props.bad} />
      <StatisticLine text="All" value = {all} />
      <StatisticLine text="Average" value ={avg} />
      <StatisticLine text="Positive" value ={positive} />
    </div>
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
      <Button onClick={handleGood} text="Good" />
      <Button onClick={handleNeutral} text="Neutral" />
      <Button onClick={handleBad} text="Bad" />
      <h1> Statistics </h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App