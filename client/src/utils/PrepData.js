export default function prepData(data) {
    const totals = data.reduce(
        (prev, curr) => {
            return {
                gallons: prev.gallons + curr.gallons,
                miles: prev.miles + curr.miles,
                total_price: prev.total_price + curr.total_price,
            }
        },
        { gallons: 0, miles: 0, total_price: 0 }
    )
    const numRows = data.length
    const averages = {
        gallons: (totals.gallons / numRows).toFixed(3),
        miles: (totals.miles / numRows).toFixed(1),
        total_price: (totals.total_price / numRows).toFixed(2),
        time: "Average",
        _id: "Average",
    }
    averages.mpg = (averages.miles / averages.gallons).toFixed(2)
    averages.ppg = (averages.total_price / averages.gallons).toFixed(2)
    const data_with_extras = data.map(row => {
        return { ...row, mpg: (row.miles / row.gallons).toFixed(2), ppg: (row.total_price / row.gallons).toFixed(2) }
    })

    return { data_with_extras, averages }
}