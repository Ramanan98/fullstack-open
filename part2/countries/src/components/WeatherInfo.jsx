const WeatherInfo = (props) => {
    const data = props.data
    if (!data) {
        return null
    }
    return (
        <>
            Temperate {data.temp} °C
            <div><img src={data.icon_url} /></div>
            Wind {data.wind} m/s
        </>
    )
}
export default WeatherInfo