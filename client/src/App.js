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
        this.callApi('/api/data')
            .then(res => this.setState({
                response: res[0].MILES,
            }))
            .catch(err => console.log(err));
    }

    callApi = async (endpoint) => {
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
            </div>
        );
    }
}

export default App;
