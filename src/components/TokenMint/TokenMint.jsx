import React from 'react';
import './TokenMint.css';
import axios from 'axios';

import Web3 from 'web3';
import nftAbi from '../../static/InfiniteHeroAbi.json'
import {Link} from "react-router-dom";

export default function TokenMint() {
    const [tokenInfo, setTokenInfo] = React.useState({
        modelId: '',
        description: '',
        name: '',
        walletAddress: '',
        imageUrl: ''
    })

    const [formAlert, setFormAlert] = React.useState({
        message: '',
        status: false
    });

    React.useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        console.log(params)

        axios.get(`https://binance-hack.herokuapp.com/api/model/getById/${params.modelId}`)
        // axios.get(`http://localhost:5000/api/model/getById/${params.modelId}`)
            .then(res => {
                console.log('res.data: ', res.data)
                console.log('res: ', res)
                if (!res.data.success) {
                    setFormAlert({
                        message: res.data.message,
                        status: true
                    })
                } else {
                    setTokenInfo({
                            name: res.data.model.name,
                            description: res.data.model.description,
                            walletAddress: res.data.model.user.walletAddress,
                            modelId: params.modelId,
                            imageUrl: `https://binance-hack.herokuapp.com/modelImages/${res.data.model.image}`,
                            // imageUrl: `http://localhost:5000/modelImages/${res.data.model.image}`,
                        }
                    )
                }
            })
            .catch((err) => {
                console.log(err.response.data)
                setFormAlert({
                    message: err.response.data.message,
                    status: true
                })
            })
    }, [])

    const mintToken = async (e) => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);

            const contract = new web3.eth.Contract(nftAbi, process.env.REACT_APP_NFT_CONTRACT_ADDR);
            const uri = `https://binance-hack.herokuapp.com/api/model/getSmartContractInfo/${tokenInfo.modelId}`
            // const uri = `localhost:5000/api/model/getSmartContractInfo/${tokenInfo.modelId}`

            await contract.methods.awardItem(tokenInfo.walletAddress, uri).send({from: tokenInfo.walletAddress});
        }
    }

    return (
        <div>
            <h5 className="card-title">Token Information</h5>
            <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">Wallet address: {tokenInfo.walletAddress}</li>
                <li className="list-group-item">Token Name: {tokenInfo.name}</li>
                <li className="list-group-item">Token Description: {tokenInfo.description}</li>
            </ul>
            {
                tokenInfo.imageUrl === ''
                    ?
                    <></>
                    :
                    <img className="card-img-top mb-3"
                         src={tokenInfo.imageUrl}
                         alt="Card image cap"/>
            }
            {/*<img className="card-img-top mb-3"*/}
            {/*     src="https://lh3.googleusercontent.com/JGr2C0ak0sf6Rp_E5V2bX5dqD1vkPPPHIcq_AqIE2PT4lqRrq2wraMICa-oCVRMViSzMgrbVoG6OcDWAnoKV5QE1_PPkCSAHBFl2Nd0"*/}
            {/*     alt="Card image cap"/>*/}
            <div className="btn__mint mb-3">
                <button
                    type="button"
                    disabled={formAlert.status}
                    className="btn btn-primary"
                    onClick={mintToken}
                >
                    Mint NFT
                </button>
            </div>
            {
                formAlert.status
                    ?
                    <div className="alert alert-danger text-break" role="alert">
                        {formAlert.message}
                    </div>
                    :
                    <></>
            }
            <Link to={"./"}>
                Home
            </Link>
        </div>
    );
}