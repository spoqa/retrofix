import { ActionCreator } from 'redux';

import ActionTypes from '../constants/ActionTypes';

export interface ActionMap {
    [key: string]: ActionCreator<Action>;
}

export type Action
    = AddTodo
    | DeleteTodo
    | EditTodo
    | CompleteTodo
    | CompleteAll
    | ClearCompleted
    ;

export type AddTodo = { type: ActionTypes.ADD_TODO, text: string };
export type DeleteTodo = { type: ActionTypes.DELETE_TODO, id: number };
export type EditTodo = { type: ActionTypes.EDIT_TODO, id: number, text: string };
export type CompleteTodo = { type: ActionTypes.COMPLETE_TODO, id: number };
export type CompleteAll = { type: ActionTypes.COMPLETE_ALL };
export type ClearCompleted = { type: ActionTypes.CLEAR_COMPLETED };

export function addTodo(text: string): AddTodo {
    return { type: ActionTypes.ADD_TODO, text };
}
export function deleteTodo(id: number): DeleteTodo {
    return { type: ActionTypes.DELETE_TODO, id };
}
export function editTodo(id: number, text: string): EditTodo {
    return { type: ActionTypes.EDIT_TODO, id, text };
}
export function completeTodo(id: number): CompleteTodo {
    return { type: ActionTypes.COMPLETE_TODO, id };
}
export function completeAll(): CompleteAll {
    return { type: ActionTypes.COMPLETE_ALL };
}
export function clearCompleted(): ClearCompleted {
    return { type: ActionTypes.CLEAR_COMPLETED };
}
