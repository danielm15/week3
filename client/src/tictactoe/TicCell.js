import React from 'react';

export default function (injected) {
    const eventRouter = injected('eventRouter');
    const commandPort = injected('commandPort');
    const generateUUID = injected('generateUUID');

    class TictactoeMessage extends React.Component {
        constructor() {
            super();
            this.state = {
                move:{
                    xy: {
                        x: 0,
                        y: 0
                    },
                    side: 'X'
                }
            }
        }
        componentWillMount(){
            this.unsubscribe = eventRouter.on('MovePlaced', (moveEvent)=>{
            //    Key logic goes here. Remember---the cell gets all move events, not only its own.
                this.setState({
                    move: {
                        xy: {
                            x: moveEvent.xy.x,
                            y: moveEvent.xy.y
                        }
                    },
                    side: moveEvent.mySide
                });
            })
        }
        componentWillUnmount(){
            this.unsubscribe();
        }
        placeMove(coordinates){
            return ()=>{
                let cmdId = generateUUID();
                commandPort.routeMessage({
                    commandId:cmdId,
                    type:"PlaceMove",
                    gameId:this.props.gameId,
                    move:{
                        xy:coordinates,
                        side:this.props.mySide
                    }
                });
            }
        }
        render() {
            return <div ref="ticCell" className="ticcell" onClick={this.placeMove(this.props.coordinates)}>
                {this.state.move.side}
            </div>
        }
    }
    return TictactoeMessage;
}
