// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Col,
  Input,
  Label,
  FormGroup,
  Alert,
  Form
} from 'reactstrap';
import { forceLogout } from 'utils/logout';

import './LoginScreen.scss';

import * as MlsLoginAction from 'actions/MlsLoginAction';
import * as MlsZapHeaderAction from 'actions/MlsZapHeaderAction';

const mapDispatchToProps = (dispatch) => ({
  MlsLoginAction: bindActionCreators(MlsLoginAction, dispatch),
  MlsZapHeaderAction: bindActionCreators(MlsZapHeaderAction, dispatch),
})

const mapStateToProps = state => {
  return {
    MlsLogin: _.get(state.MLSLoginData, 'MlsLogin', {}),
  }
}

type Props = {
  MlsLoginAction: typeof MlsLoginAction,
  MlsZapHeaderAction: typeof MlsZapHeaderAction,
  MlsLogin: {
    isFail: boolean,
  }
};

type State = {
  username: string,
  password: string,
  clientError: boolean
};

class LoginScreen extends Component<Props, State> {

  constructor(props:Props) {
    super(props);
    (this:any).handleLoginClick = this.handleLoginClick.bind(this);
    this.state = {
      username: '',
      password: '',
      clientError: false,
    }
  }

  componentDidMount() {
    this.props.MlsZapHeaderAction.clearSessionData();
    this.props.MlsLoginAction.showFullHeader(false);
    forceLogout();
  }

  handleInputBlur = (event) => {
    const newState = _.cloneDeep(this.state);
    const inputValue = event.target.value;
    const inputName = event.target.name;
    newState[inputName] = inputValue
    this.setState({...newState}, () => {
      if(this.validateLoginDetails()) {
        newState.clientError = false;
        this.setState({...newState});
      }
    });
  }

  validateLoginDetails() {
    const { username, password } = this.state;
    if(username === '' || password === '') {
      return false;
    }
    return true;
  }

  handleLoginClick = (event) => {
    event.preventDefault();
    const newState = _.cloneDeep(this.state);
    if(this.validateLoginDetails()) {
      const { username, password } = this.state;
      this.props.MlsLoginAction.loginMls({ username: username, password: password });
      newState.clientError = false;
    } else {
      newState.clientError = true;
    }
    this.setState({...newState});
  }

  handleInputChange = (event) => {
    const newState = _.cloneDeep(this.state);
    const { value: inputValue, name: inputName } = event.target;
    newState[inputName] = inputValue;
    this.setState({ ...newState }, () => {
      if (this.validateLoginDetails()) {
        newState.clientError = false;
        this.setState({ ...newState });
      }
    });
  }

  render() {
    const { username, password, clientError } = this.state;
    const { MlsLogin } = this.props
    return (
      <Col xs="12" md="12" className="loginCardWrapper" style={{minHeight: window.innerHeight - 200}}>
        <Form onSubmit={this.handleLoginClick}>
          <Card className="loginCard">
            <CardHeader className="text-left">User Login</CardHeader>
            <CardBody>
              {
                clientError && <Alert color="danger">
                  Please enter below details.
                </Alert>
              }
              {
                !clientError && MlsLogin && MlsLogin.isFail && <Alert color="danger">
                  Invalid Username or Password.
                </Alert>
              }
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange}
                  invalid={clientError && username === ''}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange}
                  invalid={clientError && password === ''}
                />
              </FormGroup>
            </CardBody>
            <CardFooter className="text-right">
              <Button color="primary" type="submit">Login</Button>
            </CardFooter>
          </Card>
        </Form>
      </Col>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
