=========================================
Setting up the development environment
=========================================

Pre-Requisites
==============

Open Subs is using Open Knesset as its backend and for now, you have to
run it locally to run the project.

.. note::

    Soon, we'll have an Open Knesset dev server so the game developers
    don't have to setup a local dev server.

Instructions were tested on Ubuntu, but should work similarly on any
Linux flavor, OSX and even Windows.
Install rvm with stable ruby, follow instructions here: https://rvm.io/rvm/install

.. code-block:: sh

    # Install nvm, follow instructions here: https://github.com/creationix/nvm
    # After nvm is installed, run the following:
    nvm install stable
    # To automatically use the stable node on login, add the following to the bottom of ~/.bashrc:
    nvm use stable
    # Install grunt and bower globally:
    npm install bower -g
    npm install grunt-cli -g
    # Install compass:
    gem install compass


Updating node and bower modules
===============================

.. code-block:: sh

    cd Open-Subs/angular
    npm install
    bower install


Setting the frontend server's settings
======================================

The angular local settings contains the url to the django backend server:

.. code-block:: sh

  cd Open-Subs/angular/app/scripts
  cp settings.js.dist settings.js

This sets up the address of the Open-Knesset API server at http://localhost:8000

Setting up for testing on facebook
==================================

.. code-block:: text

    Create a test app on facebook - this app will be used both for Open Knesset and for Open Subs

    Add the Canvas platform and set the Secure Canvas URL to https://localhost:8000/users/login-redirect-facebook-canvas/opensubs/
    Add the Website platform and set the Site URL to https://localhost:8000/

    add the following to your local_settings.py file:
    SOCIAL_AUTH_FACEBOOK_KEY = 'YOUR APP KEY'
    SOCIAL_AUTH_FACEBOOK_SECRET = 'YOUR APP SECRET'
    OPENSUBS_FACEBOOK_CANVAS_APP_URL = 'YOU APP CANVAS PAGE URL'

    Setup your backend server to use ssl:
    pip install django-sslserver
    add the following to your local_settings.py file:
    EXTRA_INSTALLED_APPS = ('sslserver',)
    then, run it using:
    manage.py runsslserver

    Setup your frontend server to use ssl:
    add a file: angular/Gruntfile_local.js with the following content:
    'use strict';
    module.exports = {
      connect_protocol: 'https'
    };
    edit app/scripts/settings.js - modify the backend server protocol to https

    That's it, you can now browse to your canvas app page!