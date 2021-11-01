import React, {useEffect} from 'react';
import './Register.css';
import {Link, useHistory} from 'react-router-dom'
import Web3 from 'web3'
import FormAlert from "../FormAlert/FormAlert";
import MetamaskConnection from "../MetamaskConnection/MetamaskConnection";

function FormInput({onChangeInput, label, placeholder, name, type}) {
    return (
        <div className="mb-3">
            <div className="form-group">
                <label>{label}</label>
                <input
                    onChange={onChangeInput}
                    type={type}
                    name={name}
                    className="form-control"
                    placeholder={placeholder}
                    required
                />
            </div>
        </div>
    )
}

export default function Register() {
    let history = useHistory();

    const [formState, setFormState] = React.useState({
        firstnameInput: '',
        lastnameInput: '',
        usernameInput: '',
        emailInput: '',
        passwordInput: '',
        passwordRepeatInput: '',
        rememberStatusInput: false,
        walletAddress: ''
    })

    useEffect(() => {
        const web3 = window.ethereum;
        if (!web3) {
            setMetamaskConnection((_) => false)
        }
    });

    const clickMetaMaskButton = async (e) => {
        e.preventDefault()
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);

            try {
                // Request account access if needed
                await window.ethereum.enable();
                // Accounts now exposed
                setMetamaskConnection((_) => true);
                await web3.eth.getAccounts()
                    .then(data => {
                        setMetamaskChosenAddress((_) => data[0])
                    });
                return web3;
            } catch (error) {
                console.error(error);
            }
        }
    }

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
                        .then(data => {
                            setFormState({
                                ...formState,
                                walletAddress: data[0]
                            })
                            setMetamaskChosenAddress((_) => data[0])
                            console.log(metamaskChosenAddress)
                        });
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
        return fetch(`${process.env.REACT_APP_BACKEND_URL}api/user/register`, {
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
            walletAddress: metamaskChosenAddress,
        });

        console.log(message)
        if (success) {
            history.push("/");
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
                <FormInput
                    label="First Name"
                    onChangeInput={onChangeInput}
                    placeholder={"Enter firstname"}
                    name={"firstnameInput"}
                    type={"text"}
                />
                <FormInput
                    label="Last Name"
                    onChangeInput={onChangeInput}
                    placeholder={"Last Name"}
                    name={"lastnameInput"}
                    type={"text"}
                />
                <FormInput
                    label="Username"
                    onChangeInput={onChangeInput}
                    type={"text"}
                    name={"usernameInput"}
                    placeholder={"Enter username"}
                />
                <FormInput
                    label="Email address"
                    onChangeInput={onChangeInput}
                    type={"email"}
                    name={"emailInput"}
                    placeholder={"Enter email"}
                />
                <FormInput
                    label="Password"
                    onChangeInput={onChangeInput}
                    type={"password"}
                    name={"passwordInput"}
                    placeholder={"Enter password"}
                />
                <FormInput
                    label="Repeat your password"
                    onChangeInput={onChangeInput}
                    type={"password"}
                    name={"passwordRepeatInput"}
                    placeholder={"Re-enter password"}
                />

                <button
                    type="submit"
                    disabled={!metamaskConnection}
                    className="btn btn-primary btn-block mb-3"
                >
                    Submit
                </button>

                <MetamaskConnection
                    metamaskConnection={metamaskConnection}
                    metamaskChosenAddress={metamaskChosenAddress}
                    clickMetaMaskButton={clickMetaMaskButton}
                />
                <FormAlert formAlert={formAlert}/>
            </form>
            <Link to={"/login"}>
                Login
            </Link>
        </div>
    );
}