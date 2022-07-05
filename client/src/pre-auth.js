import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Login from './Login';
import Register from './Register';

function PreAuth() {
    return (
        <Tabs defaultActiveKey="Login" id="pre-auth-tabs" className="mb-3">
          <Tab eventKey="Login" title="Login">
            <Login />
          </Tab>
          <Tab eventKey="Register" title="Register">
            <Register />
          </Tab>
        </Tabs>
      );
}

export default PreAuth