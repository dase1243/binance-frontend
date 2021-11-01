import React from 'react';
import './TokenBalance.css';
import {Link} from "react-router-dom";
import axios from "axios";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import Loader from "react-loader-spinner";
import MetamaskConnection from "../MetamaskConnection/MetamaskConnection";
import FormAlert from "../FormAlert/FormAlert";

const tknAbi = require('../../static/GLRY.json');

export default function TokenBalance() {
    const [user, setUser] = React.useState({})
    const [userWalletBalance, setUserWalletBalance] = React.useState(0)
    const [depositInput, setDepositInput] = React.useState('')
    const [withdrawInput, setWithdrawInput] = React.useState('')
    const [loading, setLoading] = React.useState(false);
    const [metamaskConnection, setMetamaskConnection] = React.useState(false);
    const [metamaskChosenAddress, setMetamaskChosenAddress] = React.useState('');

    const [formAlert, setFormAlert] = React.useState({
        message: '',
        status: false
    });

    const clickMetaMaskButton = async (e) => {
        e.preventDefault()
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);

            try {
                // Request account access if needed
                await window.ethereum.enable();
                // Accounts now exposed
                await web3.eth.getAccounts()
                    .then(data => {
                        setMetamaskChosenAddress((_) => data[0]);
                        if (data[0] !== user.walletAddress) {
                            setFormAlert({
                                message: 'Your Account Wallet and Metamask Wallet are different. Please Connect the initial wallet, which was used while registration',
                                status: true
                            })
                        }
                    });

                setMetamaskConnection((_) => true);
                return web3;
            } catch (error) {
                console.error(error);
            }
        }
    }

    React.useEffect(() => {
        const email = localStorage.getItem("email")
        axios.get(`${process.env.REACT_APP_BACKEND_URL}api/user/getUserByEmail/${email}`)
            .then(res => {
                console.log(res.data)
                setUser((_) => res.data)
            })
    }, [])

    React.useEffect(async () => {
        console.log(user)
        if (user && user.walletAddress) {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const contract = new web3.eth.Contract(tknAbi, process.env.REACT_APP_TKN_CONTRACT_ADDR);
                console.log("user.walletAddress: ", user.walletAddress)
                const result = await contract.methods.balanceOf(user.walletAddress).call();
                setUserWalletBalance((_) => new BigNumber(result).dividedBy(new BigNumber(1)
                    .shiftedBy(18)
                ).toNumber())
            }
        }
    }, [user])

    const onWithdrawChangeInput = (e) => {
        e.preventDefault()
        setWithdrawInput((_) => e.target.value)
    }

    const onDepositChangeInput = (e) => {
        e.preventDefault()
        setDepositInput((_) => e.target.value)
    }

    const withdraw = async () => {
        try {
            let withdrawNumber = parseInt(withdrawInput, 10);
            if (window.ethereum && user.walletAddress && withdrawNumber <= user.tokenAmount) {
                console.log(' user.walletAddress: ', user.walletAddress)
                const web3 = new Web3(window.ethereum);
                const amountShifted = new BigNumber(withdrawNumber).shiftedBy(18);
                const contract = new web3.eth.Contract(tknAbi, process.env.REACT_APP_TKN_CONTRACT_ADDR);
                setLoading((_) => true)
                const result = await contract.methods.withdraw(user.walletAddress, amountShifted).send({from: user.walletAddress});
                setLoading((_) => false)
                if (result.status) {
                    await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/user/updateUserTokenAmount/${user._id}`, {tokenAmount: (user.tokenAmount - withdrawNumber)})
                        .then(res => {
                            console.log('Withdraw token amount from user balance promise then: ', res.data)
                        })
                    window.location.reload()
                } else {
                    setFormAlert({
                        message: 'Transaction failed',
                        status: true,
                    })
                }
                console.log(result);
            } else {
                if (withdrawNumber > user.tokenAmount) {
                    setFormAlert({
                        message: 'Withdraw should be less or equal than your In-Game balance',
                        status: true,
                    })
                }
            }
        } catch (e) {
            console.log("e: ", e)
            console.log("e.data: ", e.data)
        }
    }

    const deposit = async () => {
        try {
            let depositNumber = parseInt(depositInput, 10);
            new BigNumber(userWalletBalance)
            if (window.ethereum && user.walletAddress && depositNumber <= userWalletBalance) {
                console.log(' user.walletAddress: ', user.walletAddress)
                const web3 = new Web3(window.ethereum);
                const amountShifted = new BigNumber(depositNumber).shiftedBy(18);
                const contract = new web3.eth.Contract(tknAbi, process.env.REACT_APP_TKN_CONTRACT_ADDR);
                setLoading((_) => true)
                const result = await contract.methods.deposit(amountShifted).send({from: user.walletAddress});
                setLoading((_) => false)
                if (result.status) {
                    await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/user/updateUserTokenAmount/${user._id}`, {tokenAmount: (depositNumber + user.tokenAmount)})
                        .then(res => {
                            console.log('Deposit token amount from user balance promise then: ', res.data)
                        })
                    window.location.reload()
                } else {
                    setFormAlert({
                        message: 'Transaction failed',
                        status: true,
                    })
                }
            } else if (depositNumber > userWalletBalance) {
                setFormAlert({
                    message: 'Deposit should be less or equal than your On-Chain balance',
                    status: true,
                })

            }
        } catch (e) {
            console.log("e: ", e)
            console.log("e.data: ", e.data)
        }
    }


    if (loading) {
        return (
            <div className="text-center">
                <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                />
            </div>
        );
    } else {
        return (
            <div className="token_balance__container">
                <h5 className="card-title">Total Token Balance</h5>
                <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item"></li>
                    <li className="list-group-item">On-Chain Balance: {userWalletBalance} GLRY</li>
                    <li className="list-group-item">In-Game Balance: {user.tokenAmount} GLRY</li>
                    <li className="list-group-item"></li>
                </ul>
                <div className="token_balance__inputs m-4">
                    <div>
                        <div>
                            <h6 className="mb-0">Deposit</h6>
                            <label className="token_balance__input_label">Put tokens into the game</label>
                        </div>
                        <input
                            id="userDeposit"
                            name="depositInput"
                            type="text"
                            className="token_balance__input"
                            pattern="[0-9]*"
                            onChange={onDepositChangeInput}
                            required
                        />
                        <button
                            id="btnDeposit"
                            onClick={deposit}
                            className="token_balance__button"
                            disabled={formAlert.status}
                        >
                            Deposit
                        </button>
                    </div>
                    <div>
                        <div>
                            <h6 className="mb-0">Withdraw</h6>
                            <label className="token_balance__input_label">Get tokens from the game</label>
                        </div>
                        <input
                            id="userWithdraw"
                            name="withdrawInput"
                            className="token_balance__input"
                            type="text"
                            pattern="[0-9]*"
                            onChange={onWithdrawChangeInput}
                            required
                        />
                        <button
                            id="btnWithdraw"
                            className="token_balance__button"
                            onClick={withdraw}
                            disabled={formAlert.status}
                        >
                            Withdraw
                        </button>
                    </div>
                </div>
                <MetamaskConnection
                    metamaskConnection={metamaskConnection}
                    metamaskChosenAddress={metamaskChosenAddress}
                    clickMetaMaskButton={clickMetaMaskButton}
                />
                <FormAlert formAlert={formAlert}/>
                <div className="token_mint__navigation">
                    <Link to={"./"}>
                        Home
                    </Link>
                    {/*<Link to={"./nftList"}>*/}
                    {/*    See all my NFTs*/}
                    {/*</Link>*/}
                </div>
            </div>
        );
    }
}

