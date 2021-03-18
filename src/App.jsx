import React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import './assets/styles/style.css';
import Route from './routes';

function App() {
    return (
        <Provider store = {store}>
           <Route />
        </Provider>
    );
}

export default App;