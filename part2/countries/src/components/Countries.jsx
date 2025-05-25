const Countries = (props) => {
    return (
        <>
            {props.data.map(country => (<div key={country}>{country} <button onClick={() => { props.showAction(country) }}>Show</button></div>))}
        </>
    )
}
export default Countries