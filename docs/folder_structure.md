# Folder Structure

We have below high level folders in our repository

- docs
  Consist of all documentation for repo and project
- src
  Source folder for our project
   - `__test__` Consist of all unit testcases
      Write test case in appropriate folder like component, reducer, actions under this folder. Create parent folder inside this with name of your component.
   - `components` All common components will reside  in this folder.
   - `constants` Create any project specific constants in this folder. So easy for maintenance.
   - `routes` All screens will be created in this folder.
   - `styles` Common scss, fonts will be added here.
   - `utils` All util files like store.js, date.js APIHelper.js
   - `reuder` Reducer file for each route
   - `actions` Action files in complete app
