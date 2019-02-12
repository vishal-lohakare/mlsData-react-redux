// @flow

import React, { Component } from 'react';
import './ZapFooter.scss';

type Props = {};

type State = {};

export default class ZapFooter extends Component<Props, State> {

  render() {
    return (
      <footer>
        <div className="footer-wrapper">
          &copy;2019 ZapLabs LLC. Proprietary technology. All rights reserved.
        </div>
      </footer>
    )
  }
}
