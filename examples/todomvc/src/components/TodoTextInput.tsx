import * as React from 'react';
import {
    Component,
    ChangeEvent,
    FocusEvent,
    KeyboardEvent,
} from 'react';
import * as PropTypes from 'prop-types';
import * as classnames from 'classnames';

export interface TodoTextInputProps {
    onSave: Function;
    text?: string;
    placeholder?: string;
    editing?: boolean;
    newTodo?: boolean;
}

export interface TodoTextInputState {
    text: string;
}

export default class TodoTextInput extends Component<TodoTextInputProps, TodoTextInputState> {
    static propTypes = {
        onSave: PropTypes.func.isRequired,
        text: PropTypes.string,
        placeholder: PropTypes.string,
        editing: PropTypes.bool,
        newTodo: PropTypes.bool
    };
    state = { text: this.props.text || '' };
    handleSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
        const text = (e.target as HTMLInputElement).value.trim();
        if (e.which === 13) {
            this.props.onSave(text);
            if (this.props.newTodo) {
                this.setState({ text: '' });
            }
        }
    };
    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ text: e.target.value });
    };
    handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        if (!this.props.newTodo) {
            this.props.onSave((e.target as HTMLInputElement).value);
        }
    };
    render() {
        return (
            <input
                className={classnames({
                    edit: this.props.editing,
                    'new-todo': this.props.newTodo,
                })}
                type="text"
                placeholder={this.props.placeholder}
                autoFocus
                value={this.state.text}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
            />
        );
    }
}
