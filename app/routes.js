var express = require('express'),
    router = express.Router(),
    bodyparser = require('body-parser'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    glob = require('globby'),
    config = require(__dirname + '/config'),
    utils = require(__dirname + '/utils'),
    protoPaths = config.protoPaths;

// loop each version route file and bring it in passing router and some config
glob.sync(protoPaths.routesGlob).forEach(function(p){
  require(p)(router, { protoPaths: protoPaths, route: protoPaths.step.replace(':version*', utils.getVersionName(p).title) });
});

/**
 * for all routes provide some standard context data
 * this is brittle but works for the Interaction Designer.
 */
router.use(function(req, res, next){
  var proto = { versions: [] }

  // using glob pattern for the predefined folder structure to grep url and title
  glob.sync(protoPaths.appsGlob).forEach(function(p){
    var v = utils.getVersionName(p);
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
 * handle 'version' of prototypes by passing some
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

/**
 * render an index file if user hits '/'
 */
router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;
