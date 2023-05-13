import { useState } from "react"

import ButtonGroup from "react-bootstrap/esm/ButtonGroup"
import Button from "react-bootstrap/esm/Button"

import Plotly from "plotly.js-finance-dist"
import createPlotlyComponent from "react-plotly.js/factory"

import prepData from "./utils/PrepData"

const Plot = createPlotlyComponent(Plotly)

function transposeData(data) {
    const transposedData = {}
    transposedData.time = data.map((row) => { return new Date(row.time) })
    transposedData.gallons = data.map((row) => { return row.gallons })
    transposedData.miles = data.map((row) => { return row.miles })
    transposedData.mpg = data.map((row) => { return row.mpg })
    transposedData.total_price = data.map((row) => { return row.total_price })
    transposedData.ppg = data.map((row) => { return row.ppg })
    return transposedData
}

function Graph(props) {
    let { data_with_extras } = prepData(props.data)
    data_with_extras = transposeData(data_with_extras)

    const [col, setCol] = useState("miles")
    return (
        <div>
            <ButtonGroup className="d-flex">
                <Button variant={col === "miles" ? "primary" : "secondary"} onClick={() => setCol("miles")}>Miles</Button>
                <Button variant={col === "gallons" ? "primary" : "secondary"} onClick={() => setCol("gallons")}>Gallons</Button>
                <Button variant={col === "total_price" ? "primary" : "secondary"} onClick={() => setCol("total_price")}>Price</Button>
                <Button variant={col === "mpg" ? "primary" : "secondary"} onClick={() => setCol("mpg")}>MPG</Button>
                <Button variant={col === "ppg" ? "primary" : "secondary"} onClick={() => setCol("ppg")}>$/Gal</Button>
            </ButtonGroup>
            <Plot
                data={[{ x: data_with_extras.time, y: data_with_extras[col], type: 'scatter' }]}
                style={{ height: "100%", width: "100%" }}
                useResizeHandler={true}
                layout={{
                    autosize: true,
                    xaxis: {
                        autorange: true,
                        rangeslider: { range: [data_with_extras.time[0], data_with_extras.time[data_with_extras.time.length - 1]] },
                        type: 'date'
                    },
                    yaxis: {
                        autorange: true,
                        type: 'linear'
                    }
                }}
            />
        </div>
    )
}

export default Graph