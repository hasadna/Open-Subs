exports.config = {
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    'specs/*.js'
  ],
  baseUrl: 'https://localhost:9001', //default test port with Yeoman
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true
  }
  //sauceUser: 'OpenKnesset',
  //sauceKey: ''
};
