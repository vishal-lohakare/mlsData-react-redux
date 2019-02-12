import React, { Component } from 'react';
import Routing from './routing';
import {
  ZapHeader,
  ZapFooter,
  ZapPanel
} from './components';
import {
  Container,
  Row
} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ZapHeader/>
        <Container fluid className="mainWrapper">
          <Row className="mr-0">
            <ZapPanel/>
            <Routing/>
          </Row>
        </Container>
        <ZapFooter />
        <img className="hide" src={require('images/loader.gif')} />
      </div>
    );
  }
}

export default App;
