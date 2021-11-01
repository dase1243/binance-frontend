import React from 'react';
import './TokenBalance.css';
import {Link} from "react-router-dom";
import axios from "axios";
import web3 from "web3";
import Web3 from "web3";
import BigNumber from "bignumber.js";

const tknAbi = require('../../static/GLRY.json');

export default function TokenBalance() {
    const [user, setUser] = React.useState({})
    const [userWalletBalance, setUserWalletBalance] = React.useState(0)
    const [depositInput, setDepositInput] = React.useState('')
    const [withdrawInput, setWithdrawInput] = React.useState('')

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
                setUserWalletBalance((_) => result)
            }
        }
    }, [user])

    const onWithdrawChangeInput = (e) => {
        e.preventDefault()
        setWithdrawInput((_) => e.target.validity.valid ? e.target.value : '')
    }

    const onDepositChangeInput = (e) => {
        e.preventDefault()
        setDepositInput((_) => e.target.validity.valid ? e.target.value : '')
    }

    const withdraw = async () => {
        try {
            let withdrawNumber = parseInt(withdrawInput, 10);
            if (window.ethereum && user.walletAddress && withdrawNumber <= user.tokenAmount) {
                console.log(' user.walletAddress: ', user.walletAddress)
                const web3 = new Web3(window.ethereum);
                const amountShifted = new BigNumber(withdrawNumber).shiftedBy(18);
                const contract = new web3.eth.Contract(tknAbi, process.env.REACT_APP_TKN_CONTRACT_ADDR);
                await contract.methods.withdraw(user.walletAddress, amountShifted).send({from: user.walletAddress});
            }
        } catch (e) {
            console.log("e: ", e)
            console.log("e.data: ", e.data)
        }
    }

    const deposit = async () => {
        let depositNumber = parseInt(depositInput, 10);
        if (window.ethereum && user.walletAddress && depositNumber <= userWalletBalance) {
            console.log(' user.walletAddress: ', user.walletAddress)
            const web3 = new Web3(window.ethereum);
            const amountShifted = new BigNumber(parseInt(depositInput, 10)).shiftedBy(18);
            const contract = new web3.eth.Contract(tknAbi, process.env.REACT_APP_TKN_CONTRACT_ADDR);
            await contract.methods.deposit(amountShifted).send({from: user.walletAddress});
        }
    }


    return (
        <div>
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
                        pattern="[0-9]*"
                        onChange={onDepositChangeInput}
                        required
                    />
                    <button id="btnDeposit" onClick={deposit}>Deposit</button>
                </div>
                <div>
                    <div>
                        <h6 className="mb-0">Withdraw</h6>
                        <label className="token_balance__input_label">Get tokens from the game</label>
                    </div>
                    <input
                        id="userWithdraw"
                        name="withdrawInput"
                        type="text"
                        pattern="[0-9]*"
                        onChange={onWithdrawChangeInput}
                        required
                    />
                    <button id="btnWithdraw" onClick={withdraw}>Withdraw</button>
                </div>
            </div>
            <div className="token_mint__navigation">
                <Link to={"./"}>
                    Home
                </Link>
                <Link to={"./nftList"}>
                    See all my NFTs
                </Link>
            </div>
        </div>
    );
}

