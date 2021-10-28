import React from 'react';
import './App.css';
import Login from "../src/components/Login/Login";
import {Switch, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/Register/Register";

const App = () => {
    const [token, setToken] = React.useState();
    const [email, setEmail] = React.useState();
    const tokenLocalStorage = localStorage.getItem('token');

    if (!token && !tokenLocalStorage) {
        return (
            <div className="App">
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <Switch>
                            <Route exact path='/'>
                                <Login setToken={setToken} setEmail={setEmail}/>
                            </Route>
                            <Route exact path='/login'>
                                <Login setToken={setToken}/>
                            </Route>
                            <Route exact path='/register'>
                                <Register/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="wrapper">
            <iframe
                onLoad={() => {
                    let iframe = document.getElementById('my_iframe').contentWindow;
                    iframe.postMessage(email, "*");
                }}
                id="my_iframe"
                src="https://infinite-heroes.herokuapp.com/"
                width={window.innerWidth}
                height={window.innerWidth}
                scrolling="no"
            />
        </div>
    );
}

export default App;