var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  const response = {
    info: 'This is the listener route of the server for this example. You can also subscribe another servers.',
    message: req.body,
  };
  console.log('listening:', response);
  res.send(response);
});

module.exports = router;
