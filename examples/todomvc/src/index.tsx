import * as React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'retrofix';
import App from './containers/App';
import reducer from './reducers';
import 'todomvc-app-css/index.css';

const store = createStore(reducer);

render(
    <Provider store={store} sideEffects={{}}>
        <App/>
    </Provider>,
    document.getElementById('root'),
    () => {},
);
