module.exports = function(router, config) {
  
  router.all(config.protoPaths.step, function(req,res,next){

    var requestedPage = req.params.step,
        postData = req.body || {};

    console.log('test');

    next();

  });

  return router;
}
