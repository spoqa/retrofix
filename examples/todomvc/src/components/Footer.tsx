import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import * as classnames from 'classnames';

import TodoFilters from '../constants/TodoFilters';

const FILTER_TITLES = {
    [TodoFilters.SHOW_ALL]: 'All',
    [TodoFilters.SHOW_ACTIVE]: 'Active',
    [TodoFilters.SHOW_COMPLETED]: 'Completed',
};

const todoFilters = [
    TodoFilters.SHOW_ALL,
    TodoFilters.SHOW_ACTIVE,
    TodoFilters.SHOW_COMPLETED,
];

export interface FooterProps {
    activeCount: number;
    completedCount: number;
    filter: string;
    onShow: Function;
    onClearCompleted: Function;
};

export default class Footer extends Component<FooterProps> {
    static propTypes = {
        completedCount: PropTypes.number.isRequired,
        activeCount: PropTypes.number.isRequired,
        filter: PropTypes.string.isRequired,
        onClearCompleted: PropTypes.func.isRequired,
        onShow: PropTypes.func.isRequired
    };
    renderTodoCount() {
        const { activeCount } = this.props;
        const itemWord = activeCount === 1 ? 'item' : 'items';
        return (
            <span className="todo-count">
                <strong>{activeCount || 'No'}</strong> {itemWord} left
            </span>
        );
    }
    renderFilterLink(filter: string) {
        const title = FILTER_TITLES[filter];
        const { filter: selectedFilter, onShow } = this.props;
        return (
            <a
                className={classnames({ selected: filter === selectedFilter })}
                style={{ cursor: 'pointer' }}
                onClick={() => onShow(filter)}>
                {title}
            </a>
        );
    }
    renderClearButton() {
        const { completedCount, onClearCompleted } = this.props;
        return (completedCount > 0) && (
            <button
                className="clear-completed"
                onClick={() => onClearCompleted()}>
                Clear completed
            </button>
        );
    }
    render() {
        return (
            <footer className="footer">
                {this.renderTodoCount()}
                <ul className="filters">
                    {
                        todoFilters.map(filter => <li key={filter}>
                            { this.renderFilterLink(filter) }
                        </li>)
                    }
                </ul>
                {this.renderClearButton()}
            </footer>
        );
    }
}
