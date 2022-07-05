import Table from 'react-bootstrap/Table'

function DataTable(props) {
    const totals = props.data.reduce(
        (prev, curr) => {
            return {
                gallons: prev.gallons + curr.gallons,
                miles: prev.miles + curr.miles, 
                total_price: prev.total_price + curr.total_price,
            }
        }, 
        {gallons: 0, miles: 0, total_price: 0}
    )
    const numRows = props.data.length
    const averages = {
        gallons: (totals.gallons / numRows), 
        miles: (totals.miles / numRows), 
        total_price: (totals.total_price / numRows),
        time: "Average",
        _id: "Average",
    }
    averages.mpg = (averages.miles / averages.gallons).toFixed(2)
    const data_with_mpg = props.data.map(row => {
        return {...row, mpg: (row.miles / row.gallons).toFixed(2), time: (new Date(row.time)).toLocaleString()}
    })
    const tableRows = data_with_mpg.map(row => {
        return (
        <tr key={row._id}>
            <td>{row.time}</td>
            <td>{row.miles}</td>
            <td>{row.gallons}</td>
            <td>{row.total_price}</td>
            <td>{row.mpg}</td>
        </tr>
        )
    })
    tableRows.push()
    return (
        <Table striped bordered hover responsive="sm">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Miles</th>
                    <th>Gallons</th>
                    <th>Price</th>
                    <th>MPG</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
            <tfoot>
                <tr key={averages._id}>
                    <td><strong>{averages.time}</strong></td>
                    <td><strong>{averages.miles}</strong></td>
                    <td><strong>{averages.gallons}</strong></td>
                    <td><strong>{averages.total_price}</strong></td>
                    <td><strong>{averages.mpg}</strong></td>
                </tr>
            </tfoot>
        </Table>
    )
}

export default DataTable