import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import {Link} from 'react-router-dom'

export default function Login({setToken}) {

    const [formState, setFormState] = React.useState({
        emailInput: '',
        passwordInput: '',
        rememberStatusInput: false
    })

    // useEffect(() => {
    //     console.log(formState)
    // }, [formState])

    const onChangeInput = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        })
    }

    async function loginUser(credentials) {
        return fetch('https://binance-hack.herokuapp.com/api/login', {
        // return fetch('http://localhost:5000/api/login', {
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
            setToken(response);
            localStorage.setItem('token', JSON.stringify(response));
            localStorage.setItem('email', JSON.stringify(formState.emailInput));
        } else {
            alert(message)
        }
    }

    return (
        <div>
            <form className="mb-3" onSubmit={handleSubmit}>
                <h3>Login</h3>

                <div className="mb-3">
                    <div className="form-group">
                        <label>Email address</label>
                        <input onChange={onChangeInput} type="email" name="emailInput" className="form-control"
                               placeholder="Enter email"/>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="form-group">
                        <label>Password</label>
                        <input onChange={onChangeInput} type="password" name="passwordInput" className="form-control"
                               placeholder="Enter password"/>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Submit</button>
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