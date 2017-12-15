module.exports = (function() {
    require('server/globals');

    let port = process.env.PORT || 8008;
    let env = process.env.NODE_ENV || 'development';

    let server = require('./server/server.js')(inject({
        port,
        env
    }));

    server.startServer(function() {
        console.log('Server listening on port ' + port);
    });

})();
