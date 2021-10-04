import React from 'react';

const Course = (props) => {
    return (
      <div>
        
        <Content parts={props.course} />
        <Total course={props.course.parts} />
      </div>
    )
}
export default Course;

const Header = ({header}) => {
    return (
      <h2>{header}</h2>
    )
  }
  
  const Total = (props) => {
    const ex = props.course.map(part=>part.exercises)
    const sum = ex.reduce((sum, part) => sum+part);
  
    return (
      <p>Total number of exercises {sum}</p>
    ) 
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part.name}, { props.part.exercises} exercises
      </p>    
    )
  }
  
  const Content = (props) => {
    return (
      <div>
          <Header header={props.parts.name} />
          <ul>
              {props.parts.parts.map(part =>
                  <Part key={part.id} part={part}/>    
              )}
          </ul>     
      </div>
    )
  }
  

