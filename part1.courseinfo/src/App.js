import React from 'react'

const Header = (props) => {
  console.log(props)
  return (
    <div>
      <h1>
        {props.course.name}
      </h1>
    </div>
  )
}

const Total = (props) => {
  console.log(props)
  return (
    <div>
      <p>Number of exercises {props.course.parts[0].exercises + props.course.parts[1].exercises + props.course.parts[2].exercises}</p>
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <>
      <Part1 course={props}/>
      <Part2 course={props}/>
      <Part3 course={props}/>
    </>
  )
}

const Part1 = (props) => {
  console.log(props)
  return (
  <div>
    <p>Part 1: {props.course.course.parts[0].name}, {props.course.course.parts[0].exercises} exercises</p>
  </div>
  )
}

const Part2 = (props) => {
  console.log(props)
  return (
  <div>
    <p>Part 2: {props.course.course.parts[1].name}, {props.course.course.parts[1].exercises} exercises</p>
  </div>
  )
}

const Part3 = (props) => {
  console.log(props)
  return (
  <div>
    <p>Part 3: {props.course.course.parts[2].name}, {props.course.course.parts[2].exercises} exercises</p>
  </div>
  )
}

const App = () => {
  const course = {
    name:'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default App