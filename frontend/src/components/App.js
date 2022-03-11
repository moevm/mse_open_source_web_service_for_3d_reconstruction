import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./MainPage";
import AuthPage from "./AuthPage";

import signInCreator from "../store/actionCreators/signInCreator";
import NotFoundPage from "./NotFoundPage";
import {createStore} from "redux";
import authReducer from "../store/reducers/authReducer";
import store from "../store/store";
import RequireAuth from "./RequireAuth";


class App extends React.Component {
    render(){
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage display={"info"}/>} />
                    <Route path="/signin" element={<AuthPage login={
                        (value) => {
                            store.dispatch(signInCreator(value));
                        }
                    } mode={'signin'}/>} />
                    <Route path="/signup" element={<AuthPage login={
                        (value) => {
                            store.dispatch(signInCreator(value));
                        }
                    } mode={'signup'}/>} />
                    <Route path="/main/authorized" element={
                        <RequireAuth>
                            <MainPage display={"action"}/>
                        </RequireAuth>
                    } />
                    <Route path="/*" element={<NotFoundPage/>} />
                </Routes>
            </BrowserRouter>
        );
    }
}



export default App;