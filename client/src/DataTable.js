import Button from 'react-bootstrap/esm/Button'
import Table from 'react-bootstrap/Table'

import prepData from './utils/PrepData'

function DataTable(props) {
    const { data_with_extras, averages } = prepData(props.data)
    const tableRows = data_with_extras.map(row => {
        return (
            <tr key={row._id}>
                <td>{(new Date(row.time)).toLocaleString()}</td>
                <td>{row.miles}</td>
                <td>{row.gallons}</td>
                <td>{row.total_price}</td>
                <td>{row.mpg}</td>
                <td>{row.ppg}</td>
            </tr>
        )
    })
    tableRows.reverse()
    tableRows.push()
    return (
        <div>
            <div className='d-flex justify-content-end mb-3'>
                <Button onClick={() => props.refreshHandler()}>Refresh Data</Button>
            </div>
            <Table striped bordered hover responsive="sm">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Miles</th>
                        <th>Gallons</th>
                        <th>Price</th>
                        <th>MPG</th>
                        <th>$/Gal</th>
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
                        <td><strong>{averages.ppg}</strong></td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}

export default DataTable