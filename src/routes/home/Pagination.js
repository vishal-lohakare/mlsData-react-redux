// @flow

import React from 'react';

const Pagination = (props: Object) => {
  const { isMetadata, loadPageData, mPreviousDisabled, mNextDisabled, lPreviousDisabled, lNextDisabled } = props;
  return (
    <div>
      <div className="pagination">
        <div className="prevPage">
          <a
            href="javascript:void(0);"
            onClick={() => loadPageData(isMetadata ? 'metadata' : 'lookup', 'previous')}
            disabled={isMetadata ? mPreviousDisabled : lPreviousDisabled}>Previous
          </a>
        </div>
        <div className="nextPage">
          <a
          href="javascript:void(0);"
          onClick={() => loadPageData(isMetadata ? 'metadata' : 'lookup', 'next')}
          disabled={isMetadata ? mNextDisabled : lNextDisabled}>Next
        </a>
        </div>
      </div>
    </div>
  );
};

export default Pagination;