import TictactoeBoardModule from './TictactoeBoard';
import ReactDOM from 'react-dom';
import React from 'react';
import { shallow } from 'enzyme';

import TicCellComponent from '../_test/FakeView';

describe("Tictactoe board", function () {

    let div, component, TicCell;

    let TictactoeBoard;

    beforeEach(function () {
        TicCell = TicCellComponent(inject({}));

        TictactoeBoard = TictactoeBoardModule(inject({
            TicCell
        }));

        div = document.createElement('div');
        component = shallow(<TictactoeBoard />, div);
    });

    it('should render without error', function () {

    });

    it('should render 9 cells',function(){
        expect(component.find(TicCell).length).toBe(9);
    });

    it('should pass coordinates to cell one', function(){
        expect(JSON.stringify(component.find(TicCell).nodes[0].props.coordinates)).toBe(JSON.stringify({x:0, y:0}));
    });


    it('should pass coordinates to cell three', function(){
        expect(JSON.stringify(component.find(TicCell).nodes[2].props.coordinates)).toBe(JSON.stringify({x:2, y:0}));
    });

    it('should pass coordinates to cell nine', function(){
        expect(JSON.stringify(component.find(TicCell).nodes[8].props.coordinates)).toBe(JSON.stringify({x:2, y:2}));
    });

});
