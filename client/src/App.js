import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
        }
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
            </div>
        );
    }


}

class InputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            MILES: null,
            GAS: null,
            PRICE_PER_GAL: null,
            success: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.postToAPI = this.postToAPI.bind(this);
    }
    render() {
        return (
            <div className="InputForm">
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
            }
            else {
                alert("Server returned an error: " + res.status);
            }
        });
    }
}

export default App;
