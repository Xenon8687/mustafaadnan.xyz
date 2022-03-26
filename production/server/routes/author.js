var express = require('express');
var router = express.Router();

router.get('/getAuthorInfo', async function(req, res, next) {
  res.send((await (await global.discord).getStatus()).presence);
});

module.exports = router;