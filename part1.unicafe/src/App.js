import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick ={handleClick}>{text}</button>)

const StatisticLine = ({text, value}) => (<tr><td>{text}</td><td>{value}</td></tr>)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good+1)
  const handleNeutral = () => setNeutral(neutral+1)
  const handleBad = () => setBad(bad+1)

  if (good+neutral+bad ===0) {
    return (
      <div>
        <h1>Give feedback</h1>
          <Button handleClick ={handleGood} text = 'good'/>
          <Button handleClick ={handleNeutral} text = 'neutral'/>
          <Button handleClick ={handleBad} text = 'bad'/>
          <p>No feedback given, start clicking to see statistics</p>
        </div>
    )
  } else {
    return (
      <div>
        <h1>Give feedback</h1>
        <Button handleClick ={handleGood} text = 'good'/>
        <Button handleClick ={handleNeutral} text = 'neutral'/>
        <Button handleClick ={handleBad} text = 'bad'/>
        <h2>Statistics</h2>
        <table>
          <tbody>
            <StatisticLine text = "good" value={good} />
            <StatisticLine text = "neutral" value={neutral} />
            <StatisticLine text = "bad" value={bad} />
            <StatisticLine text = "all" value={good+neutral+bad} />
            <StatisticLine text = "average" value={(good-bad)/(good+bad+neutral)} />
            <StatisticLine text = "positive" value={good*100/(good+bad+neutral)} />
          </tbody>
        </table>
      </div>
    )
  }
}

export default App