import React from 'react';
import './App.css';
import Meeting from './modules/Meeting/index'
import Reducer from './store/Reducer';


import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
const initialState = {}
const store = createStore(Reducer,initialState)
console.log(store)
function App() {
  return (
    <div className="App">
    <Provider store={store}>
     <Meeting/>
    </Provider>
    </div>
  );
}

export default App;
