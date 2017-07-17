import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';

import TodoTextInput from './TodoTextInput';

export interface HeaderProps {
    addTodo: (text: string) => void;
};

export default class Header extends Component<HeaderProps> {
    static propTypes = {
        addTodo: PropTypes.func.isRequired,
    };
    handleSave = (text: string) => {
        if (text.length !== 0) {
            this.props.addTodo(text);
        }
    };
    render() {
        return (
            <header className="header">
                <h1>todos</h1>
                <TodoTextInput
                    newTodo
                    onSave={this.handleSave}
                    placeholder="What needs to be done?"
                />
            </header>
        );
    }
}
