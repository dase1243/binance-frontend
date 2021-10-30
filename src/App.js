import React from 'react';
import './App.css';
import Login from "../src/components/Login/Login";
import {Switch, Route, Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/Register/Register";
import TokenMint from "./components/TokenMint/TokenMint";

const App = () => {
    const [token, setToken] = React.useState();
    const [email, setEmail] = React.useState(localStorage.getItem('email'));
    const tokenLocalStorage = localStorage.getItem('token');

    React.useEffect(() => {
        window.addEventListener("message", receiveMessage);

        function receiveMessage(event) {
            if (event.origin.includes("infinite-heroes.herokuapp.com") || event.origin.includes("localhost:3000")) {
                if (event.data.printingEvent) {
                    window.open(`/tokenMint?modelId=${event.data.modelId}`, "_blank")
                }
            }
        }
    }, [])

    if (!token && !tokenLocalStorage) {
        // if (!token) {
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
                            <Route exact path='/*'>
                                <div className='app__login_alert'>
                                    <div className="alert alert-danger text-break mb-3" role="alert">
                                        Please Login to see the page
                                    </div>
                                    <Link className="btn btn-primary" to={"/login"}>
                                        Login
                                    </Link>
                                </div>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Switch>
            <Route exact path='/'>
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
            </Route>
            <Route exact path='/tokenMint'>
                <div className="App">
                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <TokenMint/>
                        </div>
                    </div>
                </div>
            </Route>
        </Switch>
    );
}

export default App;