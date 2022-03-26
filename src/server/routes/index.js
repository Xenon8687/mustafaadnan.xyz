var express = require('express');
var router = express.Router();

router.get('/*', function(req, res, next) {
 res.sendFile(require('path').join(__dirname, '..', '..', 'public', 'index_template.html'));
});

module.exports = router;