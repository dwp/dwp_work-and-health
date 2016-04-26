module.exports = function(router, config) {

  router.all(config.protoPaths.step, function(req,res,next){

    var requestedPage = req.params.step,
        postData = req.body || {};

    switch(requestedPage) {

      case 'about_me':
        console.log("about me!!!");
      break;

    }

    next();

  });

  return router;
}
