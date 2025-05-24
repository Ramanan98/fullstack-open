const Filter = (props) => {
    return (
        <>
        Filter shown with <input value={props.value} onChange={props.onChange} />
        </>
    )
}

export default Filter