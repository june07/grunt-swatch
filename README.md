# fiveo
[![Build Status](https://travis-ci.org/june07/fiveo.svg?branch=master)](https://travis-ci.org/june07/fiveo)



A tiny JavaScript library to add some sweetness to Node.js core's inspector module.  Adds some key missing features:
* Adding the ability to start the inspector via the [SIGNAL method](https://nodejs.org/api/process.html) using ANY PORT and not just 9229.  Opens up the possible debug applications and workflows tremendously.
* STOPPING the inspector instance using the SIGUSR2 signal (will stop both sessions started with SIGUSR2 and the native SIGUSR1).  It's likely that leavning the inspector listening (production environments...) is a bad idea. 

## Installation
```bash
$ npm install fiveo
```

## Usage
`fiveo` exposes a function; simply pass this function the name of your module, and it will return a decorated version of `console.error` for you to pass debug statements to. This will allow you to toggle the debug output for different parts of your module as well as the module as a whole.

Example [_yourapp.js_](./examples/node/app.js):

```js
require('fiveo');
// The rest of your code...
```


## Environment Variables
When running through Node.js, you can set a few environment variables that will
change the behavior of the debug logging:

| Name      | Syntax | Purpose                                | Examples         |
|-----------|--------|-----------------------------------------|----------------|
| `INSPECT` | [hostname:port] | Declares which host:port you want the inspector to listen on. | 9230 or localhost:9230

__Note:__ The default value for INSPECT is `localhost:9229`.
