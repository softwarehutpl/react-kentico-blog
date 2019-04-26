Contributing Guidelines
=======================

Thank you for taking an interest in contributing to this package! Here is a list of things to keep in mind when making a contribution:

Style
-----
We use `Prettier <https://prettier.io/>`_ to keep the code style consistent,
along with `husky <https://github.com/typicode/husky>`_ so you shouldn't have to
worry about styling anything, but it may be helpful to install
an extension for your IDE that will format the files automatically.

Commits
-------
We use `Semantic Commit Messages <https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716>`_ and you should too!
It makes it much easier to see what happened in the repository.

`DCO <https://developercertificate.org>`_ is used to assert that authors are legally authorized
to make the contributions - this is done by signing-off every commit - either manually or using the `-s` switch from CLI.
**You have to use your real name in the sign-off, because DCO is a legally binding document.**

Testing
-------
Tests are written in Jest/Enzyme and the library is developed using TDD - we strongly recommend you to do the same.
Test coverage must be kept at 100% - any coverage exceptions must be properly explained in-place, like so::

   useEffect(() => {
     ...
     /* istanbul ignore next: would test React */
     return () => subscription.unsubscribe();
   });

Before submitting a pull request please make sure all tests are green and coverage is still at 100%.

Documentation
-------------
Documentation is created using `Sphinx <http://sphinx-doc.org/>`_ and hosted on `Read the Docs <https://readthedocs.org/>`_.
Please try to keep the documentation consistent with the changes you make.

Governance model
----------------
Since the project is pretty small the main maintainer makes all final decisions.

Above all else use common sense and if you have any doubts feel free to ask.