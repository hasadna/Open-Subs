=========================================
Setting up the development environment
=========================================

Pre-Requisites
==============

Open Subs is using Open Knesset as its backend

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

This sets up the address of the Open-Knesset API server at https://localhost:8000

make sure to run your local open knesset on https by using manage.py runsslserver

Important! - you will need to approve security exception to allow running on https - this is OK, you are running locally..

Be sure to add an exception for your local open knesset by going to https://localhost:8000/ and approving the exception

Setting up for testing on facebook
==================================

.. code-block:: text

    Create a test app on facebook

    Add the Canvas platform and set the Secure Canvas URL to https://localhost:9000/
    Add the Website platform and set the Site URL to https://localhost:9000/

    That's it, you can now browse to your canvas app page!
