# grunt-swatch

> Run tasks whenever watched sockets change.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-swatch --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-swatch');
```

## The "swatch" task

### Overview
In your project's Gruntfile, add a section named `swatch` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  swatch: {
    targets: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

## targets

### targets.port
Type: `String`
Default value: `''`

The ports key is used to tell Grunt which application port to probe.

### targets.actions
Type: `Array`
Default value: `[]`

### Usage Examples

```js
grunt.initConfig({
  swatch: {
    default: {
      targets: {
        port: 'tcp/45670',
        actions: [{
          name: 'inspector',
          args: {
            port: 9230
          }
        }]
      },
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
