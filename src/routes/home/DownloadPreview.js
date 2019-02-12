// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Input, Label } from 'reactstrap';
import _ from 'lodash';
import Pagination from './Pagination';

import * as MlsConfigureAction from 'actions/MlsConfigureAction';
import * as MlsContextVariableAction from 'actions/MlsContextVariableAction';
import { downloadPreviewPageSize, downloadPreviewPageOffset, previewMaxCharsLength } from 'constants/global';
import AddContextVarModal from './AddContextVarModal';

const mapDispatchToProps = (dispatch) => ({
  MlsConfigureAction: bindActionCreators(MlsConfigureAction, dispatch),
  MlsContextVariableAction: bindActionCreators(MlsContextVariableAction, dispatch)
});

const mapStateToProps = (state, props) => {
  return {
    MlsDownloadFiles: _.get(state.MLSConfigureData, 'MlsDownloadFiles', {}),
    MlsDownloadUpdatedFiles: _.get(state.MLSConfigureData, 'MlsDownloadUpdatedFiles', {}),
    MlsMetadataDownloadPreview: _.get(state.MLSConfigureData, 'MlsMetadataDownloadPreview', {}),
    MlsMetadataDownloadPreviewData: _.get(state.MLSConfigureData, 'MlsMetadataDownloadPreview.payload', {}),
    MlsMetadataLookupDownloadPreview: _.get(state.MLSConfigureData, 'MlsMetadataLookupDownloadPreview', {}),
    MlsMetadataLookupDownloadPreviewData: _.get(state.MLSConfigureData, 'MlsMetadataLookupDownloadPreview.payload', {}),
    MlsPreviewColumnUniqueData: _.get(state.MLSConfigureData, 'MlsPreviewColumnUniqueData', {}),
    MlsPreviewColumnUniquePayload: _.get(state.MLSConfigureData, 'MlsPreviewColumnUniqueData.payload', {}),
    MlsConfigureData: _.get(state.MLSConfigureData, 'MlsConfigureResult.payload[0]', {}),
    MlsPreviewData: _.get(state.MLSConfigureData, props.source, {})
  }
};

type Props = {
  source: string,
  showPreview: boolean,
  onShowPreview: Function,
  hideShowPreview: Function,
  MlsConfigureAction: typeof MlsConfigureAction,
  MlsContextVariableAction: typeof MlsContextVariableAction,
  MlsConfigureData: Object,
  MlsDownloadFiles: Object,
  MlsDownloadUpdatedFiles: Object,
  MlsMetadataDownloadPreview: Object,
  MlsMetadataDownloadPreviewData: Array<Object>,
  MlsMetadataLookupDownloadPreview: Object,
  MlsMetadataLookupDownloadPreviewData: Array<Object>,
  MlsPreviewColumnUniqueData: Object,
  MlsPreviewColumnUniquePayload: Array<string>,
  MlsConfigureData: Object,
  MlsPreviewData: Object
};

type State = {
  dropdownOpen: boolean,
  clickedColumn: string,
  hierarchy: boolean,
  filterApplied: boolean,
  isHighlighted: boolean,
  metadataPreviewData: Array<Object>,
  metadataLookupPreviewData: Array<Object>,
  metadataPagination: Object,
  lookupPagination: Object,
  isMetadata: boolean,
  mColumnUniqueData: Object,
  lColumnUniqueData: Object,
  mFilteredUniqueData: Object,
  lFilteredUniqueData: Object,
  mCheckboxList: Object,
  lCheckboxList: Object,
  mCheckedFields: Object,
  lCheckedFields: Object,
  selectedField: string,
  mShowFiltersPanel: boolean,
  lShowFiltersPanel: boolean,
  mFilters: Object,
  lFilters: Object,
  isAddModalOpen: boolean,
  contextVariableName: string,
  disableAddNewContextButton: boolean,
  copyContextDisableBtn: boolean,
  copyContextSelectedCell: Object,
  copyContextSelectedValue: string,
  copyContextMetadataType: string,
  copyContextElasticSearchIndexId: string,
  copyContextColumnId: number,
  showDropdown: boolean,
  mIsFilterRequestSent: boolean,
  lIsFilterRequestSent: boolean,
  showLookup: boolean
};

class DownloadPreview extends React.Component<Props,State> {
  initialData: Object = {};
  dropdown: ?HTMLDivElement;
  isResizing: boolean = false;

