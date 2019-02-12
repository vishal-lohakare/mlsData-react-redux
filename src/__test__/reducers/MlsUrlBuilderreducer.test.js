import MLSUrlBuilderReducer from 'reducers/MlsUrlBuilderReducer';
import {
  ADD_NEW_URL_DATA,
  DELETE_NEW_URL_DATA,
  GET_MLS_URL_REQUEST,
  GET_MLS_URL_SUCCESS,
  GET_MLS_URL_FAILURE,
  UPDATE_MLS_URL_REQUEST,
  UPDATE_MLS_URL_SUCCESS,
  UPDATE_MLS_URL_FAILURE,
  SAVE_MLS_URL_REQUEST,
  SAVE_MLS_URL_SUCCESS,
  SAVE_MLS_URL_FAILURE,
  DELETE_URL_HEADER_REQUEST,
  DELETE_URL_HEADER_SUCCESS,
  DELETE_URL_HEADER_FAILURE,
  DELETE_MLS_URL_REQUEST,
  DELETE_MLS_URL_SUCCESS,
  DELETE_MLS_URL_FAILURE,
  GET_MLS_PREVIEW_RAW_DATA_REQUEST,
  GET_MLS_PREVIEW_RAW_DATA_SUCCESS,
  GET_MLS_PREVIEW_RAW_DATA_FAILURE,
  GET_MLS_PREVIEW_PHOTO_DATA_REQUEST,
  GET_MLS_PREVIEW_PHOTO_DATA_SUCCESS,
  GET_MLS_PREVIEW_PHOTO_DATA_FAILURE,
  GET_MLS_URL_PLACEHOLDER_VALUES_REQUEST,
  GET_MLS_URL_PLACEHOLDER_VALUES_SUCCESS,
  GET_MLS_URL_PLACEHOLDER_VALUES_FAILURE
} from 'constants/action';


