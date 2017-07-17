import { Reducer, combineReducers } from 'redux';
import todos, { TodosState } from './todos';

export interface State {
    todos: TodosState;
}

const rootReducer: Reducer<State> = combineReducers<State>({
    todos,
});

export default rootReducer;
