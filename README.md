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
Run this task with the `grunt swatch` command.
### Overview
In your project's Gruntfile, add a section named `swatch` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  swatch: {
    targets: [
        { port: 'tcp/1234', actions: [ { name: 'action1', args: { arg1: 'value1', arg2: 'value2', ... }, {}, ... } ] },
        { port: 'tcp/9876', actions: [ { name: 'action2', args: { arg1: 'a2-value1', arg2: 'a2-value2', ... }, {}, ... } ] },
        ...
    ],
  },
});
```

## targets

### targets.port
Type: `String`
Default value: `none`
The ports key is used to tell Grunt which application port to probe.

### targets.actions
Type: `Array`
Default value: `none`
The actions key is an array of action objects which are action configuration objects.  The current availble action is the `nim` action which starts the Node.js debugger via the inspector protocol and signal handlers.

From https://nodejs.org/api/process.html#process_signal_events:
> `'SIGUSR1'` is reserved by Node.js to start the debugger. It's possible to install a listener but doing so might interfere with the debugger.
Note that currently the only port that can be used is the default 9229 due to a limitation of Node.js.

### Usage Examples

```js
grunt.initConfig({
  swatch: {
    default: {
      targets: {
        port: 'tcp/45670',
        actions: [{
          name: 'nim',
          args: {
            port: 9229
          }
        }]
      }
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
