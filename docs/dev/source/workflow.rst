.. _devel_workflow:

=========================
Development Workflow
=========================

Congratulations, we have everything installed, now it's time to start working on
the project. Here are some guidelines and scenarios to help you get started.

Commits and Pull Requests
========================================

Make it easier for you and the maintainers, increasing the chances of a pull
request getting accepted:

- No big Pull Requests. It makes reviewing and ensuring correctness hard. If
  possible, break it to smaller commits/pulls, each related to a specific issue.
- Always work on a specific issue from our `issue tracker`_. Open new issue if
  needed and claim it in the comments.
- Discuss big things in the `Open Knesset Category`_.

.. _issue tracker: https://github.com/hasadna/Open-Subs/issues?state=open
.. _Open Knesset Category: http://forum.hasadna.org.il/c/5-category/12-category

Before Coding
==========================

We need to make sure we're in sync with changes done by others (upstream).

.. important::

    Please do this every time before you start developing:

Update the code and requirements
--------------------------------------

Enter the `osubs` directory, and add the `hasadna` respoitory:

.. code-block:: sh

    git remote add hasadna git@github.com:hasadna/Open-Subs.git

Pull upstream changes to your fork just before you start coding:

.. code-block:: sh

    git pull hasadna master

.. note::

    Running this command requires having SSH keys registered with github. If you don't have these, or
    if you don't understand what this means and do not want to look it up, you can use:

    git pull https://github.com/hasadna/Open-Subs.git master

If `requirements.txt` was modified, make sure all of them are installed (no harm
running this command even in case of no changes):

    `pip install -r requirements.txt`


Testing
-------

.. code-block:: sh

    python tests.py


See :ref:`devel_tips` for a few bash functions that may help.

While Coding
==============

General
---------

- Write tests for everything that you code.
- Keep performance in mind.


After you code
~~~~~~~~~~~~~~~~

- ``python tests.py`` # make sure you didn't break anything
- ``git status`` # to see what changes you made
- ``git diff filename`` # to see what changed in a specific file
- ``git add filename`` # for each file you changed/added.
- ``git commit -m "commit message"`` 
  
  Please write a sensible commit message, and include "fix#: [number]" of the issue number you're working on (if any).
- ``git push`` # push changes to git repo
- go to github.com and send a "pull request" so your code will be reviewed and
  pulled into the main branch, make sure the base repo is
  **hasadna/Open-Subs**.
