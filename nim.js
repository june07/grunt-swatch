'use strict';

const debug = require('debug')('swatch:nim'),
    { exec } = require('child_process');

function open(pid, port, host, wait) {
    port = port || 9229;
    host = host || 'localhost';

    let inspector = exec('/bin/kill -SIGUSR1 ' + pid, (error, stdout, stderr) => {
        if (error) return debug(error);
        if (stderr) return debug(stderr);
        debug('---------- stdout --> ', stdout);
    });
}
function close() {
    debug('remote close');
}

module.exports = {
    open,
    close
}