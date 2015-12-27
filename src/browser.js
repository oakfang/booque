import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MainPage from './components/main-page';

injectTapEventPlugin();

function renderApp() {
  ReactDOM.render(
    <MainPage />,
    document.getElementById('holder')
  );
}

renderApp();
