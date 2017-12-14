import React from 'react';
import _ from 'lodash';

export default function (injected) {
    const TictactoeBoard = injected('TictactoeBoard');
    const TictactoeMessage = injected('TictactoeMessage');

    const commandPort = injected('commandPort');
    const eventRouter = injected('eventRouter');
    const queryRouter = injected('queryRouter');

    const generateUUID = injected('generateUUID');

    const socket = injected('socket');

    const currentUserTracker = injected('currentUserTracker');
    const currentGameTracker = injected('currentGameTracker');

    class TictactoeGame extends React.Component {
        constructor() {
            super();
            this.state = {
                currentGame: {},
                openGames: {}
            }
        }

        //noinspection JSUnusedGlobalSymbols
        componentWillMount() {

            socket.on('sessionAck', (userSession) => {
                this.setState({session: userSession});
            });

            socket.on('sessionChanged', (changedSession) => {
                if (changedSession.clientId === this.state.session.clientId) {
                    this.setState({session: changedSession});
                }
            });


            const gameJoined = (gameJoined) => {

                // String on one side, integer on the other, hence == below.
                //noinspection EqualityComparisonWithCoercionJS
                //eslint-disable-next-line
                if (currentUserTracker.getUserId() == gameJoined.userSession.user.userId) {
                    this.setState({
                        currentGame: {
                            gameId: gameJoined.gameId,
                            side: gameJoined.side
                        }
                    });
                }


                let openGames = this.state.openGames;
                delete openGames[gameJoined.gameId];
                currentGameTracker.join(gameJoined.gameId);
                this.setState({
                    openGames: openGames
                })


            };

            const gameCreated = (gameCreated) => {
                gameJoined(gameCreated);

                let openGames = this.state.openGames;
                if (this.state.session.user.userId !== gameCreated.userSession.user.userId) {
                    // Game that someone else created, add to open games.
                    openGames[gameCreated.gameId] = gameCreated;
                    this.setState({
                        openGames: openGames
                    });
                }
            };


            const gameLeft = () => {
                currentGameTracker.leave();
                this.setState({
                    currentGame: {}
                })
            };

            eventRouter.on('GameJoined', gameJoined);
            eventRouter.on('GameCreated', gameCreated);
            eventRouter.on('GameLeft', gameLeft);

            queryRouter.on('GameHistory', function (gameHistory) {
                _.each(gameHistory.resultSet, function (event) {
                    eventRouter.routeMessage(event);
                });
            });


            queryRouter.on('OpenGamesResult', (resultMessage) => {
                _.each(resultMessage.resultSet, function (event) {
                    if (event.type === 'GameCreated') {
                        gameCreated(event);
                    }
                });
            });
            if (currentGameTracker.joined()) {
                commandPort.routeMessage({
                    commandId: generateUUID(),
                    type: "RequestGameHistory",
                    gameId: currentGameTracker.gameId()
                });

            } else {
                commandPort.routeMessage({
                    commandId: generateUUID(),
                    type: "RequestOpenGames"
                });
            }
        }

        createGame() {
            let cmdId = generateUUID();
            commandPort.routeMessage({
                commandId: cmdId,
                type: "CreateGame",
                gameId: generateUUID()
            });
        }

        leaveGame() {
            let cmdId = generateUUID();
            commandPort.routeMessage({
                commandId: cmdId,
                type: "LeaveGame",
                gameId: generateUUID()
            });
        }

        joinGame(game) {
            return () => {
                let cmdId = generateUUID();
                commandPort.routeMessage({
                    commandId: cmdId,
                    type: "JoinGame",
                    gameId: game.gameId
                });
            }
        }

        render() {
            let openGames = _.map(this.state.openGames, (openGame, idx) => {
                return <div key={idx}>
                    <span>{openGame.userSession.user.userName}</span>
                    <button type="button" onClick={this.joinGame(openGame)}> Join</button>
                </div>
            });

            let gameView = <div>
                <button type="button" onClick={this.createGame}>Create new game</button>
                <h2>Open games:</h2>
                {openGames}
            </div>;

            if (this.state.currentGame.gameId) {
                gameView = <div>
                    <button type="button" onClick={this.leaveGame}>Leave</button>
                    <TictactoeBoard gameId={this.state.currentGame.gameId}
                                    mySide={this.state.currentGame.side}></TictactoeBoard>
                    <TictactoeMessage></TictactoeMessage>
                </div>

            }
            return (<div className="TictactoeGame">
                {gameView}
            </div>);
        }
    }

    return TictactoeGame;
}
