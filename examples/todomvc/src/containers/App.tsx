import * as React from 'react';
import {
    bindActionCreators,
    Dispatch,
} from 'redux';
import { connect } from 'retrofix';

import Header from '../components/Header';
import MainSection from '../components/MainSection';
import { ActionMap } from '../actions';
import * as Actions from '../actions';
import { Todo } from '../types';

const App = ({todos, actions}: {todos: Array<Todo>, actions: typeof Actions}) => (
    <div>
        <Header addTodo={actions.addTodo} />
        <MainSection todos={todos} actions={actions} />
    </div>
);

export default connect(
    ({ todos }) => ({ todos }),
    ({ ownProps, getSelectedState, dispatch }) => ({
        ...ownProps,
        ...getSelectedState(),
        actions: bindActionCreators<ActionMap>(
            Actions as any as ActionMap,
            dispatch as any as Dispatch<any>
        ),
    }),
)(App);
