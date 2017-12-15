const inject = require('./common/framework/inject');
const WebSocketModule =  require('./io/webSocket');
const MessageRouter = require('./common/framework/message-router');

const IncomingSocketMessageDispatcherModule = require('./common/framework/incoming-socket-message-dispatcher');
const OutgoingSocketIoMessagePortModule = require('./common/framework/outgoing-socket-io-message-port');


function routingContext(injected){

    const eventRouter = MessageRouter();
    const commandRouter = MessageRouter();
    const queryRouter = MessageRouter();

    const incomingEventLogger = injected('incomingEventLogger', true);
    const outgoingCommandLogger = injected('outgoingCommandLogger', true);

    const environment = injected('env');
    let socketURI;
    if(environment==='development' || environment==='test'){
        socketURI='http://localhost:8008'
    } else {
        socketURI='/'
    }

    const io = injected('io');
    const socket = WebSocketModule(inject({
        io,
        socketURI:socketURI
    }));

    const incomingSocketEventDispatcher = IncomingSocketMessageDispatcherModule(
        inject({
            socketIoVerb:'eventIssued',
            messageRouter:eventRouter,
            incomingMessageLogger:incomingEventLogger
        })
    );
    const incomingSocketQueryDispatcher = IncomingSocketMessageDispatcherModule(
        inject({
            socketIoVerb:'queryResult',
            messageRouter:queryRouter,
            outgoingMessageLogger: outgoingCommandLogger
        })
    );

    const outgoingSocketIoMessagePort = OutgoingSocketIoMessagePortModule(
        inject({
            io:socket,
            messageRouter:commandRouter
        })
    );

    outgoingSocketIoMessagePort.dispatchThroughIo('*','issueCommand');
    incomingSocketEventDispatcher.startDispatching(socket);
    incomingSocketQueryDispatcher.startDispatching(socket);

    let exports = {
        eventRouter,
        commandRouter,
        queryRouter,
        socket
    };
    return exports;

}

module.exports = routingContext;
