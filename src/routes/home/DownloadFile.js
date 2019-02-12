// @flow

import React, { Component } from 'react'
import {
  Row,
  Table
} from 'reactstrap';
import download from 'downloadjs';
import _ from 'lodash';

import './HomeScreen.scss';
import { API } from 'utils/API';
import { showLoader, hideLoader } from 'utils/loader';
import DownloadPreview from './DownloadPreview';

type Props = {
  source: string,
  fileList: Array<string>,
  showError: boolean
};

type State = {
  showPreview: boolean
};

export default  class DownloadFile extends Component<Props, State> {

  state = {
    showPreview: false
  };

  downloadFile = (index: number) => {
    const fileName = _.toLower(this.props.fileList[index]);
    const type = fileName.indexOf('metadata_lookups') > -1 ? 'metadata_lookup' : 'metadata';
    showLoader();
    new API().getFile(`${this.props.source}`, type)
      .then(response => {
        const isDownloaded = download(response, fileName, 'text/plain');
        if (isDownloaded) {
          hideLoader();
        }
      });
  };

  onShowPreview = () => {
    this.setState(() => ({ showPreview: true }));
  };

  hideShowPreview = () => {
    this.setState(() => ({ showPreview: false }));
  }

  render() {
    const { fileList, source, showError } = this.props;
    const { showPreview } = this.state;

    return (
      <div className="pt-1">
        {
          _.size(fileList) > 0 &&
          (
            <Row className="download-result">
              <Table className="border">
                <thead>
                  <tr>
                    <th>Downloaded Files</th>
                    <th>Download</th>
                    <th>Preview File</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    _.map( this.props.fileList, (item, index)=> {
                      return <tr key={index}>
                        <td>{item}</td>
                          <td className="text-center">
                            <a
                              href="javascript:void(0);"
                              title="Download"
                              className="zapIcon mainColor"
                              onClick={() => this.downloadFile(index)}>
                              <i className="fa fa-download"></i>
                            </a>
                          </td>
                          { index === 0 &&
                            <td rowSpan="2" className="previewLink text-center">
                              <a
                                title="Preview"
                                href="javascript:void(0);"
                                className="zapIcon mainColor"
                                onClick={this.onShowPreview}>
                                <i className="fa fa-eye"></i>
                                </a>
                            </td>
                          }
                        </tr>
                    })
                  }
                </tbody>
              </Table>
            </Row>
          )
        }
        {
          showError && _.size(fileList) === 0
          && <div className="no-result">No files available to download</div>
        }
        {
          showPreview && (
            <DownloadPreview
              source={source}
              showPreview={showPreview}
              onShowPreview={this.onShowPreview}
              hideShowPreview={this.hideShowPreview}
            />
          )
        }
      </div>
    )
  }
}
