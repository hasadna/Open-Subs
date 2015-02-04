var config = {
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    'specs/*.js'
  ],
  baseUrl: 'https://localhost:9001', //default test port with Yeoman
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true
  }
};

if (process.env.TRAVIS) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.capabilities = {
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': "Open-Subs build "+process.env.TRAVIS_BUILD_NUMBER,
    'browserName': 'chrome'
  };
}

exports.config = config;
