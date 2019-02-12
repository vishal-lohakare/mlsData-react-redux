
const showLoader = () => {
  const loader = document.createElement('div');
  loader.innerHTML = '<div id="loading" class="loaderWrapper"><img src="./fonts/loader.gif" /></div>';
  const dummyLoaderElement = document.createElement('div');
  const bodyElement = document.getElementsByTagName("body")[0];
  dummyLoaderElement.className = 'dummyLoader';
  if(document.getElementsByClassName('dummyLoader').length === 0){
    bodyElement.appendChild(loader);
  }
  bodyElement.appendChild(dummyLoaderElement);
};

const hideLoader = () => {
  const bodyElement = document.getElementsByTagName("body")[0];
  const dummyLoaderList = document.getElementsByClassName('dummyLoader');
  if(dummyLoaderList.length > 0) {
    bodyElement.removeChild(dummyLoaderList[0]);
  }

  if(dummyLoaderList.length === 0) {
    const loaderWrapperList = document.getElementsByClassName('loaderWrapper');
    loaderWrapperList[0] && bodyElement.removeChild(loaderWrapperList[0].parentNode);
  }
};

export { showLoader, hideLoader };
