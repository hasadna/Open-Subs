'use strict';

describe('when going to the root url', function() {

  beforeAll(function() {
    browser.get('/');
  });

  it('should show the splash screen', function() {
    expect(browser.driver.getCurrentUrl()).toMatch('/#/splash');
  });

  describe('when clicking the button', function() {

    beforeAll(function() {
      element(by.css('a.btn-primary')).click();
    });

    it('should go to the homepage', function() {
      expect(browser.driver.getCurrentUrl()).toMatch('/#/home');
    });

  })

});
