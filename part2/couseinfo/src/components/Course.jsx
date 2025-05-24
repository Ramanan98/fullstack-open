const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => {
  return (<div>
    {props.parts.map(part => <Part key={part.id} part={part} />)}
  </div>)
}

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => {
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <>
      <p>Total of {total} exercises</p>
    </>
  )
}

const Course = (props) => {
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total parts={props.course.parts} />
    </div>
  )
}

export default Course