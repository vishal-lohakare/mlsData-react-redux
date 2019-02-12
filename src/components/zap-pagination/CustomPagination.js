// @flow

import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  ListGroup,
  ListGroupItem,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
  Button,
} from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';
import _ from 'lodash';
import './CustomPagination.scss';
import classnames  from 'classnames';

type Props = {
  pageContent: Object,
  numberOfEntriesPerPage: number,
  headerText: string,
  onItemClick: Function,
  addNewValue: Function,
  keyName: string,
  showAddNewSection: boolean,
  resetPagination: boolean,
  isServerPagination: boolean,
  onSearch: Function,
  onNextClick: Function,
  onPreviousClick: Function,
  totalEntries: number
};

type State = {
  pageData: Array<Object>,
  letterArray: Array<string>,
  pageNumber: number,
  disablePrevious: boolean,
  disableNext: boolean,
  selectedIndex: number,
  searchQuery: string,
  searchPlaceholder: string,
  selectedValueId: number,
};

export default class CustomPagination extends Component<Props, State> {

  static defaultProps = {
    isServerPagination: false,
    onSearch: () => {},
    addNewValue: () => {}
  }

  constructor(props: Props) {
    super(props);
    const pageData = _.isUndefined(props.pageContent.payload) ? [] : props.pageContent.payload;
    this.state = {
      pageData: pageData,
      letterArray: this.getLetterArray(pageData),
      pageNumber: this.props.isServerPagination ? 0 : 1,
      disablePrevious: true,
      disableNext: false,
      selectedIndex: -1,
      searchQuery: '',
      searchPlaceholder: '',
      selectedValueId: -1,
    };

    (this:any).renderContentList = this.renderContentList.bind(this);
    (this:any).onPreviousClick = this.onPreviousClick.bind(this);
    (this:any).onNextClick = this.onNextClick.bind(this);
    (this:any).getNumberOfPages = this.getNumberOfPages.bind(this);
    (this:any).onSearchText = this.onSearchText.bind(this);
    (this:any).clearFilter = this.clearFilter.bind(this);
    (this:any).getLetterArray = this.getLetterArray.bind(this);
    (this:any).onCombinedSearch = this.onCombinedSearch.bind(this);
    (this:any).renderPagination = this.renderPagination.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    const newState = _.cloneDeep(this.state);
    if(this.props.pageContent.isResponseSuccess !== prevProps.pageContent.isResponseSuccess && this.props.pageContent.isResponseSuccess) {
      const payload = this.props.pageContent.payload;
      this.setState({
        pageData: payload,
        letterArray: this.getLetterArray(payload)
      }, () => {
        this.onCombinedSearch(this.state.selectedIndex);
      });
    }

    if(prevProps.resetPagination !== this.props.resetPagination && this.props.resetPagination){
      this.setState({pageNumber: this.props.isServerPagination ? 0 : 1, selectedValueId: -1})
    }

  }

  onSearchText(event: Object) {
    const searchQuery = event.target.value;
    const { isServerPagination, onSearch } = this.props;
    if(isServerPagination){
      onSearch(searchQuery);
    } else {
      this.setState({
        searchQuery
      }, () => {
        this.onCombinedSearch(this.state.selectedIndex);
      });
    }
  }

  getLetterArray(data: Array<Object>) {
    const { keyName } = this.props;
    let letterArray = [];
    _.map(data, (item) => {
      letterArray.push(_.toUpper(item[keyName].substr(0, 1)))
    })
    return (_.uniq(letterArray)).sort();
  }

  onPageNumberclick(index: number) {
    const newState = _.cloneDeep(this.state);

    newState.pageNumber = index;
    if(index === 1) {
      newState.disablePrevious = true;
      newState.disableNext = false;
    }
    else if(newState.pageNumber === this.getNumberOfPages()) {
      newState.disablePrevious = false;
      newState.disableNext = true;
    } else {
      newState.disablePrevious = false;
      newState.disableNext = false;
    }
    this.setState({...newState});
  }

