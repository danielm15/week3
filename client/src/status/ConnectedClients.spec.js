import ConnectedClientsModule from './ConnectedClients';
import React from 'react';
import { shallow } from 'enzyme';

describe("Connected socket clients component", function () {

    let div, component;

    let socket = {
        listeners:{},

        on: function(event, callback){
            socket.listeners[event] = callback;
        }
    };
    let ConnectedClients;

    beforeEach(function () {
        ConnectedClients = ConnectedClientsModule(inject({
            socket
        }));
        div = document.createElement('div');
        component = shallow(<ConnectedClients />, div);
    });

    it('should render without error', function () {

    });

    it('should subscribe to stats message', function(){
        expect(socket.listeners['stats']).toBeTruthy();
    });

    it('should render number of clients reported in stats', function(){
        socket.listeners['stats']({
            numClients:99
        });
        expect(component.text()).toContain('99 connected clients');
    });
});
