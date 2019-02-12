// @flow

import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  ListGroupItem,
  Input,
  ListGroup,
  Row,
  Col,
  Button
} from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';
import _ from 'lodash';
import './MappedUnmapped.scss';


type Props = {
  mappedData: {
    payload: {
      mlsStandardValueMapDtos: Array<Object>
    },
    isResponseSuccess: boolean
  },
  unMappedData: {
    payload: {
      mlsUnmappedValueDtos: Array<Object>
    },
    isResponseSuccess: boolean
  },
  moveToUnmapped: Function,
  moveToMapped: Function,
  disable: boolean,
  clearMappedData: boolean,
  onMappedNextClick: Function,
  onMappedPreviousClick: Function,
  onUnMappedNextClick: Function,
  onUnMappedPreviousClick: Function,
  onSearchMappedValues: Function,
  onSearchUnMappedValues: Function,
  totalEntriesMapped: number,
  totalEntriesUnMapped: number,
  numberOfEntriesPerPageMapped: number,
  numberOfEntriesPerPageUnMapped: number
};

type State = {
  mappedData: Array<Object>,
  selectedMapped: Array<Object>,
  unMappedData: Array<Object>,
  selectedUnmapped: Array<Object>,
  mappedDisabled: boolean,
  unmappedDisabled: boolean,
  clearMappedData: boolean,
  pageNumberMapped: number,
  pageNumberUnMapped: number,
};