  constructor(props) {
    super(props);

    const { MlsPreviewData } = props;
    const isNotEmpty = !this.isObjectEmpty(MlsPreviewData);
    this.initialData = {
      totalCount: 0,
      currentPage: 0,
      totalPages: 0,
      previousDisabled: true,
      nextDisabled: false,
      recordsLoaded: false
    };

    this.state = {
      dropdownOpen: isNotEmpty ? MlsPreviewData.dropdownOpen : false,
      clickedColumn: isNotEmpty ? MlsPreviewData.clickedColumn : '',
      hierarchy: isNotEmpty ? MlsPreviewData.hierarchy : false,
      filterApplied: isNotEmpty ? MlsPreviewData.filterApplied : false,
      isHighlighted: false,
      metadataPreviewData: isNotEmpty ? MlsPreviewData.metadataPreviewData : [],
      metadataLookupPreviewData: isNotEmpty ? MlsPreviewData.metadataLookupPreviewData : [],
      metadataPagination: {
        offset: downloadPreviewPageOffset,
        size: downloadPreviewPageSize,
        ...this.initialData
      },
      lookupPagination: {
        offset: downloadPreviewPageOffset,
        size: downloadPreviewPageSize,
        ...this.initialData
      },
      isMetadata: isNotEmpty ? MlsPreviewData.isMetadata : false,
      mColumnUniqueData: isNotEmpty ? MlsPreviewData.mColumnUniqueData : {},
      lColumnUniqueData: isNotEmpty ? MlsPreviewData.lColumnUniqueData : {},
      mFilteredUniqueData: isNotEmpty ? MlsPreviewData.mFilteredUniqueData : {},
      lFilteredUniqueData: isNotEmpty ? MlsPreviewData.lFilteredUniqueData : {},
      mCheckboxList: isNotEmpty ? MlsPreviewData.mCheckboxList : {},
      lCheckboxList: isNotEmpty ? MlsPreviewData.lCheckboxList : {},
      mCheckedFields: isNotEmpty ? MlsPreviewData.mCheckedFields : {},
      lCheckedFields: isNotEmpty ? MlsPreviewData.lCheckedFields : {},
      selectedField: isNotEmpty ? MlsPreviewData.selectedField : '',
      mShowFiltersPanel: isNotEmpty ? MlsPreviewData.mShowFiltersPanel : false,
      lShowFiltersPanel: isNotEmpty ? MlsPreviewData.lShowFiltersPanel : false,
      mFilters: isNotEmpty ? MlsPreviewData.mFilters : {},
      lFilters: isNotEmpty ? MlsPreviewData.lFilters : {},
      isAddModalOpen: isNotEmpty ? MlsPreviewData.isAddModalOpen : false,
      contextVariableName: isNotEmpty ? MlsPreviewData.contextVariableName : '',
      disableAddNewContextButton: isNotEmpty ? MlsPreviewData.disableAddNewContextButton : true,
      copyContextDisableBtn: true,
      copyContextSelectedCell: isNotEmpty ? MlsPreviewData.copyContextSelectedCell : {},
      copyContextSelectedValue: isNotEmpty ? MlsPreviewData.copyContextSelectedValue : '',
      copyContextMetadataType: isNotEmpty ? MlsPreviewData.copyContextMetadataType : '',
      copyContextElasticSearchIndexId: isNotEmpty ? MlsPreviewData.copyContextElasticSearchIndexId : '',
      copyContextColumnId: isNotEmpty ? MlsPreviewData.copyContextColumnId : 0,
      showDropdown: false,
      mIsFilterRequestSent: false,
      lIsFilterRequestSent: false,
      showLookup: false
    };
  }

  componentDidMount() {
    const { source, MlsConfigureAction, MlsPreviewData } = this.props;

    if(!this.isObjectEmpty(MlsPreviewData)) {
      this.filterResults(true); // apply filter for metadata
      setTimeout(() => this.filterResults(false), 200); // apply filter for metadata lookup
    } else {
      MlsConfigureAction.getMetaDataDownloadPreview(
        source.toLowerCase(), downloadPreviewPageOffset, downloadPreviewPageSize
      );
      MlsConfigureAction.getMetaDataLookupDownloadPreview(
        source.toLowerCase(), downloadPreviewPageOffset, downloadPreviewPageSize
      );
    }
    document.addEventListener('keydown', this.handleEscKey, false);
    document.addEventListener('click', this.handleClick, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.MlsMetadataDownloadPreview.isResponseSuccess !== this.props.MlsMetadataDownloadPreview.isResponseSuccess
      && this.props.MlsMetadataDownloadPreview.isResponseSuccess) {
        const { MlsMetadataDownloadPreviewData, showPreview } = this.props;
        const { metadataPagination, filterApplied, mIsFilterRequestSent, lIsFilterRequestSent } = this.state;
        this.setState({
          metadataPreviewData: MlsMetadataDownloadPreviewData,
          metadataPagination: { ...metadataPagination, totalCount: MlsMetadataDownloadPreviewData[0].totalCount }
        }, () => {
          if(showPreview && filterApplied && mIsFilterRequestSent) {
            this.getFilteredData(MlsMetadataDownloadPreviewData, true);
            this.setState({ lIsFilterRequestSent: false });
          }
        });
    }
    if(prevProps.MlsMetadataLookupDownloadPreview.isResponseSuccess !== this.props.MlsMetadataLookupDownloadPreview.isResponseSuccess
      && this.props.MlsMetadataLookupDownloadPreview.isResponseSuccess) {
        const { MlsMetadataLookupDownloadPreviewData, showPreview } = this.props;
        const { lookupPagination, filterApplied, lIsFilterRequestSent } = this.state;
        this.setState({
          metadataLookupPreviewData: MlsMetadataLookupDownloadPreviewData,
          lookupPagination: { ...lookupPagination, totalCount: MlsMetadataLookupDownloadPreviewData[0].totalCount },
        }, () => {
          if(showPreview && filterApplied) {
            const showLookup = MlsMetadataLookupDownloadPreviewData.length > 1 ? false : true;
            
            if(lIsFilterRequestSent) {
              this.getFilteredData(MlsMetadataLookupDownloadPreviewData, false);
              this.setState({ mIsFilterRequestSent: false });
            }
            this.setState({ showLookup }, () => this.toggleLookupData());
          }
        });
    }
    if(prevProps.MlsPreviewColumnUniqueData.isResponseSuccess !== this.props.MlsPreviewColumnUniqueData.isResponseSuccess
      && this.props.MlsPreviewColumnUniqueData.isResponseSuccess) {
      const payload = this.props.MlsPreviewColumnUniquePayload;
      if(payload.length > 0) {
        const { mCheckboxList, lCheckboxList, selectedField, mCheckedFields, lCheckedFields, isMetadata,
                mColumnUniqueData, lColumnUniqueData, mFilteredUniqueData, lFilteredUniqueData
              } = this.state;

          let isChecked = new Array(payload.length).fill(false);
          const checkboxList = isMetadata ? mCheckboxList : lCheckboxList;
          const checkedFields = isMetadata ? mCheckedFields : lCheckedFields;
          const columnUniqueData = isMetadata ? mColumnUniqueData : lColumnUniqueData;
          const filteredData = isMetadata ? mFilteredUniqueData : lFilteredUniqueData;
          const list = { ...checkboxList, [selectedField]: isChecked };
          const checked = { ...checkedFields, [selectedField]: []};
          const filteredValues = { ...filteredData, [selectedField]: payload};
          const allColumns = { ...columnUniqueData, [selectedField]: payload};

          this.setState(() => ({
            [isMetadata ? 'mColumnUniqueData' : 'lColumnUniqueData']: allColumns,
            [isMetadata ? 'mCheckboxList' : 'lCheckboxList']: list,
            [isMetadata ? 'mCheckedFields' : 'lCheckedFields']: checked,
            [isMetadata ? 'mFilteredUniqueData' : 'lFilteredUniqueData']: filteredValues
          }));
      }
    }
  }

