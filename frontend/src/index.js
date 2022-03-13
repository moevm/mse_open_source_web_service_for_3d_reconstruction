import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,
        Route,
        Routes} from "react-router-dom";

import './index.css';
import { createStore, configureStore } from 'redux';
import MainPage from './components/MainPage'
import reportWebVitals from './reportWebVitals';
import NotFoundPage from "./components/NotFoundPage";
import AuthPage from "./components/AuthPage";
import signInCreator from "./store/actionCreators/signInCreator";
import App from "./components/App";
import authReducer from "./store/reducers/authReducer";

const render = () => ReactDOM.render(
  <React.StrictMode>
      <App/>
      {/*<BrowserRouter>
          <Routes>
              <Route path="/" element={<MainPage display={"info"}/>} />
              <Route path="/signin" element={<AuthPage login={
                  (value) => {
                      store.dispatch(signInCreator(value));
                  }
              } mode={'signin'}/>} />
              <Route path="/signup" element={<AuthPage mode={'signup'}/>} />
              <Route path="/main/authorized" element={<MainPage display={"action"}/>} />
              <Route path="/*" element={<NotFoundPage/>} />
          </Routes>
      </BrowserRouter>*/}
  </React.StrictMode>,
  document.getElementById('root')
);

render();



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
