// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Row,
  Col
} from 'reactstrap';
import * as MlsZapPanelAction from 'actions/MlsZapPanelAction';
import * as MlsZapHeaderAction from 'actions/MlsZapHeaderAction';
import './ZapHeader.scss';
import _ from 'lodash';
import { forceLogout } from 'utils/logout';

const mapDispatchToProps = (dispatch) => ({
  MlsZapPanelAction: bindActionCreators(MlsZapPanelAction, dispatch),
  MlsZapHeaderAction:  bindActionCreators(MlsZapHeaderAction, dispatch)
});

const mapStateToProps = state => {
  return {
    MlsLogin: _.get(state.MLSLoginData, 'showFullHeader', {})
  }
}

type Props = {
  MlsZapPanelAction: typeof MlsZapPanelAction,
  MlsZapHeaderAction: typeof MlsZapHeaderAction,
  MlsLogin: Object
};


export class ZapHeader extends Component<Props> {

  handlePanelClick = () => {
    this.props.MlsZapPanelAction.toggleSideBar();
  }

  handleLogout = () => {
    this.props.MlsZapHeaderAction.clearSessionData();
    forceLogout();
  }

  render() {
    const { MlsLogin } = this.props;
    let menu = '', logout = '';

    if(MlsLogin.isShowFullHeader ) {
        menu =  <Button className="fa fa-bars menuIcon" onClick={this.handlePanelClick}></Button>

        logout =  <div>
                    <i className="fa fa-power-off logoutIcon"></i>
                    <span className="logoutText">Logout</span>
                  </div>;
    }

    return (

      <header>
        <div className="headerWrapper">
          <Row>
            <Col xs="4" md="4" className="menuWrapper">
              {menu}
            </Col>
            <Col xs="4" md="4" className="logoWrapper">
              <img width="120" height="38" src={require('images/ZapLabs-Logo.png')} />
            </Col>
            <Col xs="4" md="4" className="logoutWrapper" onClick={this.handleLogout}>
              {logout}
            </Col>
          </Row>
        </div>
      </header>

    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZapHeader);