  getNumberOfPages() {
    const { pageData } = this.state;
    const { numberOfEntriesPerPage } = this.props;
    return Math.ceil(pageData.length / numberOfEntriesPerPage);
  }

  onNextClick() {
    if(this.props.isServerPagination){
      let { pageNumber } = this.state;
      pageNumber++;
      this.props.onNextClick(pageNumber);
      this.setState({
        pageNumber
      });
    } else {
      const { pageNumber } = this.state;
      const newState = _.cloneDeep(this.state);
      const numberOfPages = this.getNumberOfPages();
      if(pageNumber < numberOfPages) {
        newState.pageNumber++;
        newState.disablePrevious = false;
      }
      if(newState.pageNumber === numberOfPages) {
        newState.disableNext = true;
      }
      this.setState({...newState});
    }
  }

  onPreviousClick() {
    if(this.props.isServerPagination){
      let { pageNumber } = this.state;
      pageNumber--;
      this.props.onPreviousClick(pageNumber);
      this.setState({
        pageNumber
      });
    } else {
      const newState = _.cloneDeep(this.state);
      if(newState.pageNumber > 1) {
        newState.pageNumber--;
        newState.disableNext = false;
      }
      if(newState.pageNumber === 1) {
        newState.disablePrevious = true;
      }
      this.setState({...newState});
    }
  }

  onCombinedSearch(index: number) {
   const { letterArray, searchQuery } = this.state;
   const newState = _.cloneDeep(this.state);
   const { keyName, pageContent: { payload } } = this.props;
   let filteredData = _.cloneDeep(payload);

   if(index !== -1) {
     newState.selectedIndex = index;
     newState.searchPlaceholder = `Search within ${letterArray[index]} ...`;
     filteredData = payload.filter((item) => {
       return item[keyName].charAt(0).toLowerCase() === letterArray[index].toLowerCase();
     });
   }

   if(searchQuery.length>0) {
     filteredData = filteredData.filter((item) => {
         return item[keyName].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
     });
   }
   newState.pageData = filteredData;
   this.setState({...newState, pageNumber: 1, disablePrevious: true, disableNext: false});
 }

  clearFilter() {
    const newState = _.cloneDeep(this.state);
    newState.pageData = this.props.pageContent.payload;
    newState.letterArray = this.getLetterArray(newState.pageData);
    newState.selectedIndex = -1;

    this.setState({...newState, pageNumber: 1, searchPlaceholder: '' }, () => {
      if(this.state.searchQuery.length>0) {
        this.onCombinedSearch(-1);
      }
    });
  }

  renderLetterTiles() {
    const { letterArray, selectedIndex } = this.state;
    return (
      <ListGroup className="letterList" flush>
        {
          _.map(letterArray, (item, index) => {
            return <ListGroupItem
                      tag="a"
                      href="javascript:void(0);"
                      key={index}
                      onClick={() => {
                        this.onCombinedSearch(index)
                      }}
                      className={index === selectedIndex ? 'activeFilter' : ''}
                    >
                      {item}
                    </ListGroupItem>
          })
        }
        { !_.isEmpty(letterArray) &&
          <ListGroupItem
                  tag="a"
                  href="javascript:void(0);"
                  className="clearFilter fa fa-times-circle"
                  onClick={this.clearFilter}
                  title="Clear"
                >
                </ListGroupItem>
        }
      </ListGroup>
    )

  }

