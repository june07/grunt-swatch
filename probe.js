'use strict';

const debug = require('debug')('swatch:probe'),
    EE = require('events').EventEmitter,
    net = require('net'),
    { exec } = require('child_process'),

    inspector = require('./remoteInspector');

// Disable verbose probe logging unless SWATCH_PROBE is true
if (! process.env.SWATCH_PROBE) debug.disable();

class Probe extends EE {
    constructor(port, opts, done) {
        super();
        EE.call(this);

        if (typeof opts === 'function') {
            done = opts;
            opts = {};
        }

        let socket = {
            host: 'localhost',
            proto: port.split('/')[0],
            port: port.split('/')[1]
        };
        done = done || this.emptyFunction;
        this._keepalive = setInterval(this.emptyFunction, 200);
        this._pollSocket(socket, opts, this.emptyFunction);
        return this;
    }
    emptyFunction() {} 
}
Probe.prototype.emit = function() {
    debug('--------- args ----------', arguments);
}
Probe.prototype._pollSocket = function(socket, opts, callback) {
    let self = this;

    exec('ss -lnp \'sport = ' + socket.port + '\' | grep -Po \'pid\=\\d+\'', (error, stdout, stderr) => {
        if (error) {
            return setTimeout(() => {
                debug('-----------loop')
                self._pollSocket(socket, opts, callback)
            }, 1000);
        }
        if (stderr) return debug(stderr);
        debug('---------- stdout --> ', stdout);
        let pid = stdout.split('=')[1];
        new net.Socket().connect(socket.port, socket.host)
        .on('connect', () => {
            debug('connected');
            inspector.open(pid, opts.inspectPort);
        })
        .on('error', () => {
            debug('error');
            inspector.close();
            self._pollSocket(socket, opts, callback);
        })
        .on('end', () => {
            debug('disconnect');
            inspector.close();
            self._pollSocket(socket, opts, callback);
        });
    });            
}
module.exports.Probe = Probe;