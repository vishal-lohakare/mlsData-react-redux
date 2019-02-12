// @flow

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';
import { getCookie } from 'utils/session';

export const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  return (
    <Route {...rest} render={props => (
      getCookie("zapToken") !== '' ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }}/>
      )
    )}/>
  )

}
