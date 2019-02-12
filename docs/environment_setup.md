# MLS Data Platform
UI repo highlights and important commands to get started with.

### Installation Step
When first setting up this repo and whenever you switch branches run below command to get all the client side dependencies installed.
```sh
$ npm install
```

### Generate Prod Build
Run build command to generate code for production. This will create single js file named bundle.js and index.html
```sh
$ npm run build
```

### Run app locally
Run below command to start the dev server and build the code in development mode.
```sh
$ npm start
```

### Flow checker
This is static flow checker for js code. Executing this command will throw errors if flow missing in any js file.
```sh
$ npm run flow
```

### Run unit test
This command is mainly for unit testing your code. We are using JEST here.
```sh
$ npm run test
```

## Important Packages
- `lodash` - Lodash makes JavaScript easier by taking the hassle out of working with arrays, numbers, objects, strings, etc. Mainly Iterating arrays, objects, & strings
- `eslint` - Using eslint for linting the JS code which will highlight basic linting errors in editor.
- `redux/redux-thunk` - Using redux thunk as middleware and redux store for state management.
- `flow` - This package is static flow checker for JS code.
