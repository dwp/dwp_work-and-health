var express = require('express'),
    router = express.Router(),
    bodyparser = require('body-parser'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    glob = require('globby'),
    config = require(__dirname + '/config');

var protoPaths = {
  version: '/journal/:version*',                     // e.g '/journal/alpha-01/'
  step: '/journal/:version*/app/:step',              // e.g '/journal/alpha-01/app/address'
  appsGlob: [
    __dirname + '/views/journal/**/index.html',
    '!' + __dirname + '/views/journal/**/app/index.html'
  ],
  routesGlob: [
    __dirname + '/views/**/version_routes.js'
  ]
}

var getVersionName = function(path) {
  var sp = path.split('/');
  var computedPath = _.join( _.slice( sp, ( _.indexOf(sp, 'views') +1 ) ), '/' );
  return {
    computedPath: computedPath,
    title: computedPath.split('/')[1],
  }
}

// loop each version route file and bring it in passing router and some config
glob.sync(protoPaths.routesGlob).forEach(function(p){
  require(p)(router, { protoPaths: protoPaths });
});

/**
 * for all routes provide some standard context data
 * this is brittle but works for the Interaction Designer.
 */
router.use(function(req, res, next){

  // protoypes config obj
  var proto = { versions: [] }

  // using glob pattern for the predefined folder structure to grep url and title
  glob.sync(protoPaths.appsGlob).forEach(function(p){
    var v = getVersionName(p);
    proto.versions.push({ url: v.computedPath, text: (v.title[0].toUpperCase() + v.title.slice(1)).replace("-", ' ') });
  });

  // update locals so this data is accessible
  _.merge(res.locals,{
    postData: (req.body ? req.body : false),
    proto: proto
  });

  next();

});

/**
 * handle 'phase' (alpha/beta,etc) and 'version' of prototypes by passing some
 * enhanced context data (useful to nunjucks templates).
 */
router.all([protoPaths.version], function(req, res, next){
  _.merge(res.locals.proto, {
    version: req.params.version,
    relAppPath: 'journal/' + req.params.version + '/app',
    path: '/journal/' + req.params.version + '/app'
  });
  next();
});

router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;
