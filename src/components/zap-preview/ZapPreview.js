// @flow

import React, { Component } from 'react';
import './ZapPreview.scss';
import _ from 'lodash';

import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody
} from 'reactstrap'

type Props = {
  previewTableHeader: Object,
  previewTableData: Object,
  modalClose: Function,
  expression: string
};

type State = {};

export default class ZapPreview extends Component<Props, State> {

  renderContentList = (previewTableHeader: Object, previewTableData: Object) => {
    let contentList = [];
    _.map(previewTableData, (item, index) => {
      contentList.push (
        <tr key={index}>
          <th key={index} scope="row">{index+1}</th>
          {
            _.map(previewTableHeader, (column, key) => {
              return <td key={key}>{item[column]}</td>
            })
          }
        </tr>
      )
    });
    if(_.isEmpty(contentList)) {
      return "No data available for the current mapping"
    } else {
      return contentList;
    }
  }

  render() {
   const { previewTableHeader, previewTableData, modalClose, expression } = this.props;

    return (
      <Modal isOpen={true} toggle={modalClose} className="customModal preview">
      <ModalHeader toggle={modalClose}>Transformation Preview : {expression}</ModalHeader>
      <ModalBody>
        <Table >
          <thead>
            <tr>
              <th>Index</th>
              {_.map(previewTableHeader, (value, key) => { return <th key={key}>{value}</th> })}
            </tr>
          </thead>
          <tbody>
            {
              this.renderContentList(previewTableHeader, previewTableData)
             }
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={modalClose}>Close</Button>
      </ModalFooter>
    </Modal>
    )
  }
}
