import React, {useState} from 'react';
import './App.css';
import Login from "../src/components/Login/Login";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/Register/Register";

const App = () => {
    const [token, setToken] = useState();
    const tokenLocalStorage = localStorage.getItem('token');

    console.log(!token)
    console.log(!tokenLocalStorage)
    if (!token && !tokenLocalStorage) {
        return (
            <div className="App">
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <Switch>
                            <Route exact path='/'>
                                <Login setToken={setToken}/>
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
                src="https://infinite-heroes.herokuapp.com/"
                width={window.innerWidth}
                height={window.innerWidth}
                scrolling="no"
            />
        </div>
    );
}

export default App;