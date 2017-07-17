import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import * as classnames from 'classnames';

import TodoTextInput from './TodoTextInput';
import { Todo } from '../types';

export interface TodoItemProps {
    todo: Todo;
    editTodo: (id: number, text: string) => void;
    deleteTodo: (id: number) => void;
    completeTodo: (id: number) => void;
}

export interface TodoItemState {
    editing: boolean;
}

export default class TodoItem extends Component<TodoItemProps, TodoItemState> {
    static propTypes = {
        todo: PropTypes.object.isRequired,
        editTodo: PropTypes.func.isRequired,
        deleteTodo: PropTypes.func.isRequired,
        completeTodo: PropTypes.func.isRequired,
    }
    state = { editing: false };
    handleDoubleClick = () => {
        this.setState({ editing: true });
    };
    handleSave = (id: number, text: string) => {
        if (text.length === 0) {
            this.props.deleteTodo(id);
        } else {
            this.props.editTodo(id, text);
        }
        this.setState({ editing: false });
    };
    render() {
        const { todo, completeTodo, deleteTodo } = this.props;
        return (
            <li className={classnames({
                completed: todo.completed,
                editing: this.state.editing,
            })}>
                {
                    this.state.editing ?
                    <TodoTextInput
                        text={todo.text}
                        editing={this.state.editing}
                        onSave={(text: string) => this.handleSave(todo.id, text)}
                    /> :
                    <div className="view">
                        <input
                            className="toggle"
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => completeTodo(todo.id)}
                        />
                        <label onDoubleClick={this.handleDoubleClick}>
                            {todo.text}
                        </label>
                        <button
                            className="destroy"
                            onClick={() => deleteTodo(todo.id)}
                        />
                    </div>
                }
            </li>
        );
    }
}
