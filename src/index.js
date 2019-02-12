import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import { store } from './utils/store';
import { Router } from 'react-router';
import history from 'utils/history';
import 'bootstrap/dist/css/bootstrap.css';
import 'styles/styles.scss';
import 'font-awesome/css/font-awesome.min.css';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
 </Provider>, document.getElementById('root'));
