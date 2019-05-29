import React from 'react';
import './App.css';
import Meeting from './modules/Meeting/index'
import Reducer from './store/Reducer';
import { createRenderer } from 'fela'
import { Provider as FelaProvider } from 'react-fela';
import { Provider } from 'react-redux';
import { createStore } from 'redux';


const renderer = createRenderer()


const initialState = {}
const store = createStore(Reducer,initialState)

const styles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
}
function App() {
  return (
    <div className="App" style={styles}>
    <Provider store={store}>
    <FelaProvider renderer={renderer}>  
      <Meeting/>
    </FelaProvider>
    </Provider>
    </div>
  );
}

export default App;