  componentWillUnmount() {
    this.props.MlsConfigureAction.postPreviewData(this.props.source,this.state);
    document.removeEventListener("keydown", this.handleEscKey);
    document.removeEventListener("click", this.handleClick);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  getFilteredData = (previewData: Array<Object>, isMetadata: boolean) => {
    const { source, MlsConfigureAction } = this.props;
    const { mCheckedFields, lCheckedFields } = this.state;
    let isLookupNameExist = false;
    const checkedFields = isMetadata ? mCheckedFields : lCheckedFields;
    isLookupNameExist = previewData.some(item => {
      const { lookupName } = item;
      return lookupName !== '' && lookupName !== 'null';
    });
    if(isLookupNameExist) {
      let columnValues = [];
      previewData.forEach(item => {
        const { lookupName } = item;
        if(lookupName !== '' && lookupName !== 'null') {
          columnValues.push(lookupName);
        }
      });

      const uniqueValues = [...new Set(columnValues.slice(1))];
      const filters = { ...checkedFields, "lookupName": uniqueValues };
      const dataToSend = this.getDataToSend(filters);

      if(isMetadata) {
        MlsConfigureAction.getMetaDataLookupDownloadPreview(
          source.toLowerCase(), downloadPreviewPageOffset, downloadPreviewPageSize, dataToSend);
      } else {
        MlsConfigureAction.getMetaDataDownloadPreview(
          source.toLowerCase(), downloadPreviewPageOffset, downloadPreviewPageSize, dataToSend);
      }
    }
  };

  onMouseMove = (event: Object) => {
    if(!this.isResizing) {
      return;
    }
    const container = document.getElementsByClassName("previewContent")[0];
    const leftContainer = document.getElementsByClassName("metadata")[0];
    const rightContainer = document.getElementsByClassName("lookup")[0];
    const offsetRight = container.offsetWidth - event.clientX;
    leftContainer.style.width = `${container.offsetWidth - offsetRight}px`;
    rightContainer.style.width = `${offsetRight}px`;
  }

  onMouseUp = () => {
    this.isResizing = false;
  }

  onDragMouseDown = () => {
    this.isResizing = true;
  }

  handleClick = (event: Object) => {
    const selectedTarget = event.target;
    const appliedClass = selectedTarget.classList;
    let showDropdown = false;

    if(appliedClass.contains('columnName') || appliedClass.contains('filtersLink')) {
      showDropdown = true;
    } else if(this.dropdown) {
      const isDescedant = this.dropdown.contains(selectedTarget);
      showDropdown = isDescedant ? true : false;
    }

    this.setState({
      showDropdown
    });
  };

  handleEscKey = (event: Object) => {
    const key = event.keyCode || event.which
    const  { showDropdown } = this.state;
    if(key === 27) {
      showDropdown ? this.setState({showDropdown: false}): this.hideShowPreview();
    }
  };

  isObjectEmpty = (object) => Object.keys(object).length === 0;

  onCellClickHandler = (event, cellValue, isMetadata, elasticSearchIndexId, columnId) => {
    if(cellValue && cellValue != 'null') {
      const { copyContextSelectedCell } = this.state;

      if(copyContextSelectedCell) {
        let previousCell = copyContextSelectedCell;
        if(Object.keys(previousCell).length > 0) {
          previousCell.classList.remove('highlighted');
        }
      }
      const newSelectedCell = event.target;
      newSelectedCell.classList.add('highlighted');

      this.setState(() => ({
        copyContextDisableBtn: false,
        copyContextSelectedCell: newSelectedCell,
        copyContextSelectedValue: cellValue,
        copyContextMetadataType: isMetadata ? 'Metadata' : 'Metadata Lookup',
        copyContextElasticSearchIndexId: elasticSearchIndexId,
        copyContextColumnId: columnId,
        showDropdown: false
      }));
    }
  };

  copyContextHandler = () => {
    this.setState(() => ({
      isAddModalOpen: true,
      contextVariableName: ''
    }));
  }

  resetCopyContextState = () => {
    this.setState(() => ({
      copyContextDisableBtn: true,
      copyContextSelectedCell: {},
      copyContextSelectedValue: '',
      copyContextMetadataType: '',
      copyContextElasticSearchIndexId: '',
      copyContextColumnId: 0
    }));
  }

  hideAddModal = () => {
    this.setState(() => ({ isAddModalOpen: false }));
  };

  handleAddNewContextName = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    newState.contextVariableName = event.target.value;
    newState.disableAddNewContextButton = newState.contextVariableName === '' ? true : false;
    this.setState({ ...newState });
  };

