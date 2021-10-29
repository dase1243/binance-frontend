import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import './Register.css';
import {Link, useHistory} from 'react-router-dom'
import Web3 from 'web3'

export default function Register() {
    let history = useHistory();

    const [formState, setFormState] = React.useState({
        firstnameInput: '',
        lastnameInput: '',
        usernameInput: '',
        emailInput: '',
        passwordInput: '',
        passwordRepeatInput: '',
        rememberStatusInput: false
    })

    useEffect(() => {
        const web3 = window.ethereum;
        if (!web3) {
            setMetamaskConnection((_) => false)
        }
    });

    const [formAlert, setFormAlert] = React.useState({
        message: '',
        status: false
    });
    const [metamaskConnection, setMetamaskConnection] = React.useState(false);
    const [metamaskChosenAddress, setMetamaskChosenAddress] = React.useState(false);

    useEffect(() => {
        window.addEventListener('load', async () => {
            // Wait for loading completion to avoid race conditions with web3 injection timing.
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);

                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    // Accounts now exposed
                    setMetamaskConnection((_) => true);
                    await web3.eth.getAccounts()
                        .then(data => setMetamaskChosenAddress((_) => data[0]));
                    return web3;
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }, [])

    const onChangeInput = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        })
    }

    async function registerUser(newUserBody) {
        return fetch('https://binance-hack.herokuapp.com/api/user/register', {
        // return fetch('http://localhost:5000/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUserBody)
        })
            .then(data => data.json())
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const {success, message} = await registerUser({
            firstname: formState.firstnameInput,
            lastname: formState.lastnameInput,
            username: formState.usernameInput,
            email: formState.emailInput,
            password: formState.passwordInput,
            password_repeat: formState.passwordRepeatInput,
        });

        console.log(message)
        if (success) {
            history.push("/login");
            alert("success. Please login with your credentials")
        } else {
            setFormAlert({
                message,
                status: true
            })
        }
    }

    return (
        <div>
            <form className="mb-3" onSubmit={handleSubmit}>
                <h3>Register</h3>

                <div className="mb-3">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            onChange={onChangeInput}
                            type="text"
                            name="firstnameInput"
                            className="form-control"
                            placeholder="Enter firstname"
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            onChange={onChangeInput}
                            type="text"
                            name="lastnameInput"
                            className="form-control"
                            placeholder="Enter lastname"
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            onChange={onChangeInput}
                            type="text"
                            name="usernameInput"
                            className="form-control"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <div className="form-group">
                        <label>Email address</label>
                        <input
                            onChange={onChangeInput}
                            type="email"
                            name="emailInput"
                            className="form-control"
                            placeholder="Enter email"
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            onChange={onChangeInput}
                            type="password"
                            name="passwordInput"
                            className="form-control"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <div className="form-group">
                        <label>Repeat your password</label>
                        <input
                            onChange={onChangeInput}
                            type="password"
                            name="passwordRepeatInput"
                            className="form-control"
                            placeholder="Re-enter password"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!metamaskConnection}
                    className="btn btn-primary btn-block mb-3"
                >
                    Submit
                </button>

                {metamaskConnection ?
                    <div className="alert alert-success text-break" role="alert">
                        Metamask is connected. Address: {metamaskChosenAddress}
                    </div> :
                    <div className="alert alert-danger text-break" role="alert">
                        Please connect you Metamask Account
                    </div>}
                {formAlert.status ?
                    <div className="alert alert-danger text-break" role="alert">
                        {formAlert.message}
                    </div>
                    : <></>}
            </form>
            <Link to={"/login"}>
                Login
            </Link>
        </div>
    );
}