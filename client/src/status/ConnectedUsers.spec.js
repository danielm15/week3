import ReactDOM from 'react-dom';
import React from 'react';
import {shallow} from 'enzyme';

import ConnectedUsersModule from './ConnectedUsers';
import FakeSocket from '_test/fakeSocket';

describe('Connected users - socket io', function () {

    let div, component;

    let socket = FakeSocket();

    let ConnectedUsers, currentUserTracker;

    beforeEach(function () {
        currentUserTracker = {
            getUserId: function () {
                return currentUserTracker.userId;
            },
            setUserId: function (userId) {
                currentUserTracker.userId = userId;
            }
        };

        ConnectedUsers = ConnectedUsersModule(inject({
            socket,
            currentUserTracker
        }));

        div = document.createElement('div');
        component = shallow(<ConnectedUsers />, div);


    });

    it('should subscribe to sessionJoined', function () {
        expect(socket.listeners['sessionJoined']).toBeTruthy();
    });

    it('should subscribe to sessionAck', function () {
        expect(socket.listeners['sessionAck']).toBeTruthy();
    });

    it('should subscribe to sessionDisconnected', function () {
        expect(socket.listeners['sessionDisconnected']).toBeTruthy();
    });

    it('should subscribe to sessionChanged', function () {
        expect(socket.listeners['sessionChanged']).toBeTruthy();
    });

    it('should subscribe to sessionsConnected', function () {
        expect(socket.listeners['sessionsConnected']).toBeTruthy();
    });

    it('should render users when sessionsConnected', function () {
        socket.listeners['sessionsConnected']({
            "1": {"clientId": 1, user: {"userId": 99, "userName": "Newbie#1"}},
            "2": {"clientId": 2, "user": {"userId": 88, "userName": "Newbie#2"}}
        });

        expect(component.text()).toContain('Newbie#1');
        expect(component.text()).toContain('Newbie#2');

    });

    it('should remove user when sessionDisconnected', function () {
        socket.listeners['sessionsConnected']({
            "1": {"clientId": 1, user: {"userId": 99, "userName": "Newbie#1"}},
            "2": {"clientId": 2, "user": {"userId": 88, "userName": "Newbie#2"}}
        });
        socket.listeners['sessionDisconnected']({"clientId": 1});

        expect(component.text()).not.toContain('Newbie#1');
    });

    it('should render allocated user name when sessionAck', function () {
        socket.listeners['sessionAck']({"clientId": 1, user: {"userId": 99, "userName": "Newbie#1"}});

        expect(component.find('input').props().value).toContain('Newbie#1');
    });

    it('should update user when sessionChanged', function () {
        socket.listeners['sessionsConnected']({
            "1": {"clientId": 1, user: {"userId": 1, "userName": "Newbie#1"}},
            "2": {"clientId": 2, "user": {"userId": 88, "userName": "Newbie#2"}}
        });
        socket.listeners['sessionChanged']({"clientId": 1, user: {"userId": 1, "userName": "Not new any more"}});

        expect(component.text()).toContain('Not new any more');
    });

    it('should track current user on session ack', function () {
        socket.listeners['sessionAck']({"clientId": 1, user: {"userId": 99, "userName": "Newbie#1"}});
        expect(currentUserTracker.userId).toEqual(99);
    });

    it('should reconnect current user after session ack', function () {
        currentUserTracker.userId=44;
        socket.listeners['sessionAck']({"clientId": 1, user: {"userId": 99, "userName": "Newbie#1"}});
        expect(currentUserTracker.userId).toEqual(44);

        expect(socket.emitted[0].verb).toEqual("reconnectUser");

    })

});
