import { forceLogout } from 'utils/logout';
import * as ZapHeaderActions from 'actions/MlsZapHeaderAction';

export default function callAPIMiddleware({ dispatch }) {
  return next => action => {
    const {
      types,
      callAPI,
      payload = {},
      handleSuccess = () => {

      },
      handleFail = () => {

      }
    } = action;
    if (!types) {
      // Normal action: pass it on
      return next(action)
    }

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.')
    }
    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.')
    }

    const [requestType, successType, failureType] = types;

    const dispatchFailure = (error, status, statusText) => {
      return(
        dispatch(
          Object.assign({}, payload, {
            error: {
              error: (error.message || error.errorMessage) ? error : { message: "Something went wrong. Please try again later." },
              status,
              statusText
            },
            type: failureType,
          })
        )
      );
    }

    dispatch(
      Object.assign({}, payload, {
        type: requestType
      })
    )

    return callAPI().then(
      (response) => {
        const status = response.status;
        const statusText = response.statusText;
        if(!response.ok){
          if(status === 401 ){
            dispatch(ZapHeaderActions.clearSessionData());
            forceLogout();
          }
          response.json().then( res => {
            dispatchFailure(res, status, statusText);
          })
          .catch((error) => {
            dispatchFailure(error, status, statusText);
          });
          handleFail();
          return;
        }
        response.text().then((data) => {
        {
          data = data ? JSON.parse(data) : [];
          if( status === 200 || status === 204 ) {
            dispatch(
              Object.assign({}, payload, {
                data: {
                  payload: data,
                  status
                },
                type: successType
              })
            );
            handleSuccess(data);
          } else {
            dispatchFailure(data, status, statusText);
            handleFail();
          }
        }
      })
    },
    error => {
      dispatchFailure(error, '', '');
      handleFail();
    }
    )
  }
}