  renderPageTiles() {
    let pageArray = [];
    const { pageNumber } = this.state;
    const numberOfPages = this.getNumberOfPages();
    for(let i = 0; i < numberOfPages; i++) {
      pageArray.push(
        <PaginationItem key={i}>
          <PaginationLink
            key={i}
            onClick={() => {
              this.onPageNumberclick(i+1)
            }}
            className={i+1 === pageNumber ? 'activePage' : '' }
          >
            {i+1}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return pageArray;
  }

  renderContentList(pageData: Array<Object>) {
    const { numberOfEntriesPerPage, keyName, isServerPagination } = this.props;
    const { pageNumber, selectedValueId } = this.state;
    const startIndex = isServerPagination ? 0 : (numberOfEntriesPerPage * (pageNumber-1));
    let contentData = [];
    const contentDataLimit = isServerPagination ? pageData.length : numberOfEntriesPerPage*pageNumber;
    for(let i=startIndex; i < contentDataLimit; i++) {
      if(pageData[i]) {
        contentData.push(
          <ListGroupItem
            tag="a"
            href="javascript:void(0);"
            key={i}
            className={classnames('d-flex justify-content-between text-dark', {'selectedValue': pageData[i].id === selectedValueId})}
            onClick={() => {
              this.setState({
                selectedValueId: pageData[i].id
              });
              this.props.onItemClick(pageData[i]);
            }}
          >
            <span>{pageData[i][keyName]}</span>
            { pageData[i].mapped && <span className="mappedField">M</span> }
          </ListGroupItem>)
      }
    }
    return contentData;
  }

  renderPagination() {
    const { pageNumber, pageData } = this.state;
    const { isServerPagination, totalEntries, numberOfEntriesPerPage } = this.props;
    if(isServerPagination){
      return(
        <div>
          <Row className="mb-3 mt-3">
            <Col xs="6">
              <a
                href="javascript:void(0)"
                className={pageNumber === 0 ? "disabledNavigationLinks" : ""}
                onClick={this.onPreviousClick}
              >
                Previous
              </a>
            </Col>
            <Col xs="6" className="text-right">
              <a
                href="javascript:void(0)"
                onClick={this.onNextClick}
                className={(totalEntries <= pageData.length || (((pageNumber + 1) * numberOfEntriesPerPage) >= totalEntries)) ? "disabledNavigationLinks" : ""}
              >
                Next
              </a>
            </Col>
          </Row>
        </div>
      );
    } else {
      if(this.getNumberOfPages() > 1) {
        const { disablePrevious, disableNext } = this.state;
        return (
          <div className="d-flex mt-1">
            <PaginationItem tag="span" disabled={disablePrevious}>
              <PaginationLink previous onClick={this.onPreviousClick} />
            </PaginationItem>
            <Pagination className="customPagination">
                {this.renderPageTiles()}
            </Pagination>
            <PaginationItem tag="span" disabled={disableNext}>
              <PaginationLink next href="javascript:void(0);" onClick={this.onNextClick} />
            </PaginationItem>
          </div>
        )
      }
    }
  }

  render() {

    const { headerText, showAddNewSection, addNewValue, isServerPagination } = this.props;
    const { pageData, searchPlaceholder } = this.state;

    return (
      <Card>
        <CardHeader className="customCardHeader">
          <span className="h5">{headerText}</span>
          {
            showAddNewSection &&
            <Button
              color="primary"
              className="zapButton" onClick={() => {
              addNewValue();
            }}>
              <i className="fa fa-plus-circle" aria-hidden="true"></i>
              <span className="sr-only">Add new value</span>
            </Button>
          }
        </CardHeader>
        <CardBody className="customCardBody">
          <FormGroup>
            <DebounceInput
              type="search"
              name="search"
              placeholder="Search"
              onChange={this.onSearchText}
              debounceTimeout={300}
              className="form-control"
            />
            {searchPlaceholder!=='' && <span className="searchNote">{searchPlaceholder}</span>}
          </FormGroup>
          { pageData.length > 0 && this.renderPagination() }
          <Row className="paginationCard">
            <Col xs="12" md={isServerPagination ? "12" : "10"}>
              <ListGroup flush>
                {this.renderContentList(pageData)}
              </ListGroup>
            </Col>
            { !isServerPagination &&
              <Col xs="12" md="2">
                {this.renderLetterTiles()}
              </Col>
            }
          </Row>
          { pageData.length > 0 && this.renderPagination() }
        </CardBody>
      </Card>
    );
  }
}
