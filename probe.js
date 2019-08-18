'use strict';

const debug = require('debug')('swatch:probe'),
    EE = require('events').EventEmitter,
    net = require('net'),
    { exec } = require('child_process'),

    nim = require('./nim');

// Disable verbose probe logging unless SWATCH_PROBE is true
//if (! process.env.SWATCH_PROBE) require('debug').disable();

class Probe extends EE {
    constructor(target, opts, done) {
        super();
        EE.call(this);

        if (typeof opts === 'function') {
            done = opts;
            opts = {};
        }

        let socket = {
            host: 'localhost',
            proto: target.port.split('/')[0],
            port: target.port.split('/')[1]
        };
        done = done || this.emptyFunction;
        this._keepalive = setInterval(this.emptyFunction, 200);
        this._pollSocket(socket, target, opts, this.emptyFunction);
        return this;
    }
    emptyFunction() {} 
}
Probe.prototype.emit = function() {
    debug('--------- args ----------', arguments);
}
Probe.prototype._pollSocket = function(socket, target, opts, callback) {
    let self = this;

    self.triggered = {
        connect: false,
        error: false,
        end: false
    };

    exec('ss -lnp \'sport = ' + socket.port + '\' | grep -Po \'pid\=\\d+\'', (error, stdout, stderr) => {
        if (error) {
            return setTimeout(() => {
                debug('-----------loop')
                self._pollSocket(socket, target, opts, callback)
            }, 1000);
        }
        if (stderr) return debug(stderr);
        debug('---------- stdout --> ', stdout);
        let pid = stdout.split('=')[1];
        new net.Socket().connect(socket.port, socket.host)
        .on('connect', () => {
            debug('connect');
            self.triggered.connect = true;
            this.action = self._takeAction({pid}, target, opts);
        })
        .on('error', () => {
            debug('error');
            self.triggered.error = true;
            this.action.errorAction();
            self._pollSocket(socket, target, opts, callback);
        })
        .on('end', () => {
            debug('end');
            self.triggered.end = true;
            this.action.endAction();
            self._pollSocket(socket, target, opts, callback);
        });
    });            
}
Probe.prototype._takeAction = function(monitoredProcess, target, opts) {
    let errorAction,
        endAction;

    if (target === undefined) return;
    target.actions.map(action => {
        switch (action.name) {
            case 'nim':
                nim.open(monitoredProcess.pid, action.args.port);
                action.errorAction = () => { nim.close(); };
                action.endAction = () => { nim.close(); };
                return action; break;
        }
    });
    return {
        target,
        errorAction: function() {
            this.target.actions.map(action => action.errorAction());
        },
        endAction: function() {
            target.actions.map(action => action.endAction());
        }
    }
}
module.exports.Probe = Probe;