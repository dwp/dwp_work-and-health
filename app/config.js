// Use this file to change prototype configuration.

// Note: prototype config can be overridden using environment variables (eg on heroku)

module.exports = {

  // Service name used in header. Eg: 'Renew your passport'
  serviceName: "My health and work journal",

  // Default port that prototype runs on
  port: '3000',

  // Enable or disable password protection on production
  useAuth: 'true',

  // Cookie warning - update link to service's cookie page.
  cookieText: 'GOV.UK uses cookies to make the site simpler. <a href="#" title="Find out more about cookies">Find out more about cookies</a>',

  protoPaths: {
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

};
