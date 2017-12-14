import React from 'react';
import { shallow } from 'enzyme';

import TicCellComponent from './TicCell';


import MessageRouter from '../common/framework/message-router';


describe("Tic Cell", function () {

    let div, component, TicCell;

    let commandRouter = MessageRouter(inject({}));
    let eventRouter = MessageRouter(inject({}));
    let commandsReceived=[];

    commandRouter.on("*", function(cmd){
        commandsReceived.push(cmd);
    } );

    beforeEach(function () {
        commandsReceived.length=0;
        TicCell = TicCellComponent(inject({
            generateUUID:()=>{
                return "youyouid"
            },
            commandPort: commandRouter,
            eventRouter
        }));

        div = document.createElement('div');

        component = shallow(<TicCell coordinates={{x:1,y:2}} gameId="thegame" />, div);
    });


    it('should render without error', function () {

    });

    it('should do more stuff', function () {

    })

});