export default class MappedUnmapped extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { mlsStandardValueMapDtos} = props.mappedData.payload;
    const { mlsUnmappedValueDtos} = props.unMappedData.payload;
    this.state = {
      mappedData: mlsStandardValueMapDtos ? mlsStandardValueMapDtos : [],
      selectedMapped: [],
      unMappedData: mlsUnmappedValueDtos ? mlsUnmappedValueDtos : [],
      selectedUnmapped: [],
      mappedDisabled: true,
      unmappedDisabled: true,
      clearMappedData: props.clearMappedData ? props.clearMappedData : false,
      pageNumberMapped: 0,
      pageNumberUnMapped: 0,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { mappedData, unMappedData, clearMappedData } = this.props;

    if(prevProps.mappedData.isResponseSuccess !== mappedData.isResponseSuccess && mappedData.isResponseSuccess) {
      this.setState({mappedData: mappedData.payload.mlsStandardValueMapDtos})
    }

    if(prevProps.unMappedData.isResponseSuccess !== unMappedData.isResponseSuccess && unMappedData.isResponseSuccess) {
      this.setState({unMappedData: unMappedData.payload.mlsUnmappedValueDtos})
    }

    if(prevProps.clearMappedData !== clearMappedData && clearMappedData){
      this.setState({mappedData: []})
    }
  }

  onSearch = (searchText: string, section: string) => {
    const { onSearchMappedValues, onSearchUnMappedValues } = this.props;
    const searchQuery = searchText.toLowerCase().trim();
    section === "mapped" ? onSearchMappedValues(searchQuery) : onSearchUnMappedValues(searchQuery);
  }

  selectContent = (content: Object, section: string) => {
    const newState = _.cloneDeep(this.state);
    const selectedData = (section === 'mapped') ? newState.selectedMapped : newState.selectedUnmapped;

    let removeFlag = false;
    let results = selectedData;

    if(_.size(selectedData) > 0) {
      results = _.remove(selectedData, function(item) {
          if(item.value === content.value) {
            removeFlag = true;
            return false;
          }
          return true;
      });

    }
    if(!removeFlag) {
      results.push(content);
    }

    if(section === "mapped") {
      newState.selectedMapped = results;
      newState.mappedDisabled = _.size(results)>0 ? false : true;
      newState.unmappedDisabled = true;
      newState.selectedUnmapped = []
    } else {
      newState.selectedUnmapped = results;
      newState.selectedMapped = [];
      newState.mappedDisabled = true;
      newState.unmappedDisabled = _.size(results)>0 ? false : true;
    }
    this.setState({...newState})
  }

  moveToUnmapped = () => {
    const newState = _.cloneDeep(this.state);
    if(newState.selectedMapped.length > 0) {
      _.forEach(newState.selectedMapped, (selectedMappedItem) => {
        newState.mappedData = _.filter(newState.mappedData, (mappedDataItem) => {
          return selectedMappedItem.value !== mappedDataItem.value;
        },selectedMappedItem);
        newState.unMappedData.push(selectedMappedItem);
      })
      newState.unMappedData = _.sortBy(newState.unMappedData, (item) => {
        return item.value;
      })
      this.props.moveToUnmapped(newState.selectedMapped);
      newState.selectedMapped = [];
      newState.mappedDisabled = true;
      this.setState({...newState});
    }
  }

  renderContentList = (data: Array<Object>, section: string) =>  {
    let contentData = [];
    const selections = (section === 'mapped') ? this.state.selectedMapped : this.state.selectedUnmapped;

    for(let i=0; i < data.length; i++) {
      if(data[i]) {
        let selectedContent = _.find(selections, (item) => {
          return item.value === data[i].value;
        });
        if(selectedContent) {
          contentData.push(
            <ListGroupItem
              tag="li"
              className={"selected "+ section}
              onClick = {() => {this.selectContent(data[i], section)}}
              key={i}
            >
            {data[i].value}
            </ListGroupItem>)
        } else {
          contentData.push(
            <ListGroupItem
             tag="li"
             className={section}
             onClick = {() => {this.selectContent(data[i], section)}}
             key={i}
             disabled={this.props.disable}
             >
             {data[i].value}
            </ListGroupItem>)
        }

      }
    }
    return contentData;
  }

  moveToMapped = () => {
    const newState = _.cloneDeep(this.state);
    if(newState.selectedUnmapped.length > 0) {
      _.forEach(newState.selectedUnmapped, (selectedUnmappedItem) => {
        if(selectedUnmappedItem) {
          newState.unMappedData = _.filter(newState.unMappedData, (unMappedDataItem) => {
            return selectedUnmappedItem.value !== unMappedDataItem.value;
          },selectedUnmappedItem);
        }
        newState.mappedData.push(selectedUnmappedItem);
      })
      newState.mappedData = _.sortBy(newState.mappedData, (item) => {
        return item.value;
      })
      this.props.moveToMapped(newState.selectedUnmapped);
      newState.selectedUnmapped = [];
      newState.unmappedDisabled = true;
      this.setState({...newState});
    }
  }

  onNextClick = (type: string) => {
    const { onUnMappedNextClick, onMappedNextClick } = this.props;
    const { pageNumberMapped, pageNumberUnMapped } = this.state;
    const newState: Object = {};
    let pageNumber;
    if(type === "mapped"){
      pageNumber = pageNumberMapped;
      pageNumber++;
      newState.pageNumberMapped = pageNumber;
      onMappedNextClick(pageNumber);
    } else {
      pageNumber = pageNumberUnMapped;
      pageNumber++;
      newState.pageNumberUnMapped = pageNumber;
      onUnMappedNextClick(pageNumber);
    }
    this.setState({ ...newState });
  }

  onPreviousClick = (type: string) => {
    const { onUnMappedPreviousClick, onMappedPreviousClick } = this.props;
    const { pageNumberMapped, pageNumberUnMapped } = this.state;
    const newState: Object = {};
    let pageNumber;
    if(type === "mapped"){
      pageNumber = pageNumberMapped;
      pageNumber--;
      newState.pageNumberMapped = pageNumber;
      onMappedPreviousClick(pageNumber);
    } else {
      pageNumber = pageNumberUnMapped;
      pageNumber--;
      newState.pageNumberUnMapped = pageNumber;
      onUnMappedPreviousClick(pageNumber);
    }
    this.setState({ ...newState });
  }

  renderPagination = (type: string) => {
    let pageNumber, pageData, totalEntries, numberOfEntriesPerPage;
    if(type === "mapped"){
      const { pageNumberMapped, mappedData } = this.state;
      const { totalEntriesMapped, numberOfEntriesPerPageMapped } = this.props;
      pageNumber = pageNumberMapped;
      pageData = mappedData;
      totalEntries = totalEntriesMapped;
      numberOfEntriesPerPage = numberOfEntriesPerPageMapped;
    } else {
      const { pageNumberUnMapped, unMappedData } = this.state;
      const { totalEntriesUnMapped, numberOfEntriesPerPageUnMapped } = this.props;
      pageNumber = pageNumberUnMapped;
      pageData = unMappedData;
      totalEntries = totalEntriesUnMapped;
      numberOfEntriesPerPage = numberOfEntriesPerPageUnMapped;
    }
    if(pageData && pageData.length > 0){
      return(
        <Row className="mb-3 mt-3">
          <Col xs="6">
            <a
              href="javascript:void(0)"
              className={pageNumber === 0 ? "disabledNavigationLinks previousLink" : "previousLink"}
              onClick={() => this.onPreviousClick(type)}
            >
              Previous
            </a>
          </Col>
          <Col xs="6" className="text-right">
            <a
              href="javascript:void(0)"
              onClick={() => this.onNextClick(type)}
              className={(totalEntries <= pageData.length || (((pageNumber + 1) * numberOfEntriesPerPage) >= totalEntries)) ? "disabledNavigationLinks nextLink" : "nextLink"}
            >
              Next
            </a>
          </Col>
        </Row>
      );
    } else {
      return null;
    }
  }

  render() {
    const { mappedData, unMappedData, unmappedDisabled, mappedDisabled } = this.state;

    return (
      <Row className="mappingContainer">
        <Col xs="12" md="5" lg="5">
          <Card>
            <CardHeader className="h5">
              Unmapped Values
            </CardHeader>
            <CardBody>
              <FormGroup>
                <DebounceInput
                  type="search"
                  name="search"
                  placeholder="Search Unmapped Values"
                  onChange={(event: Object) => this.onSearch(event.target.value, 'unmapped')}
                  debounceTimeout={300}
                  className="form-control unmappedSearch"
                />
              </FormGroup>
              { this.renderPagination("unmapped") }
              <Row className = "listScroll">
                <Col xs="12" md="12" lg="12">
                  <ListGroup flush>
                    {this.renderContentList(unMappedData, 'unmapped' )}
                  </ListGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col className="moveItemWithArrow" xs="12" md="2" lg="2">
          <div className="arrowsSection">
            <Button className="fa fa-chevron-circle-right custom mappedArrow zapButton" onClick={this.moveToMapped} disabled={unmappedDisabled}></Button>
            <Button className="fa fa-chevron-circle-left custom unmappedArrow zapButton" onClick={this.moveToUnmapped} disabled={mappedDisabled}></Button>
          </div>
        </Col>
        <Col xs="12" md="5" lg="5">
          <Card>
            <CardHeader className="h5">
              Mapped Values
            </CardHeader>
            <CardBody>
              <FormGroup>
                <DebounceInput
                  type="search"
                  name="search"
                  placeholder="Search Mapped Values"
                  onChange={(event: Object) => this.onSearch(event.target.value, 'mapped')}
                  debounceTimeout={300}
                  className="form-control mappedSearch"
                />
              </FormGroup>
              { this.renderPagination("mapped") }
              <Row className = "listScroll">
                <Col xs="12" md="12" lg="12">
                  <ListGroup flush>
                    {this.renderContentList(mappedData, 'mapped')}
                  </ListGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
  );
  }
}
