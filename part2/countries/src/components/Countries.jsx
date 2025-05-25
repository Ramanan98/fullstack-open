const Countries = (props) => {
    return (
        <>
            {props.data.map(country => (<div key={country}>{country}</div>))}
        </>
    )
}
export default Countries