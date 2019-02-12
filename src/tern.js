const express = require('express');
const router = express.Router();
const _ = require('lodash');
const tern = require('ternjs');
const defs = require('./ternEntryData');

/**
 * Create a new instace with def symbols to request options
 */
const server = new tern.Server({
  "async": true,
  "defs": defs
});

router.post('', function (req, res) {
  if (!req.body) res.send("Invalid request");
  server.request(req.body, function (err, data) {
    if (err) res.send(err);
    res.json(data.completions);
  });
});

module.exports = router;