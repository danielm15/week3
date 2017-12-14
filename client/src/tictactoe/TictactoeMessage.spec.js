import React from 'react';
import { shallow } from 'enzyme';

import MessageComponent from './TictactoeMessage';

import MessageRouter from '../common/framework/message-router';

describe("Game message rendering", function () {

    let div, component, TictactoeMessage;

    let eventRouter = MessageRouter(inject({}));

    beforeEach(function () {
        TictactoeMessage = MessageComponent(inject({
            eventRouter
        }));

        div = document.createElement('div');

        component = shallow(<TictactoeMessage/>, div);
    });


    function given() {
        //noinspection JSUnusedAssignment
        let side, xy, gameId="thegame";
        let api = {
            side(aside){
                side = aside;
                return api;
            },
            gameId(agameId){
                gameId=agameId;
                return api;
            },
            xy(axy){
                xy = axy;
                return api;
            },
            xy(axy){
                xy = axy;
                return api;
            },
            placed(){
                eventRouter.routeMessage({
                    type: "MovePlaced",
                    gameId: gameId,
                    move: {
                        side: side,
                        xy: xy
                    }
                });
                return api;
            }
        };
        return api;

    }

    it('should render message type',function(){
        given().gameId("someOtherGame").side("O").xy({x:1, y:2}).placed();
        expect(component.text()).toBe("MovePlaced");
    });

});
