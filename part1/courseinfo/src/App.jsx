import { useState } from 'react'

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  if (all == 0) {
    return (
      <>
        No feedback given
      </>
    )
  }
  const avg = (props.good - props.bad) / all
  const positive = (props.good / all) * 100
  return (
    <>
      Good {props.good} <br />
      Neutral {props.neutral} <br />
      Bad {props.bad} <br />
      All {all} <br />
      Average {avg} <br />
      Positive {positive}%
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
      <button onClick={handleGood}>Good</button>
      <button onClick={handleNeutral}>Neutral</button>
      <button onClick={handleBad}>Bad</button>
      <h1> Statistics </h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App