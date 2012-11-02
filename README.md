andamio
=======


Andamio is a set of frontend design patterns. It's intended for primarily two
groups of users: # For interaction designers, it's easy to quickly create actual
prototypes by copy/pasting some HTML. # For frontend developers, it's a minimal,
flexible base framework to add your own visual designs to.


Getting started
===============

Andamio is setup to make it easy to include in your project and adding your own
CSS to it. There are bundles for desktop, mobile website and mobile webapp which
include all relevant patterns for these use cases.

A typical directory structure looks like this:

/project-name/
    |-- andamio/
        |-- style/
            |-- *main.less*
            |-- *variables.less*
    |-- templates/

In the directory project-name/style/, add these two files:

* main.less variables.less

Add the following lines to main.less:

<pre>
@import "../andamio/bundle/main-desktop.less"
@import "variables.less"
</pre>

Copy the contents of andamio/global/variables.less to style/variables.less and
adjust the variables as you want. Of course, you can add whatever kind of files
you need to create your project's visual design, just make sure to include them
in your main.less.
