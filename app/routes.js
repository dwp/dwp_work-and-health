var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

  res.render('index');

});


// Example routes - feel free to delete these

// Passing data into a page

router.get('/start', function (req, res) {
  res.redirect('journal/about_me');
});

// Branching

// add your routes here

module.exports = router;
