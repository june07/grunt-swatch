'use strict';

const debug = require('debug')('swatch:probe'),
    EE = require('events').EventEmitter,
    net = require('net'),
    { exec } = require('child_process'),

    inspector = require('./remoteInspector');

// Disable verbose probe logging unless SWATCH_PROBE is true
if (! process.env.SWATCH_PROBE) require('debug').disable();

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
            debug('connected');
            this.action = self._takeAction({pid}, target, opts);
        })
        .on('error', () => {
            debug('error');
            this.action.errorAction();
            self._pollSocket(socket, target, opts, callback);
        })
        .on('end', () => {
            debug('disconnect');
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
            case 'inspector':
                inspector.open(monitoredProcess.pid, action.args.port);
                action.errorAction = () => { inspector.close(); };
                action.endAction = () => { inspector.close(); };
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