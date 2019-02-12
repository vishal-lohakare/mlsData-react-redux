// @flow

import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import history from 'utils/history';
import HomeScreen from 'routes/home/HomeScreen';
import LoginScreen  from 'routes/login/LoginScreen';
import UrlBuilderScreen  from 'routes/urlBuilder/UrlBuilderScreen';
import StandardValueScreen  from 'routes/standardValue/StandardValueScreen';
import CanonicalMappingScreen  from 'routes/canonicalMapping/CanonicalMappingScreen';
import MlsSearchScreen  from 'routes/mlsSearch/MlsSearchScreen';
import SchedulerScreen  from 'routes/scheduler/SchedulerScreen';
import MonitoringScreen from 'routes/monitoring/MonitoringScreen';
import DataConstraintsScreen from 'routes/dataConstraints/DataConstraintsScreen';
import { PrivateRoute } from './PrivateRoute';

import * as MlsZapPanelAction from 'actions/MlsZapPanelAction';
import { getSessionData, getCookie, setSessionData } from 'utils/session';

type Props = {
  MlsZapPanelAction: typeof MlsZapPanelAction,
};

const mapDispatchToProps = (dispatch) => ({
  MlsZapPanelAction: bindActionCreators(MlsZapPanelAction, dispatch)
});


class Routing extends Component<Props> {

  componentDidMount() {
    const currentPathname = window.location.pathname;
    if(getCookie('zapToken') !== ''){
      const activeLinks  = getSessionData('MlsStages');

      if((!_.isUndefined(activeLinks) && _.includes(activeLinks, currentPathname))) {
        this.props.MlsZapPanelAction.navigationUrlUpdate(currentPathname);
      }else if(_.isUndefined(activeLinks) || activeLinks === null){
        const newPath = '/mlsSearch';
        setSessionData('MlsStages', [newPath]);
        this.props.MlsZapPanelAction.updateLinkStatus([newPath]);
        this.props.MlsZapPanelAction.navigationUrlUpdate(newPath);
        history.push(newPath);
      }else if(currentPathname !== '/'){
        history.goBack();
      }
    }
  }

  componentDidUpdate(){
    const currentPathname = window.location.pathname;
    this.props.MlsZapPanelAction.navigationUrlUpdate(currentPathname);
  }

  render () {

    return (
      <Switch>
        <Route exact path="/" render={() => {
         return getCookie('zapToken') !== '' ? <Redirect to="/mlsSearch" /> : <LoginScreen/>
       }}/>
        <PrivateRoute exact path="/mlsSearch" component={MlsSearchScreen}/>
        <PrivateRoute exact path="/home" component={HomeScreen}/>
        <PrivateRoute exact path="/urlBuilder" component={UrlBuilderScreen}/>
        <PrivateRoute exact path="/standardValue" component={StandardValueScreen}/>
        <PrivateRoute exact path="/canonicalMappings" component={CanonicalMappingScreen}/>
        <PrivateRoute exact path="/scheduler" component={SchedulerScreen}/>
        <PrivateRoute exact path="/monitoring" component={MonitoringScreen}/>
        <PrivateRoute exact path="/dataConstraints" component={DataConstraintsScreen}/>
      </Switch>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Routing));
