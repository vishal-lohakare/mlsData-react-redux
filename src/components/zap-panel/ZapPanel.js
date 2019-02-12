  // @flow

  import React, { Component, Fragment } from 'react';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  import { NavLink} from 'react-router-dom';
  import {
    Navbar,
    Nav,
    NavItem,
    Col
  } from 'reactstrap';
  import _ from 'lodash';
  import classnames  from 'classnames';

  import './ZapPanel.scss';
  import * as MlsZapPanelAction from 'actions/MlsZapPanelAction';
  import links from 'utils/routes';
  import history from 'utils/history';
  import { getSessionData } from 'utils/session';

  const mapDispatchToProps = (dispatch) => ({
    MlsZapPanelAction: bindActionCreators(MlsZapPanelAction, dispatch)
  })

  const mapStateToProps = (state) => {
    return {
      MlsZapPanelData: _.get(state, 'MLSZapPanelData', {}),
      showFullHeader: _.get(state.MLSLoginData, 'showFullHeader', {})
    }
  }

  type Props = {
    MlsZapPanelAction: typeof MlsZapPanelAction,
    MlsZapPanelData: {
      panelIsOpen: boolean,
      pathname: string,
      linkStatus: Array<string>
    },
    links: Array<Object>,
    history: Object,
    showFullHeader: {
      isShowFullHeader: boolean,
    }
  };

  type State = {
    selectedLink: string,
  }

  export class ZapPanel extends Component<Props, State> {

    constructor(props: Props) {
      super(props);
      this.state = {
        selectedLink: '/mlsSearch',
      }
    }

    handleLinkClick = (activeLink: string, panelStatus: boolean) => {
      this.setState({
        selectedLink: activeLink,
      });
      if(panelStatus){
        this.props.MlsZapPanelAction.toggleSideBar();
      }
      history.push(activeLink);
    }

    componentDidUpdate(prevProps: Props) {
      const { MlsZapPanelData: { pathname }, showFullHeader: { isShowFullHeader } } = this.props;
      if(pathname !== '/'){
        if(prevProps.MlsZapPanelData.pathname !== pathname) {
          this.setState({
            selectedLink: (_.find(links, {link: pathname})).link
          })
        }
      }
    }

    render() {
      const { MlsZapPanelData: { panelIsOpen }, MlsZapPanelData: { linkStatus }, showFullHeader: { isShowFullHeader } } = this.props;
      const { selectedLink } = this.state;
      let activeLinks = ['/mlsSearch'], linkClasses;


      if(isShowFullHeader){
        activeLinks = (linkStatus.length != 0) ? linkStatus : getSessionData('MlsStages');
      }

      return (
        <Fragment>
          {isShowFullHeader && <Col xs="4" md="1" className="zapPanel">
            <div className={`panelWrapper ${!panelIsOpen ? 'panelCollapse' : ''}`}>
              <Navbar color="faded" light>
                <Nav navbar>
                { _.map(links, (item, index) => {
                    linkClasses = classnames({
                      'deActivated': (!_.includes(activeLinks, item.link)),
                      'activated': (_.includes(activeLinks, item.link)) ,
                      'selected': (selectedLink === item.link)
                    });
                    return (
                      <NavItem key={index} className={linkClasses}  onClick={() => {
                        this.handleLinkClick(item.link , panelIsOpen)
                      }}>
                        <div className="nav-item-section" >
                          <NavLink
                            className='linkText'
                            to={{pathname:item.link, state: { selectedLink: item.link}}}
                          >
                          <i className={item.icon}></i>

                          {panelIsOpen && item.name}
                          </NavLink>
                        </div>
                      </NavItem>
                      )
                    })
                  }
                </Nav>
              </Navbar>
            </div>
          </Col>}
        </Fragment>
      )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZapPanel);
