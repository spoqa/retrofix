import { Action } from '../actions';
import ActionTypes from '../constants/ActionTypes';
import { Todo } from '../types';

export type TodosState = Array<Todo>;

const initialState: TodosState = [
    {
        text: 'Use Retrofix',
        completed: false,
        id: 0,
    },
];

export default function todos(state = initialState, action: Action): TodosState {
    switch (action.type) {
        case ActionTypes.ADD_TODO:
            return [
                {
                    id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
                    completed: false,
                    text: action.text,
                },
                ...state,
            ];
        case ActionTypes.DELETE_TODO:
            return state.filter(todo => todo.id !== action.id);
        case ActionTypes.EDIT_TODO:
            return state.map(todo =>
                todo.id === action.id ?
                { ...todo, text: action.text } :
                todo
            );
        case ActionTypes.COMPLETE_TODO:
            return state.map(todo =>
                todo.id === action.id ?
                { ...todo, completed: !todo.completed } :
                todo
            );
        case ActionTypes.COMPLETE_ALL:
            const areAllMarked = state.every(todo => todo.completed)
            return state.map(todo => ({
                ...todo,
                completed: !areAllMarked,
            }));
        case ActionTypes.CLEAR_COMPLETED:
            return state.filter(todo => todo.completed === false);
        default:
            return state;
    }
}
