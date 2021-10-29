import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import {Link} from 'react-router-dom'

export default function Login({setToken, setEmail}) {

    const [formState, setFormState] = React.useState({
        emailInput: '',
        passwordInput: '',
        rememberStatusInput: false
    })

    const [formAlert, setFormAlert] = React.useState({
        message: '',
        status: false
    });

    const onChangeInput = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        })
    }

    async function loginUser(credentials) {
        return fetch('https://binance-hack.herokuapp.com/api/user/login', {
        // return fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
            .then(data => data.json())
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
            email: formState.emailInput,
            password: formState.passwordInput
        });

        console.log(response)

        const {isAuth, message} = response
        if (isAuth) {
            localStorage.setItem('token', JSON.stringify(response));
            console.log("formState: ", formState);
            setToken(response);
            setEmail(formState.emailInput)
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
                <h3>Login</h3>

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

                <button
                    type="submit"
                    className="btn btn-primary btn-block mb-3"
                >
                    Submit
                </button>
                {formAlert.status ?
                    <div className="alert alert-danger text-break" role="alert">
                        {formAlert.message}
                    </div>
                    : <></>}
            </form>
            <Link to={"./register"}>
                Register
            </Link>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}