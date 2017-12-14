function serverModule(injected) {

    let ENV = injected('env');
    let PORT = injected('port');

    const config = require('./config.js')[ENV];

    const Express = require('express');
    const Session = require('express-session');
    const BodyParser = require('body-parser');
    const Path = require('path');
    const SocketIo = require('socket.io');
    const Postgres = require('./db/postgres');
    const DbConfig = require('./database.json');

    const dbConfig = DbConfig[process.env.DB_ENV || 'dev'];

    const ChatAppContext = require('./socket-app/server-app-context');

    return {
        startServer: function(CALLBACK){

            const CookieParser = require('cookie-parser');
            let app = Express();

            const sessionOpts = {
                secret: config.sessionSecret,
                resave: true,
                saveUninitialized: true
            };

            const dbPool = Postgres(inject({config: dbConfig})).pool;

            // Define where our static files will be fetched from:
            app.use(Express.static(Path.join(__dirname, '..', 'static')));

            app.use(BodyParser.json());
            app.use(BodyParser.urlencoded({ extended: true }));

            const cookieParser = CookieParser(config.sessionSecret);
            app.use(cookieParser);

            app.use(Session(sessionOpts));

            require('./http-routes/api')(
                inject({app})
            );

            app.get('/*', function (req, res) {
                // Render index.html in all cases and pass route handling to react
                res.sendFile(Path.join(__dirname,'static','index.html'));
            });

            const server = app.listen(PORT, CALLBACK);
            const io = SocketIo(server);

          //  SocketSessionManager(inject({io}));
            ChatAppContext(inject({io, dbPool}));

        }
    }
}

module.exports=serverModule;
