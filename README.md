andamio
=======


Andamio is a set of frontend design patterns. It's intended for primarily two
groups of users: # For interaction designers, it's easy to quickly create actual
prototypes by copy/pasting some HTML. # For frontend developers, it's a minimal,
flexible base framework to add your own visual designs to.


Requirements
============



Getting started
===============

Andamio is setup to make it easy to include in your project and adding your own
CSS and Javascript to it.

I would suggest a directory structure like this:

/project-name/
    |-- andamio/
        |-- style/
            |-- *main.less*
    |-- style/
    |-- js/

In the directory project-name/style/, add this file:
main.less

Add the following lines to main.less:

<pre>
@import "../andamio/style/main.less";
@import "mypattern.less";
</pre>

