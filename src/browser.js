import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import store from './store';
import MainPage from './components/main-page';

injectTapEventPlugin();

function renderApp() {
  ReactDOM.render(
    <Provider store={store}>
        <MainPage />
    </Provider>,
    document.getElementById('holder')
  );
}

renderApp();
