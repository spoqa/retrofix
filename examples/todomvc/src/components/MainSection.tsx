import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';

import TodoItem from './TodoItem';
import Footer from './Footer';
import * as TodoActions from '../actions';
import TodoFilters from '../constants/TodoFilters';
import { Todo } from '../types';

const TODO_FILTERS = {
    [TodoFilters.SHOW_ALL]: () => true,
    [TodoFilters.SHOW_ACTIVE]: (todo: Todo) => !todo.completed,
    [TodoFilters.SHOW_COMPLETED]: (todo: Todo) => todo.completed
}

export interface MainSectionProps {
    todos: Array<Todo>;
    actions: typeof TodoActions;
}

export interface MainSectionState {
    filter: string;
}

export default class MainSection extends Component<MainSectionProps, MainSectionState> {
    static propTypes = {
        todos: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired,
    };
    state = { filter: TodoFilters.SHOW_ALL };
    handleClearCompleted = () => {
        this.props.actions.clearCompleted();
    };
    handleShow = (filter: string) => {
        this.setState({ filter });
    };
    renderToggleAll(completedCount: number) {
        const { todos, actions } = this.props;
        return (todos.length > 0) && <input
            className="toggle-all"
            type="checkbox"
            checked={completedCount === todos.length}
            onChange={actions.completeAll}
        />;
    }
    renderFooter(completedCount: number) {
        const { todos } = this.props;
        const { filter } = this.state;
        const activeCount = todos.length - completedCount;
        return (todos.length > 0) && <Footer
            completedCount={completedCount}
            activeCount={activeCount}
            filter={filter}
            onClearCompleted={this.handleClearCompleted}
            onShow={this.handleShow}
        />;
    }
    render() {
        const { todos, actions } = this.props;
        const { filter } = this.state;
        const filteredTodos = todos.filter(TODO_FILTERS[filter]);
        const completedCount = todos.reduce(
            (count, todo) => todo.completed ? count + 1 : count,
            0,
        );
        return (
            <section className="main">
                { this.renderToggleAll(completedCount) }
                    <ul className="todo-list">
                        {
                            filteredTodos.map(
                                todo => <TodoItem key={todo.id} todo={todo} { ...actions }/>
                            )
                        }
                    </ul>
                { this.renderFooter(completedCount) }
            </section>
        )
    }
}
