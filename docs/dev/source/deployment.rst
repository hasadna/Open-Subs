==================
Deploying the code
==================

When you are done playing, follow this guide to deploy the code to a real server:

From your PC
===========

The following commands should run from your personal computer, not on the server:

.. code-block:: sh

    $ cd Open-Subs/angular
    $ grunt build

Now, the Open-Subs/angular/dist directory contains all the static files and you just need to copy them to the remote server.

On the server
=============

Copy the contents of the Open-Subs/angular/dist directory to the server.

Copy Open-Subs/angular/app/scripts/settings.js.dist into scripts/settings.js on the server

Then, edit it to point to the correct open knesset backend server.

As long as the settings.js.dist file doesn't change it only needs to be done once, not every deployment.

Then, setup a web server to serve static files from that directory.

That's it.
