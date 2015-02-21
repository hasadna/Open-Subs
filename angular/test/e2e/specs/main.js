'use strict';

describe('when going to the root url', function() {

  beforeAll(function() {
    browser.get('/');
  });

  it('should have offline and noFacebook', function() {
    // currently the test only supports testing with offline mode and without facebook
    expect(browser.executeScript(function() {
      return (SETTINGS.offline && SETTINGS.noFacebook)
    })).toBeTruthy();
  });

  it('should show the splash screen', function() {
    expect(browser.driver.getCurrentUrl()).toMatch('/#/splash');
  });

  describe('when clicking the button', function() {

    beforeAll(function() {
      element(by.css('div.splash a.play')).click();
    });

    it('should go to the homepage', function() {
      expect(browser.driver.getCurrentUrl()).toMatch('/#/home');
    });

  })

});