const initialState = {
    UrlData: [],
    UrlSavedData: {
      isLoading: false,
    },
    GetUrlData: {
      isLoading: false,
    },
    PreviewRawData: {
      isLoading: false,
      payload: {
        Columns: '',
        Data: []
      }
    },
    MlsPlaceHolderValues: {
      isLoading: false
    }
}
const initialStateForUpdate = {
    ...initialState,
    UrlData: [
      {
        isUpdated: false,
        UrlDetails: {
          id: 1,
          urlname: 'test',
          urlvalue: 'testurl',
          sourceId: 11,
          bodyTextValue: '',
          downloadType: "list",
          bodyType: '',
          isActive: true,
        },
        HeaderDetails: [
          {
            headerId: 1,
            headerKey: 'h1',
            headerValue: 'h1',
            isSelected: true,
            urlId: 1,
          }
        ]
      }
    ],
    UrlSavedData: {
      isLoading: false,
      isResponseSuccess: false,
      isFail: false,
    }
}
describe('MlsUrlBuilder reducer', () => {

  beforeEach(() => {
    document.body.innerHTML = '<div id="loading" className="hide">' +
    '<div><img src={require("images/loader.gif")} /></div>' +
    '</div>';
  });


  it('reducer should return initialState', () => {
    expect(MLSUrlBuilderReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return blank new url data object', () => {
    const expectedData = {
        ...initialState,
        UrlData: [
          {
            isUpdated: false,
            isNewUrl: true,
            UrlDetails: {
              urlname: '',
              urlvalue: '',
              bodyTextValue: '',
              bodyType: '',
            },
            HeaderDetails: []
          }
        ]
    }
    expect(MLSUrlBuilderReducer(initialState, {
      type: ADD_NEW_URL_DATA,
    })).toEqual(expectedData);
  })

  it('reducer should return request data for get call', () => {
    const expectedData = {
        ...initialState,
        GetUrlData: {
          isLoading: true,
          isResponseSuccess: false,
          isFail: false,
        },
    }
    expect(MLSUrlBuilderReducer(initialState, {
      type: GET_MLS_URL_REQUEST,
    })).toEqual(expectedData);
  })

  it('reducer should return successfully url data for particular mls', () => {

    const payloadValue = [{
      id: 1,
      name: 'test',
      url: 'testurl',
      mlsInfoId: 11,
      body: "",
      bodyType: "",
      downloadType: "list",
      isActive: true,
      mlsUrlHeaderDto: [
        {
          headerId: 1,
          headerKey: 'h1',
          headerValue: 'h1',
          isSelected: true,
          urlId: 1
        }
      ]

    }]
    const expectedData = {
        ...initialState,
        UrlData: [
          {
            isUpdated: false,
            UrlDetails: {
              id: 1,
              urlname: 'test',
              urlvalue: 'testurl',
              sourceId: 11,
              bodyTextValue: '',
              bodyType: '',
              downloadType: "list",
              isActive: true,
            },
            HeaderDetails: [
              {
                headerId: 1,
                headerKey: 'h1',
                headerValue: 'h1',
                isSelected: true,
                urlId: 1,
              }
            ]
          }
        ],
        GetUrlData: {
          isLoading: false,
          error: {},
          isResponseComplete: true,
          isResponseSuccess: true,
          isFail: false,
          payload: payloadValue,
          status: 200
        },
    }
    expect(MLSUrlBuilderReducer(initialState, {
      type: GET_MLS_URL_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return failure data for mls get', () => {
    const expectedData = {
        ...initialState,
        GetUrlData: {
          isFail: true,
          isResponseSuccess: false,
          isResponseComplete: true,
          isLoading: false,
          error: {
            errorMessage: "Not found"
          },
          status: 404
        },
    }
    expect(MLSUrlBuilderReducer(initialState, {
      type: GET_MLS_URL_FAILURE,
      data: {
        error: {
          errorMessage: "Not found"
        },
        status: 404,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return request data for save new url', () => {
    const expectedData = {
      ...initialState,
        UrlSavedData: {
          isLoading: true,
          isResponseSuccess: false,
          isFail: false,
        },
    }
    expect(MLSUrlBuilderReducer(initialState, {
      type: SAVE_MLS_URL_REQUEST,
    })).toEqual(expectedData);
  })

  it('reducer should return successfully saved new url data', () => {

    const payloadValue = {
      id: 1,
      name: 'test',
      url: 'testurl',
      mlsInfoId: 11,
      body: "",
      bodyType: "",
      downloadType: 'list',
      isActive: true,
      mlsUrlHeaderDto: [
        {
          headerId: 1,
          headerKey: 'h1',
          headerValue: 'h1',
          isSelected: true,
          urlId: 1
        }
      ]

    }
    const expectedData = {
        ...initialState,
        UrlData: [
          {
            isUpdated: false,
            newEntry: true,
            updatedEntry: false,
            UrlDetails: {
              id: 1,
              urlname: 'test',
              urlvalue: 'testurl',
              sourceId: 11,
              bodyTextValue: '',
              downloadType: 'list',
              bodyType: '',
              isActive: true,
            },
            HeaderDetails: [
              {
                headerId: 1,
                headerKey: 'h1',
                headerValue: 'h1',
                isSelected: true,
                urlId: 1,
              }
            ]
          }
        ],
        UrlSavedData: {
          isLoading: false,
          error: {},
          isResponseComplete: true,
          isResponseSuccess: true,
          isFail: false,
          payload: payloadValue,
          status: 200
        },
    }
    expect(MLSUrlBuilderReducer({
        ...initialState,
        UrlData: [
          {
            isUpdated: false,
            isNewUrl: true,
            UrlDetails: {
              urlname: '',
              urlvalue: '',
              bodyTextValue: '',
              bodyType: '',
            },
            HeaderDetails: []
          }
        ],
        UrlSavedData: {
          isLoading: false,
        },
        GetUrlData: {
          isLoading: false,
        },
    }, {
      type: SAVE_MLS_URL_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return failure data for mls save request', () => {

    const expectedData = {
        ...initialState,
        UrlSavedData: {
          isFail: true,
          isResponseSuccess: false,
          isResponseComplete: true,
          isLoading: false,
          error: {
            errorMessage: "Not added"
          },
          status: 405
        },
    }
    expect(MLSUrlBuilderReducer(initialState, {
      type: SAVE_MLS_URL_FAILURE,
      data: {
        error: {
          errorMessage: "Not added"
        },
        status: 405,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return request data for update url', () => {
    const expectedData = {
        ...initialState,
        UrlData: [
          {
            isUpdated: false,
            UrlDetails: {
              id: 1,
              urlname: 'test',
              urlvalue: 'testurl',
              sourceId: 11,
              bodyTextValue: '',
              downloadType: 'list',
              bodyType: '',
              isActive: true,
            },
            HeaderDetails: [
              {
                headerId: 1,
                headerKey: 'h1',
                headerValue: 'h1',
                isSelected: true,
                urlId: 1,
              }
            ]
          }
        ],
        UrlSavedData: {
          isLoading: true,
          isResponseSuccess: false,
          isFail: false,
        }
    }
    expect(MLSUrlBuilderReducer(initialStateForUpdate, {
      type: UPDATE_MLS_URL_REQUEST,
    })).toEqual(expectedData);
  })

  it('reducer should return successfully update data', () => {

    const payloadValue = {
      id: 1,
      name: 'demo',
      url: 'demourl',
      mlsInfoId: 11,
      downloadType: 'list',
      body: "",
      bodyType: "",
      isActive: true,
      mlsUrlHeaderDto: [
        {
          headerId: 1,
          headerKey: 'h1',
          headerValue: 'h1',
          isSelected: true,
          urlId: 1
        }
      ]

    }
    const expectedData = {
        ...initialState,
        UrlData: [
          {
            isUpdated: false,
            updatedEntry: true,
            newEntry: false,
            UrlDetails: {
              id: 1,
              urlname: 'demo',
              urlvalue: 'demourl',
              downloadType: 'list',
              sourceId: 11,
              bodyTextValue: '',
              bodyType: '',
              isActive: true,
            },
            HeaderDetails: [
              {
                headerId: 1,
                headerKey: 'h1',
                headerValue: 'h1',
                isSelected: true,
                urlId: 1,
              }
            ]
          }
        ],
        UrlSavedData: {
          isLoading: false,
          error: {},
          isResponseComplete: true,
          isResponseSuccess: true,
          isFail: false,
          payload: payloadValue,
          status: 200
        }
    }
    expect(MLSUrlBuilderReducer(initialStateForUpdate, {
      type: UPDATE_MLS_URL_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return failure data for mls update request', () => {

    const expectedData = {
      ...initialState,
        UrlData: [
          {
            isUpdated: false,
            UrlDetails: {
              id: 1,
              urlname: 'test',
              urlvalue: 'testurl',
              sourceId: 11,
              downloadType: 'list',
              bodyTextValue: '',
              bodyType: '',
              isActive: true,
            },
            HeaderDetails: [
              {
                headerId: 1,
                headerKey: 'h1',
                headerValue: 'h1',
                isSelected: true,
                urlId: 1,
              }
            ]
          }
        ],
        UrlSavedData: {
          isFail: true,
          isResponseSuccess: false,
          isResponseComplete: true,
          isLoading: false,
          error: {
            errorMessage: "Not updated"
          },
          status: 405
        }
    }
    expect(MLSUrlBuilderReducer(initialStateForUpdate, {
      type: UPDATE_MLS_URL_FAILURE,
      data: {
        error: {
          errorMessage: "Not updated"
        },
        status: 405,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return delete header data request', () => {

  expect(MLSUrlBuilderReducer(initialState, {
      type: DELETE_URL_HEADER_REQUEST,
    })).toEqual(initialState);
  })

  it('reducer should return delete unsaved url data object', () => {
    expect(MLSUrlBuilderReducer(initialState, {
      type: DELETE_NEW_URL_DATA,
    })).toEqual(initialState);
  })

  it('reducer should delete header data successfully', () => {

    const payloadValue = {
      id: 1,
      name: 'demo',
      url: 'demourl',
      mlsInfoId: 11,
      downloadType: 'list',
      body: "",
      bodyType: "",
      isActive: true,
      mlsUrlHeaderDto: [
        {
          headerId: 1,
          headerKey: 'h1',
          headerValue: 'h1',
          isSelected: true,
          urlId: 1
        }
      ]

    }
    const expectedData = {
      ...initialState,
      UrlData : [
        {
          HeaderDetails: [
            {
              headerId: 1,
              headerKey: "h1",
              headerValue: "h1",
              isSelected: true,
              urlId: 1
            }
          ],
          UrlDetails: {
            bodyTextValue: "",
            bodyType: "",
            downloadType: "list",
            id: 1,
            isActive: true,
            sourceId: 11,
            urlname: "test",
            urlvalue: "testurl"
          }, isUpdated: false
        }],
        UrlSavedData: {
          isFail: false,
          isLoading: false,
          isResponseSuccess: false
        }
      }
    expect(MLSUrlBuilderReducer(initialStateForUpdate, {
      type: DELETE_URL_HEADER_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return failure  delete header request', () => {

    const expectedData = {
      ...initialState,
        UrlData: [
          {
            isUpdated: false,
            UrlDetails: {
              id: 1,
              urlname: 'test',
              urlvalue: 'testurl',
              sourceId: 11,
              downloadType: 'list',
              bodyTextValue: '',
              bodyType: '',
              isActive: true,
            },
            HeaderDetails: [
              {
                headerId: 1,
                headerKey: 'h1',
                headerValue: 'h1',
                isSelected: true,
                urlId: 1,
              }
            ]
          }
        ],
        UrlSavedData: {
          isFail: false,
          isResponseSuccess: false,
          isLoading: false,
        }
    }
    expect(MLSUrlBuilderReducer(initialStateForUpdate, {
      type: DELETE_URL_HEADER_FAILURE,
      data: {
        error: {
          errorMessage: "Not updated"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return delete URL data request', () => {
    expect(MLSUrlBuilderReducer(initialState, {
      type: DELETE_MLS_URL_REQUEST,
    })).toEqual(initialState);
  })

  it('reducer should delete URL data successfully', () => {

    const payloadValue = {
      id: 1,
      name: 'demo',
      url: 'demourl',
      mlsInfoId: 11,
      downloadType: 'list',
      body: "",
      bodyType: "",
      isActive: true,
      mlsUrlHeaderDto: [
        {
          headerId: 1,
          headerKey: 'h1',
          headerValue: 'h1',
          isSelected: true,
          urlId: 1
        }
      ]

    }
    const expectedData = {
      ...initialState,
      UrlData : [
        {
          HeaderDetails: [
            {
              headerId: 1,
              headerKey: "h1",
              headerValue: "h1",
              isSelected: true,
              urlId: 1
            }
          ],
          UrlDetails: {
            bodyTextValue: "",
            bodyType: "",
            downloadType: "list",
            id: 1,
            isActive: true,
            sourceId: 11,
            urlname: "test",
            urlvalue: "testurl"
          }, isUpdated: false
        }],
        UrlSavedData: {
          isFail: false,
          isLoading: false,
          isResponseSuccess: false
        }
      }
    expect(MLSUrlBuilderReducer(initialStateForUpdate, {
      type: DELETE_MLS_URL_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return failure delete URL request', () => {

    const expectedData = {
      ...initialState,
      UrlData: [
        {
          isUpdated: false,
          UrlDetails: {
            id: 1,
            urlname: 'test',
            urlvalue: 'testurl',
            sourceId: 11,
            downloadType: 'list',
            bodyTextValue: '',
            bodyType: '',
            isActive: true,
          },
          HeaderDetails: [
            {
              headerId: 1,
              headerKey: 'h1',
              headerValue: 'h1',
              isSelected: true,
              urlId: 1,
            }
          ]
        }
      ],
      UrlSavedData: {
        isFail: false,
        isResponseSuccess: false,
        isLoading: false,
      }
    }
  expect(MLSUrlBuilderReducer(initialStateForUpdate, {
      type: DELETE_MLS_URL_FAILURE,
      data: {
        error: {
          errorMessage: "Not updated"
        },
        status: 405,
      }
    })).toEqual(expectedData);
  })


  it('reducer should return preview raw data request', () => {

    const expectedData = {
      ...initialState,
      PreviewRawData: {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: {
          Columns: '',
          Data: []
        }
      },
    }
    expect(MLSUrlBuilderReducer(initialState, {
      type: GET_MLS_PREVIEW_RAW_DATA_REQUEST,
    })).toEqual(expectedData);
  })

  it('reducer should return preview raw data successfully', () => {

  const payloadValue = {
    "Response Code": "0",
    "Response Msg": "Success",
    "Total Results": "2427",
    "delimiter": "09",
    "Columns": "\tOFFICE_15\tOFFICE_14\tBROKERSHORT\tOFFICE_13\tOFFICE_12\tOFFICE_11\tOFFICE_0\tOFFICE_10\tOFFICE_1\tOFFICE_2\tSYSTEM_ACCESS\tOFFICE_18\tOFFICE_17\tIDXOPT\tBROKERNAME\tTIMESTAMP\tOFFICE_3\tOFFICE_4\tOFFICE_5\tOFFICE_6\tOFFICE_7\tOFFICE_8\tOFFICE_9\t",
    "Data": [{
      "OFFICE_15": "03790",
      "OFFICE_14": "43013",
      "BROKERSHORT": "660000076",
      "OFFICE_13": "OH",
      "OFFICE_12": "Croton",
      "OFFICE_11": "",
      "OFFICE_0": "20131118193557774402000000",
      "OFFICE_10": "30 S High St.",
      "OFFICE_1": "660000168",
      "OFFICE_2": "Real Estate & Auction Services, LLC.",
      "SYSTEM_ACCESS": "1",
      "OFFICE_18": "(866) 538-0333",
      "OFFICE_17": "",
      "IDXOPT": "In",
      "BROKERNAME": "C. H. Chip Carpenter",
      "TIMESTAMP": "2018-06-21T02:02:40.477",
      "OFFICE_3": "(866) 538-0333",
      "OFFICE_4": "",
      "OFFICE_5": "",
      "OFFICE_6": "(740) 893-6100",
      "OFFICE_7": null,
      "OFFICE_8": null,
      "OFFICE_9": null
    }]
  };

    const expectedData = {
      ...initialState,
      PreviewRawData: {
        payload: payloadValue,
        isLoading: false,
        isResponseSuccess: true,
        isResponseComplete: true,
        isFail: false,
        error: {},
      }
    }

    expect(MLSUrlBuilderReducer(initialState, {
      type: GET_MLS_PREVIEW_RAW_DATA_SUCCESS,
      data: {
        payload: payloadValue
      }
    })).toEqual(expectedData);
  })

  it('reducer should return preview raw data failure', () => {
    const expectedData = {
      ...initialState,
      PreviewRawData: {
        isLoading: false,
        payload: {"Columns": "", "Data": []},
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        error: {
        }
      }
    }
    expect(MLSUrlBuilderReducer(initialState, {
        type: GET_MLS_PREVIEW_RAW_DATA_FAILURE,
        error: {
          error: {}
        }
      })).toEqual(expectedData);
  });

  it('reducer should return preview photo data request', () => {

    const expectedData = {
      ...initialState,
      PreviewRawData: {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: {
          Columns: '',
          Data: []
        }
      },
    }
    expect(MLSUrlBuilderReducer(initialState, {
      type: GET_MLS_PREVIEW_PHOTO_DATA_REQUEST,
    })).toEqual(expectedData);
  })

  it('reducer should return preview photo data successfully', () => {

    const payloadValue = {
      "message": null,
      "validUrl":true,
      "suggestedUrlTemplate":
      "http://sabor-rets.connectmls.com/rets/server/getobject?ID=${PHOTO_LISTING_ID}&Resource=Property&Type=Photo",
      "workingUrlExample":"http://sabor-rets.connectmls.com/rets/server/getobject?ID=1347629:*&Resource=Property&Type=Photo",
      "strategy":"STRATEGY_LISTING_NUM_XML_BINARY",
      "photosAsByteArray":["/9j/4AAQSkZJRgABAQEA8ADwAAD/"]
    };

    const expectedData = {
      ...initialState,
      PreviewRawData: {
        payload: payloadValue,
        isLoading: false,
        isResponseSuccess: true,
        isResponseComplete: true,
        isFail: false,
        error: {},
      }
    }

    expect(MLSUrlBuilderReducer(initialState, {
      type: GET_MLS_PREVIEW_PHOTO_DATA_SUCCESS,
      data: {
        payload: payloadValue
      }
    })).toEqual(expectedData);
  })

  it('reducer should return preview photo data failure', () => {
    const expectedData = {
      ...initialState,
      PreviewRawData: {
        isLoading: false,
        payload: {
          "Columns": "",
          "Data": [],
        },
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        error: {
        }
      }
    }
    expect(MLSUrlBuilderReducer(initialState, {
        type: GET_MLS_PREVIEW_PHOTO_DATA_FAILURE,
        error: {
          error: {}
        }
      })).toEqual(expectedData);
  });

  it('reducer should return place holder values data request', () => {

    const expectedData = {
      ...initialState,
      MlsPlaceHolderValues: {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }
    expect(MLSUrlBuilderReducer(initialState, {
      type: GET_MLS_URL_PLACEHOLDER_VALUES_REQUEST,
    })).toEqual(expectedData);
  })

  it('reducer should return place holder values data successfully', () => {

    const payloadValue = [
      'LAST_AGENT_DOWNLOAD_TS',
      'LAST_OFFICE_DOWNLOAD_TS',
      'LAST_PHOTO_DOWNLOAD_TS',
      'LAST_INCREMENTAL_LISTING_DOWNLOAD_TS',
      'LAST_FULL_LISTING_DOWNLOAD_TS',
      'NOW',
      'TODAY'
    ];

    const expectedData = {
      ...initialState,
      MlsPlaceHolderValues: {
        payload: payloadValue,
        isLoading: false,
        isResponseSuccess: true,
        isResponseComplete: true,
        isFail: false,
        error: {},
      }
    }

    expect(MLSUrlBuilderReducer(initialState, {
      type: GET_MLS_URL_PLACEHOLDER_VALUES_SUCCESS,
      data: {
        payload: payloadValue
      }
    })).toEqual(expectedData);
  })

  it('reducer should return place holder values data failure', () => {
    const expectedData = {
      ...initialState,
      MlsPlaceHolderValues: {
        isLoading: false,
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        error: {}
      }
    }
    expect(MLSUrlBuilderReducer(initialState, {
        type: GET_MLS_URL_PLACEHOLDER_VALUES_FAILURE,
        error: {
          error: {}
        }
      })).toEqual(expectedData);
  });

})
