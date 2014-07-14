## Installation

### Prerequisites

 1. [nodeJS](http://nodejs.org/)
 2. [Yeoman](https://yeoman.io)

First, check if you have node installed by running the following command in the terminal:

    node --version

If this returns a version number then node is installed. Ensure you upgrade it before continuing.

    brew update
    brew upgrade node

You should also upgrade the node package manager `npm` at this point.

    brew upgrade npm

If you don't see the version number then you must install node with:

    brew install node

Next, install Yeoman using `npm`. Refer to the [official installation instructions](http://yeoman.io/learning/index.html) if you get into trouble.

    npm install -g yo

This should also install `bower` and `grunt`. Bower is a package manager for frontend JS and CSS files and grunt is a task manager we will use to perform tasks such as deployment and compiling SASS.

Once Yeoman is installed, you should be able to run the following commands:

    yo --help
    bower help
    grunt --help


### Getting the code

Once the prerequisites are installed, clone this repository to your local machine:

    git clone git@bitbucket.org:dtuite/angular-drawing.git
    cd angular-drawing

Install the project's dependencies via `npm` (this is exactly the same thing as `bundle install` for Ruby gems expect it uses NodeJS packages):

    npm install

Install third-party scripts using bower:

    bower install

Finally run the server. This will automatically open the app in your browser at `http://localhost:9000/`.

    grunt serve

## Contributing

### Styling

SASS and CSS files should be written under `app/styles`. To add a new file simply create it in this directory (or a subdirectory) with a name like this:

    app/styles/_the_file_name.scss

Make sure to prefix the name with an underscore. Then `@include` the file into `app/styles/main.scss`.

    // app/styles/main.scss
    @import "the_file_name";

SASS and SCSS files will be automatically compiled whenever a file change is detected and the app should automatically reload in the browser.

### Templates

The layout file for the project can be found in `app/index.html`. Please ignore all the `<script>` tags in this file, they will be collapsed when the app is built for production.

All other project views can be found under `app/views`. When the user changes page, a template will be chosen from this directory and inserted into the `div.container` tag in the layout. I've tried as much as possible to stick to the Ruby on Rails convention of rendering `views/screens/show.html` when the user visits the `/screens/:id` route.

Templates use moustache style tags for inserting data (`{{ ... }}` instead of, for example, Ruby on Rails's `<%= ... %>` tags).

Some HTML tags will have custom AngularJS attributes on them to specify various attributes of their behaviour. For example, the following tag uses the `ng-show` directive. Any div with this attribute will be visible when the code between it's double quotes is `true` and hidden when it is `false`.

    <div class="col-md-3" ng-show="inspectedShape">

This next tag has an `ng-click` directive. This specifies behaviour to occur when the element is clicked.

    <span ng-click="interaction.destroy()">&times;</span>

These attributes shouldn't interfere too much with any design work. Just make sure not to delete them or break them. Regular attributes such as `class`, `id` etc. will continue to work as expected. They look unweildy but that's just an unfortunate aspect of how Angular works.

### Partials

Partials can be used via the `ng-include` directive. For example, the following snippet will render the view from `views/layouts/header.html` whereever it is encountered.

    <div ng-include src="'views/layouts/header.html'"></div>

### Frontend Plugins

Two notable plugins we're using are [Angular-xeditable](http://vitalets.github.io/angular-xeditable/) for in-place editing and [selectize.js](http://brianreavis.github.io/selectize.js/) for select boxes.

Both of these plugins come with their own theming capabilities. 

### Database

The database is provided by [Firebase](https://www.firebase.com/). Using them means that we get a real-time capabable, offline-mode database without having to build and maintain our own Rails app.

There are different databases for development/staging/production already but we'll have to share the same development database between us for the moment. Eventually I will come up with a clean way for us to both have our own databases for development.

### Hosting

Hosting is also [provided by Firebase](https://www.firebase.com/hosting.html). The advantages of this are

 1. We get access to fast asset loading via their CDN
 2. We get `https` urls by default.
 3. We get deploys which are even easier than Heroku's.