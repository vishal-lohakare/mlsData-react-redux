const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ternRoute = require('./tern.js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 1338;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');


app.use('/', express.static(`${__dirname}/../dist`));
app.use('/options', ternRoute);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'), function (err) {
    if (err) { res.status(500).send(err) }
  })
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server is listening on 1338`);
});

module.exports = app;
