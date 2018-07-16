import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
        };
        this.columns = [
            {
                Header: 'Miles',
                accessor: 'MILES'
            },
            {
                Header: 'Gas',
                accessor: 'GAS'
            },
            {
                Header: 'Price/Gallon',
                accessor: 'PRICE_PER_GAL'
            }
        ];
    }

    componentDidMount() {
        this.getFromApi('/api/data')
            .then(res => this.setState({
                response: res,
            }))
            .catch(err => console.log(err));
    }

    getFromApi = async (endpoint) => {
        const response = await fetch(endpoint);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Gas Tracker</h1>
                </header>
                <InputForm />
                <ReactTable
                    data={this.state.response}
                    columns={this.columns}
                />
                <div id="attribution">Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></div>
            </div>
        );
    }


}

class InputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            MILES: "",
            GAS: "",
            PRICE_PER_GAL: "",
            success: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.postToAPI = this.postToAPI.bind(this);
    }
    render() {
        return (
            <div className="InputForm">
                <SuccessBanner show={this.state.success} />
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        Miles:
                        <br />
                        <input type="text" name="miles" value={this.state.MILES} onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Gallons of Gas:
                        <br />
                        <input type="text" name="gas" value={this.state.GAS} onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Price per Gallon:
                        <br />
                        <input type="text" name="price_per_gal" value={this.state.PRICE_PER_GAL} onChange={this.handleChange} />
                    </label>
                    <br />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }

    handleFormSubmit(event) {
        let data = {
            MILES: parseFloat(this.state.MILES),
            GAS: parseFloat(this.state.GAS),
            PRICE_PER_GAL: parseFloat(this.state.PRICE_PER_GAL)
        };
        if (isNaN(data.MILES) || isNaN(data.GAS) || isNaN(data.PRICE_PER_GAL)) {
            alert("All inputs must be valid numbers")
        }
        else {
            this.postToAPI(data);
        }
        event.preventDefault();
    }

    handleChange(event) {
        const state = Object.assign({}, this.state);
        switch (event.target.name) {
            case "miles":
                state.MILES = event.target.value;
                break;
            case "gas":
                state.GAS = event.target.value;
                break;
            case "price_per_gal":
                state.PRICE_PER_GAL = event.target.value;
                break;
            default:
                break;
        }
        this.setState(state);
    }

    postToAPI(data) {
        fetch('/api/data', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                this.setState(Object.assign({}, this.state, {success: true}));
                setTimeout(() => {
                    this.setState(Object.assign({}, this.state, {success: false}));
                }, 10000)
            }
            else {
                alert("Server returned an error: " + res.status);
            }
        });
    }
}

function SuccessBanner(props) {
    if(!props.show) {
        return null;
    }

    return (
        <div className="SuccessBanner">
            <h4 className="SuccessText">Success</h4>
        </div>
    )
}

export default App;
