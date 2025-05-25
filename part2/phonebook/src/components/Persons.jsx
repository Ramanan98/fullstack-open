const Persons = (props) => {
  return (
    <>
      {props.data
        .filter(person =>
          person.name.toLowerCase().includes(props.filter.toLowerCase())
        )
        .map(person => (
          <div key={person.name}>
            {person.name} {person.number}
            <button onClick={() => {props.deleteAction(person.id)}}>Delete</button>
          </div>
        ))}
    </>
  );
}

export default Persons;