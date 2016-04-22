var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

// route to configure the start page
router.get('/start', function (req, res) {
  res.redirect('journal/about_me');
});

module.exports = router;
