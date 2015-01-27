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

This sets up the address of the Open-Knesset API server at localhost:8000)