  addToContextVariable = (contextData: Object) => {
    const { MlsContextVariableAction, MlsConfigureData } = this.props;
    const { copyContextMetadataType } = this.state;
    const mlsType = copyContextMetadataType === 'Metadata' ? 'MD' : 'MDL';
    MlsContextVariableAction.addNewContextVariable(MlsConfigureData.id, contextData, MlsConfigureData.source, mlsType);
  };

  onAddNewContextVariable = () => {
    const {
      contextVariableName,
      copyContextSelectedValue,
      isAddModalOpen,
      copyContextElasticSearchIndexId,
      copyContextColumnId
    } = this.state;

    this.addToContextVariable({
      key: contextVariableName,
      value: copyContextSelectedValue,
      elasticSearchIndexId: copyContextElasticSearchIndexId,
      hierarchyInfoId: copyContextColumnId
    });
    this.setState({ isAddModalOpen: !isAddModalOpen });
  }

  updateSelectedField = (selectedField: string) => {
    this.setState(() => ({ selectedField }));
  };

  doFiltering = (isMetadata: boolean) => {
    this.applyFilter(isMetadata);
    this.setState(() => ({ isHighlighted: false }));
  };

  updateCheckboxState = (isMetadata: boolean, index: number, property: string, changedValue: string, applyFilter: boolean) => {
    const { mCheckboxList, lCheckboxList, mCheckedFields, lCheckedFields } = this.state;
    let checkboxLabel = isMetadata ? 'mCheckboxList' : 'lCheckboxList';
    let checkboxList = isMetadata ? mCheckboxList : lCheckboxList;
    let checkboxFieldsLabel = isMetadata ? 'mCheckedFields' : 'lCheckedFields';
    let checkboxFields = isMetadata ? mCheckedFields : lCheckedFields;
    const changed = checkboxList[property].map((value, id) => {
      if(id === index) {
        return !value;
      }
      return value;
    });

    const list = { ...checkboxList, [property]: changed};
    if(changed[index]) {
      this.setState({
        [checkboxLabel]: list,
        [checkboxFieldsLabel]:
        { ...checkboxFields, [property]: [...checkboxFields[property], changedValue] }
      }, () => {
        if(applyFilter) {
          this.doFiltering(isMetadata);
        }
      });
    } else {
      this.setState({
        [checkboxLabel]: list,
        [checkboxFieldsLabel]:
        { ...checkboxFields, [property]: checkboxFields[property].filter((item) => item !== changedValue) }
      }, () => {
        if(applyFilter) {
          this.doFiltering(isMetadata);
        }
      });
    }
  };

  calculatePaginationDetails = (size: number, totalCount: number, currentPage: number) => {
    const newOffset = currentPage * size;
    const totalPages = Math.ceil(totalCount / size);
    return { newOffset, currentPage, totalPages };
  };

  getDataToSend = (checkedFields: Object) => {
    let data = {};
    Object.keys(checkedFields).forEach(field => {
      if(checkedFields[field].length > 0) {
        data[field] = checkedFields[field];
      }
    });
    return data;
  };

