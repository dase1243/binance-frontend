import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import './Register.css';
import {Link, useHistory} from 'react-router-dom'

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

    // useEffect(() => {
    //     console.log(formState)
    // }, [formState])

    const onChangeInput = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        })
    }

    async function registerUser(newUserBody) {
        return fetch('https://binance-hack.herokuapp.com/api/register', {
        // return fetch('http://localhost:5000/api/register', {
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
            model_id: "empty",
            printed: false
        });

        console.log(message)
        if(success) {
            history.push("/login");
        } else {
            alert(message)
        }
    }

    return (
        <div>
            <form className="mb-3" onSubmit={handleSubmit}>
                <h3>Register</h3>

                <div className="mb-3">
                    <div className="form-group">
                        <label>First Name</label>
                        <input onChange={onChangeInput} type="text" name="firstnameInput" className="form-control"
                               placeholder="Enter firstname"/>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="form-group">
                        <label>Last Name</label>
                        <input onChange={onChangeInput} type="text" name="lastnameInput" className="form-control"
                               placeholder="Enter lastname"/>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="form-group">
                        <label>Username</label>
                        <input onChange={onChangeInput} type="text" name="usernameInput" className="form-control"
                               placeholder="Enter username"/>
                    </div>
                </div>

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

                <div className="mb-3">
                    <div className="form-group">
                        <label>Repeat your password</label>
                        <input onChange={onChangeInput} type="password" name="passwordRepeatInput"
                               className="form-control"
                               placeholder="Re-enter password"/>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Submit</button>
            </form>
            <Link to={"/login"}>
                Login
            </Link>
        </div>
    );
}