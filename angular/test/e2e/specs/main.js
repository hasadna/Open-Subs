'use strict';

var fail = function() { expect(true).toBe(false); }

describe('when going to the root url', function() {

  beforeAll(function() {
    // getting the root
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
})

describe('when clicking the play button', function() {
  beforeAll(function() {
    // clicking play
    element(by.css('div.splash a.play')).click();
  });

  it('should go to the game start page', function() {
    expect(browser.driver.getCurrentUrl()).toMatch('/#/home');
  });

});


describe('when clicking the elect button on the welcome page', function (){
  beforeAll(function() {
    // clicking drive
    element(by.css('div.modal-dialog button.drive')).click();
  });
  it('should show the sub', function () {
    browser.isElementPresent(element(by.css('section.sub')));
    // expect(element(by.css('section.welcome')).visible()).toBe(false);
  });
});

describe('check clicking id 4 comitee', function() {
  beforeAll(function() {
    browser.get('/');
    element(by.css('div.splash a.play')).click();
    //element(by.css('div.modal-dialog button.drive')).click();
    //element(by.css('div.modal-dialog button.drive')).click();
    // clicking maketa class
    element(by.id('mychair-4')).click();
  });

  it('should open comitee', function() {
    browser.isElementPresent(element(by.css('section.sub')));
  });

});

describe('check clicking publish', function() {
  beforeAll(function() {
    
    // clicking maketa class
    element(by.id('publish')).click();
  });

  it('should open publish', function() {
    browser.isElementPresent(element(by.css('section.sub')));
  });

});



describe('check clicking maketa', function() {
  beforeAll(function() {
    browser.get('/');
    // clicking maketa class
    element(by.css('div.license a.maketa')).click();
  });



  it('should open maketa', function() {
    expect(browser.driver.getCurrentUrl()).toMatch('/#/about');
  });

});