  loadPageData = (hierarchy: string, nextOrPrevious: string) => {
    const { metadataPagination, lookupPagination, mCheckedFields, lCheckedFields } = this.state;
    const { source, MlsConfigureAction } = this.props;

    const { offset: mOffset, size: mPageSize, totalCount: mTotalCount, currentPage: mCurrentPage } = metadataPagination;
    const { offset: lOffset, size: lPageSize, totalCount: lTotalCount, currentPage: lCurrentPage } = lookupPagination;
    let checkedFields, currentPage, totalCount, offset, pageSize, paginationData, paginationLabel, isMetadata;
    if(hierarchy === 'metadata') {
      checkedFields = mCheckedFields;
      currentPage = mCurrentPage;
      totalCount = mTotalCount;
      pageSize = mPageSize;
      offset = mOffset;
      paginationLabel = 'metadataPagination';
      paginationData = metadataPagination;
      isMetadata = true;
    } else {
      checkedFields = lCheckedFields;
      currentPage = lCurrentPage;
      totalCount = lTotalCount;
      pageSize = lPageSize;
      offset = lOffset;
      paginationLabel = 'lookupPagination';
      paginationData = lookupPagination;
      isMetadata = false;
    }

    let previousDisabled = true, nextDisabled = false;
    const page = nextOrPrevious === 'next' ? (currentPage + 1) : (currentPage - 1);
    const result = this.calculatePaginationDetails(pageSize, totalCount, page);
    const { newOffset, currentPage: curPage, totalPages } = result;

    if(page === 0) {
      previousDisabled = true;
      nextDisabled = false;
    } else if(page === totalCount) {
      previousDisabled = false;
      nextDisabled = true;
    } else {
      previousDisabled = false;
      nextDisabled = false;
    }
      this.setState({
          [paginationLabel]: {
            ...paginationData,
            offset: newOffset,
            currentPage: curPage,
            totalPages,
            previousDisabled,
            nextDisabled,
            recordsLoaded: true
          },
          isMetadata,
          isHighlighted: false,
          copyContextDisableBtn: true
        },
      () => {
        const dataToSend = this.getDataToSend(checkedFields);
        if(hierarchy === 'metadata') {
          MlsConfigureAction.getMetaDataDownloadPreview(
            source.toLowerCase(), newOffset, mPageSize, dataToSend);
        } else {
          MlsConfigureAction.getMetaDataLookupDownloadPreview(
            source.toLowerCase(), newOffset, lPageSize, dataToSend);
        }
      });
  };

  hideShowPreview = () => {
    this.setState({ showDropdown: false });
    this.props.hideShowPreview();
  };

  getColumnUniqueData = (source: string, columnName: string, isMetadata: boolean, data: Object = {}) => {
    this.props.MlsConfigureAction.getPreviewColumnUniqueData(source, columnName, isMetadata, data);
  };

  filterResults = (isMetadata: boolean) => {
    const { source } = this.props;
    const { metadataPagination, lookupPagination, mCheckedFields, lCheckedFields } = this.state;
    const { size } = metadataPagination;
    let checkedFields, paginationData, filters;

    if(isMetadata) {
      checkedFields = mCheckedFields;
      filters = mCheckedFields;
      paginationData = { ...metadataPagination, offset: 0, ...this.initialData };
    } else {
      checkedFields = lCheckedFields;
      filters = lCheckedFields;
      paginationData = { ...lookupPagination, offset: 0, ...this.initialData }
    }
    this.setState(() => ({
      [isMetadata ? 'metadataPagination' : 'lookupPagination']: paginationData,
      [isMetadata ? 'mFilters' : 'lFilters']: filters
    }));

    const dataToSend = this.getDataToSend(checkedFields);
    if(isMetadata) {
      this.props.MlsConfigureAction.getMetaDataDownloadPreview(source.toLowerCase(), 0, size, dataToSend);
    } else {
      this.props.MlsConfigureAction.getMetaDataLookupDownloadPreview(source.toLowerCase(), 0, size, dataToSend);
    }
  };

  updateIsMetadata = (value: boolean) => {
    this.setState(() => ({ isMetadata: value }));
  };

  clearFilters = (isMetadata: boolean) => {
    let checkboxListLabel, checkedFieldsLabel;
    const { metadataPagination, lookupPagination } = this.state;
    const pagination = isMetadata ? metadataPagination : lookupPagination;

    checkboxListLabel = isMetadata ? 'mCheckboxList' : 'lCheckboxList';
    checkedFieldsLabel = isMetadata ? 'mCheckedFields' : 'lCheckedFields';

    this.setState({
      [checkboxListLabel]: {}, [checkedFieldsLabel]: {}, isHighlighted: false,
      [isMetadata ? 'metadataPagination' : 'lookupPagination'] : { ...pagination, offset: 0, ...this.initialData}
    },
      () => this.filterResults(isMetadata)
    );
  };

  shortenText = (text: string) =>
    text.length > previewMaxCharsLength ? `${text.substring(0, previewMaxCharsLength - 1)}...` : text;

  applyFilter = (isMetadata: boolean, event: Object = { stopPropagation: () => {} }) => {
    if(event) {
      event.stopPropagation();
    }
    this.setState({
      filterApplied: true,
      showDropdown: false,
      [isMetadata ? 'mIsFilterRequestSent' : 'lIsFilterRequestSent'] : true,
      [isMetadata ? 'lIsFilterRequestSent' : 'mIsFilterRequestSent'] : false
    });
    this.filterResults(isMetadata);
  };

  onChangeCheckboxState = (isMetadata: boolean, id: number, changedValue: string ) => {
    this.updateCheckboxState(isMetadata, id, this.state.selectedField, changedValue, false);
  };

  toggleFiltersPopup = () => {
    const { filterApplied } = this.state;
    if(filterApplied === true) {
      this.setState(() => ({ filterApplied: false }));
    }
  };

