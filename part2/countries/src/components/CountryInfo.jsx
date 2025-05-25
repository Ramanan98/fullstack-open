const CountryInfo = (props) => {
    const data = props.data
    if (!data) {
        return null
    }
    return (
        <>
            <h2>{data.name}</h2>
            Capital {data.capital} <br />
            Area {data.area} <br />
            <h3>Languages</h3>
            <ul>
                {Object.values(data.languages).map(lang => (
                    <li key={lang}>{lang}</li>
                ))}
            </ul>
            <div><img src={data.flag_url} /></div> ̰
        </>
    )
}
export default CountryInfo