  onFilterValues = (event: Object) => {
    const { isMetadata, selectedField, mColumnUniqueData, lColumnUniqueData,
            mFilteredUniqueData, lFilteredUniqueData
          } = this.state;
    const searchText = event.target.value.trim();
    const dataLabel = isMetadata ? 'mColumnUniqueData' : 'lColumnUniqueData';
    const columnValues = isMetadata ? mColumnUniqueData : lColumnUniqueData;
    const uniqueData = isMetadata ? mFilteredUniqueData : lFilteredUniqueData;
    const result = uniqueData[selectedField].filter(value => value.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
    const data = searchText !== '' ? result : uniqueData[selectedField];

    this.setState(() => ({
      [dataLabel]: { ...columnValues, [selectedField]: data }
    }));
  };

  onResetFilters = () => {
    const { source } = this.props;
    const { selectedField, isMetadata } = this.state;
    this.getColumnUniqueData(source, selectedField, isMetadata);
  };

  displayFieldsDropdown = (columnUniqueData: Object, hierarchyType: string) => {
    const { selectedField, isMetadata, mCheckboxList, lCheckboxList } = this.state;
    const checkboxList = isMetadata ? mCheckboxList : lCheckboxList;
    const fields = columnUniqueData[selectedField].map((item,id) => {
      const uniqueId = `${hierarchyType}_${selectedField}_${id}`;
      if(checkboxList[selectedField]) {
        return (
          <div key={uniqueId}>
            <Input
              id={uniqueId}
              type="checkbox"
              checked={checkboxList[selectedField][id] ? true : false}
              value={item}
              onChange={() => this.onChangeCheckboxState(isMetadata, id, item)}
            />
            <Label for={uniqueId}>{ item }</Label>
          </div>
        );
      }
    });

    return (
      <div>
        <Input type="search" name="search" placeholder="Search" className="filterSearch" onChange={this.onFilterValues} />
        <div>
          <Button color="link" className="clearSearch" onClick={this.onResetFilters}>Reset filters</Button>
        </div>
        {fields}
      </div>
    );
  };

  preventPropagation = (event) => {
    event.stopPropagation();
  };

  displayHeader = (isMetadata: boolean, value: string, index: string, text: string) => {
    const { mColumnUniqueData, lColumnUniqueData, mCheckboxList, lCheckboxList, selectedField, showDropdown,
            clickedColumn, hierarchy, filterApplied, isHighlighted, metadataPreviewData, metadataLookupPreviewData,
            mCheckedFields, lCheckedFields
          } = this.state;
    const selectedHeading = clickedColumn === value && hierarchy === isMetadata;
    const checkboxList = isMetadata ? mCheckboxList : lCheckboxList;
    const hasColumns = Object.keys(checkboxList).length > 0;
    const hasData =  hasColumns && checkboxList[selectedField];
    const columnUniqueData = isMetadata ? mColumnUniqueData : lColumnUniqueData;
    const hierarchyType = isMetadata ? 'metadata' : 'lookup';
    const dataLength = isMetadata ? metadataPreviewData.length : metadataLookupPreviewData.length;
    const checkedFields = isMetadata ? mCheckedFields : lCheckedFields;

    return (
      <td
        key={index}
        className="columnName"
        data-selectedfield={value}
        onClick={(event) => {
          if(dataLength > 1 || filterApplied) {
            const dataToSend = this.getDataToSend(checkedFields);
            const highlightedSelector = document.querySelector('.records.highlighted');

            if(highlightedSelector){
              highlightedSelector.classList.remove('highlighted');
            }
            const hasFilters = this.hasFiltersForColumn(value, isMetadata);
            if(!hasFilters) {
              this.getColumnUniqueData(this.props.source, value, isMetadata, dataToSend);
            }
            this.toggleFiltersPopup();
            this.setState(() => ({
              clickedColumn: value,
              hierarchy: isMetadata,
              isHighlighted: true,
              isMetadata,
              showDropdown: true,
              copyContextDisableBtn: true
            }));
          }
          this.setState(() => ({ selectedField: value }));
        }}>
        <span className="heading columnName">{text} <i className="fa fa-caret-down columnName"></i></span>
        {
         showDropdown && selectedHeading && hasData && (
            <div
              className={`previewFilters form-control ${filterApplied === true ? 'hide' : ''}`}
              ref={(ref) => this.dropdown = ref}
              onClick={this.preventPropagation}>
              <div className="content">
                { this.displayFieldsDropdown(columnUniqueData, hierarchyType) }
              </div>
              <Button
                color="secondary"
                className="applyFilter"
                size="sm"
                onClick={(event) => this.applyFilter(isMetadata, event)}>Apply Filter
              </Button>
            </div>
          )
        }
      </td>
    );
  };

  displayCellText = (id: number, row: Object, columns: Array<string>, isMetadata: boolean, shortenText: boolean) => {
    return (
      <tr key={id}>
        {columns.map((value, index) => {
          const elasticSearchIndexId = row.id;
          const text = row[value];
          const uniqueId = `meta_${elasticSearchIndexId}_${id}_${index}`;
          if(index !== 0 && value !== 'totalCount') {
            if(shortenText) {
              return (
                <td
                  title={text}
                  key={uniqueId}
                  className="records"
                  onClick={(event) => this.onCellClickHandler(event, text, isMetadata, elasticSearchIndexId, index)}>
                  {this.shortenText(text)}
                </td>
              );
            } else {
              return this.displayHeader(isMetadata, value, uniqueId, text);
            }
          }
        })}
      </tr>
    );
  };

  getNoRecordsMessage = (hasRecords: boolean, isMatchingLookupName: boolean) => {
    let errorMsg = '';
    if(isMatchingLookupName) {
      errorMsg = 'No matching records found for selected lookupName';
    } else if(hasRecords) {
      errorMsg = 'No records available to display';
    }
    return <p className="noRecords">{errorMsg}</p>;
  };

  toggleFiltersPanel = (isMetadata: boolean) => {
    const showFiltersLabel = isMetadata ? 'mShowFiltersPanel' : 'lShowFiltersPanel';
    this.setState((prevState) => ({
      isMetadata,
      [showFiltersLabel]: !prevState[showFiltersLabel]
    }));
  };

  removeFilter = (isMetadata: boolean, columnName: string, filter: string) => {
    const { mColumnUniqueData, lColumnUniqueData, mCheckedFields, lCheckedFields } = this.state;
    const columns = isMetadata ? mColumnUniqueData : lColumnUniqueData;
    let filterIndex = -1;
    columns[columnName].some((fields, index) => {
      if(fields == filter) {
        filterIndex = index;
        return true;
      }
      return false;
    });

    this.updateCheckboxState(isMetadata, filterIndex, columnName, filter, true);
  };

  getAppliedFilters = (isMetadata: boolean) => {
    const { mFilters, lFilters, metadataPreviewData, metadataLookupPreviewData } = this.state;
    const filters = isMetadata ? mFilters : lFilters;
    const keyLabel = isMetadata ? 'md' : 'ml';
    const previewData = isMetadata ? metadataPreviewData : metadataLookupPreviewData;
    return Object.keys(filters).map((columnName, index) => {
      const filter = filters[columnName];
      const result = filter.map((name, index) => (
        <div
          className="filter"
          key={`${keyLabel}_${name}_${index}`}
          onClick={() => this.removeFilter(isMetadata, columnName, name)}>
           <a>{name} <i className="fa fa-times filterRemoveIcon"></i></a>
        </div>
      ));
      return !_.isEmpty(result) && (
        <div className="columnName" key={`${keyLabel}_${columnName}`}>
          <span>{previewData[0][columnName]}:</span> { result }
        </div>
      );
    });
  };

  hasFilters = (filters: Object) => {
    const keys = Object.keys(filters);
    return keys.length > 0 && keys.some(field => filters[field].length > 0);
  };

  hasFiltersForColumn = (selectedField: string, isMetadata: boolean) => {
    const { mCheckedFields, lCheckedFields } = this.state;
    const checkedFields = isMetadata ? mCheckedFields : lCheckedFields;
    const filters = checkedFields[selectedField];
    return filters && filters.length > 0;
  };

  hasFiltersApplied = () => {
    const { mFilters, lFilters } = this.state;
    let mHasFilters, lHasFilters;

    mHasFilters = this.hasFilters(mFilters);
    lHasFilters = this.hasFilters(lFilters);
    return { mHasFilters, lHasFilters }
  };

  clearFiltersJSX = (isMetadata: boolean) => {
    const { mShowFiltersPanel, lShowFiltersPanel, mIsFilterRequestSent, lIsFilterRequestSent } = this.state;
    const showFilters = isMetadata ? mShowFiltersPanel : lShowFiltersPanel;
    const hasFilters = this.hasFiltersApplied();
    const { mHasFilters, lHasFilters } = hasFilters;
    let disabled = false;
    if(isMetadata && lIsFilterRequestSent) {
      disabled = false;
    } else if(!isMetadata && mIsFilterRequestSent) {
      disabled = false;
    } else {
      disabled = isMetadata ? !mHasFilters : !lHasFilters;
    }

    return (
      <div>
        <div className="clearFilters">
          <Button
            onClick={() => this.clearFilters(isMetadata)}
            color="secondary"
            size="sm"
            disabled={disabled}
          >
            Clear Filters
          </Button>
        </div>
          <div className="appliedFilters">
            <a
              disabled={(isMetadata && !mHasFilters) || (!isMetadata && !lHasFilters) }
              href="javascript:void(0);"
              className="filtersLink"
              onClick={() => this.toggleFiltersPanel(isMetadata)}>
                { `${showFilters ? 'Hide' : 'Show'} Filters Applied` }
            </a>
            <div className="filters">
            {
              showFilters && this.getAppliedFilters(isMetadata)
            }
            </div>
          </div>
      </div>
    );
  };

  getInitialNavigationState = (isMetadata: boolean) => {
    const { metadataPagination: mPagintion, lookupPagination: lPagination } = this.state;
    const { totalPages: mTotalPages, currentPage: mCurrentPage, size: mPageSize, totalCount: mTotalCount } = mPagintion;
    const { totalPages: lTotalPages, currentPage: lCurrentPage, size: lPageSize, totalCount: lTotalCount } = lPagination;
    let prevNextDisabled = {}, isFirstAndLastPage, isLastPage;
    if(isMetadata) {
      isFirstAndLastPage = mCurrentPage === 0 && mTotalCount <= mPageSize;
      isLastPage = mCurrentPage === mTotalPages - 1;
    } else {
      isFirstAndLastPage = lCurrentPage === 0 && lTotalCount <= lPageSize;
      isLastPage = lCurrentPage === lTotalPages - 1;
    }
    if(isFirstAndLastPage) {
      prevNextDisabled = {
        [isMetadata ? 'mPreviousDisabled' : 'lPreviousDisabled'] : true,
        [isMetadata ? 'mNextDisabled' : 'lNextDisabled'] : true
      };
    } else if(isLastPage) {
      prevNextDisabled = {
        [isMetadata ? 'mPreviousDisabled' : 'lPreviousDisabled'] : false,
        [isMetadata ? 'mNextDisabled' : 'lNextDisabled'] : true
      };
    }
    return prevNextDisabled;
  };

  toggleLookupData = () => {
    const { showLookup } = this.state;
    const lookup = document.querySelector('.lookup');
    if(lookup) {
      lookup.classList.remove('hideLookup');
      lookup.style.display = showLookup ? 'none' : 'block';
      this.setState((prevState) => ({
        showLookup: !prevState.showLookup
      }));
    }
  };

  render() {
    const { metadataPreviewData, metadataLookupPreviewData, contextVariableName, copyContextSelectedValue,
            disableAddNewContextButton, copyContextMetadataType, isAddModalOpen, copyContextDisableBtn, showLookup,
            metadataPagination: mPagintion, lookupPagination: lPagination, mIsFilterRequestSent, lIsFilterRequestSent
          } = this.state;
    const { previousDisabled: mPreviousDisabled, nextDisabled: mNextDisabled } = mPagintion;
    const { previousDisabled: lPreviousDisabled, nextDisabled: lNextDisabled } = lPagination;
    const { source, showPreview } = this.props;
    let metadataPagination, lookupPagination;
    const previewDataLength = metadataPreviewData.length;
    const lookupDataLength = metadataLookupPreviewData.length;
    
    if(showPreview && (previewDataLength > 0 || lookupDataLength > 0)) {
      
      const paginationProps = {
        loadPageData: this.loadPageData,
        mPreviousDisabled: mPreviousDisabled,
        mNextDisabled: mNextDisabled,
        lPreviousDisabled: lPreviousDisabled,
        lNextDisabled: lNextDisabled
      };

      if(previewDataLength > 1) {
        const prevNextDisabled = this.getInitialNavigationState(true);
        metadataPagination = (
          <Pagination
            { ...paginationProps }
            { ...prevNextDisabled }
            isMetadata={true}
          />
        );
      }

      if(lookupDataLength > 1) {
        const prevNextDisabled = this.getInitialNavigationState(false);
        lookupPagination = (
          <Pagination
           { ...paginationProps }
           { ...prevNextDisabled }
           isMetadata={false}
          />
        );
      }

      return (
        <div>
          <Modal isOpen={showPreview} toggle={this.hideShowPreview} className="customModal previewModal" fade={false} keyboard={false}>
            <ModalHeader toggle={this.hideShowPreview}>
              Preview data of {source}
              <span className="toggleLookupButton">
                <Button className="zapButton" onClick={this.toggleLookupData}> 
                  { showLookup ? 'Hide' : 'Show' } Metadata Lookup
                </Button>
              </span>
            </ModalHeader>
            <ModalBody className="d-flex previewContent">
              <div className="previewDialog metadata" style={{width: showLookup ? '50%' : '100%'}}>
                <div className="tableHeading">MLS Metadata File</div>
                {metadataPagination}
                {this.clearFiltersJSX(true)}
                <Table>
                  <tbody>
                    {
                      metadataPreviewData && metadataPreviewData.map((row, id) => {
                        const columns = Object.keys(row);
                          if(id === 0) {
                            return this.displayCellText(id, row,  columns, true, false);
                          } else {
                            return this.displayCellText(id, row, columns, true, true);
                          }
                      })
                    }
                  </tbody>
                </Table>
                { this.getNoRecordsMessage(previewDataLength === 1, lIsFilterRequestSent && previewDataLength === 1)}
                {metadataPagination}
              </div>
              <div
                className="dragBar"
                onMouseDown={this.onDragMouseDown}>
              </div>
              <div className="previewDialog lookup hideLookup" style={{width: "50%"}}>
                <div className="tableHeading">MLS Metadata Lookup File</div>
                {lookupPagination}
                {this.clearFiltersJSX(false)}
                <Table>
                  <tbody>
                    {
                      metadataLookupPreviewData && metadataLookupPreviewData.map((row, id) => {
                        const columns = Object.keys(row);
                        if(id === 0) {
                          return this.displayCellText(id, row, columns, false, false);
                        } else {
                          return this.displayCellText(id, row, columns, false, true);
                        }
                      })
                    }
                  </tbody>
                </Table>
                { this.getNoRecordsMessage(lookupDataLength === 1, mIsFilterRequestSent && lookupDataLength === 1)}
                {lookupPagination}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" disabled={copyContextDisableBtn} onClick={this.copyContextHandler}>
                Copy To Context Data
              </Button>
              <Button color="primary" onClick={this.hideShowPreview}>Close</Button>
            </ModalFooter>
          </Modal>

          <AddContextVarModal
            isAddModalOpen={isAddModalOpen}
            hideAddModal={this.hideAddModal}
            copyContextMetadataType={copyContextMetadataType}
            handleAddNewContextName={this.handleAddNewContextName}
            contextVariableName={contextVariableName}
            copyContextSelectedValue={copyContextSelectedValue}
            disableAddNewContextButton={disableAddNewContextButton}
            onAddNewContextVariable={this.onAddNewContextVariable} />
    </div>
      );
    } else {
      return (<div></div>);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPreview);
