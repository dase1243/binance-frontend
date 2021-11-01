import React from 'react';
import './TokenMint.css';
import axios from 'axios';
import Loader from "react-loader-spinner";
import Web3 from 'web3';
import nftAbi from '../../static/InfiniteHeroAbi.json'
import {Link} from "react-router-dom";

export default function TokenMint() {
    const [tokenInfo, setTokenInfo] = React.useState({
        modelId: '',
        description: '',
        name: '',
        walletAddress: '',
        imageUrl: '',
        printed: false,
    })

    const [metamaskConnection, setMetamaskConnection] = React.useState(false);
    const [metamaskChosenAddress, setMetamaskChosenAddress] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [metamaskPrint, setMetamaskPrint] = React.useState(false);

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
                console.log('window.ethereum.isConnected: ', window.ethereum.isConnected());
                // Accounts now exposed
                await web3.eth.getAccounts()
                    .then(data => setMetamaskChosenAddress((_) => data[0]));

                setMetamaskConnection((_) => true);
                return web3;
            } catch (error) {
                console.error(error);
            }
        }
    }

    React.useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        console.log(params)

        axios.get(`${process.env.REACT_APP_BACKEND_URL}api/model/getById/${params.modelId}`)
            .then(res => {
                console.log('res.data: ', res.data)
                if (!res.data.success) {
                    setFormAlert({
                        message: res.data.message,
                        status: true
                    })
                } else {
                    console.log('res.data.model: ', res.data.model)
                    setTokenInfo({
                            name: res.data.model.name,
                            description: res.data.model.description,
                            walletAddress: res.data.model.user.walletAddress,
                            modelId: params.modelId,
                            imageUrl: res.data.model.base_image,
                            nftImageUrl: res.data.model.nft_image,
                            printed: res.data.model.printed,
                        }
                    )
                }
            })
            .catch((err) => {
                console.log(err)
                console.log(err.data)
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
            const uri = `binance-hack.herokuapp.com/api/nft_token/getSmartContractInfo/${tokenInfo.modelId}`
            // const uri = `localhost:5000/api/model/getSmartContractInfo/${tokenInfo.modelId}`
            console.log('metamaskChosenAddress: ', metamaskChosenAddress)
            setLoading((_) => true)
            const result = await contract.methods.awardItem(metamaskChosenAddress, uri).send({from: metamaskChosenAddress});
            setLoading((_) => false)
            setMetamaskPrint((_) => true)
            console.log('tokenIdEncoded result: ', result)
            const tokenIdEncoded = result['events']['0']['raw']['topics'][3];
            // const tokenId = parseInt(tokenIdEncoded, 16);
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/model/updateModelPrintedStatus/${tokenInfo.modelId}`, {printed: true})
                .then(res => {
                    console.log("updateModelPrintedStatus: done")
                })
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/nft_token/create`,
                {
                    name: tokenInfo.name,
                    model_id: tokenInfo.modelId,
                    description: tokenInfo.description,
                    image_uri: tokenInfo.imageUrl,
                    token_id: tokenIdEncoded
                }
            ).then(res => {
                console.log("nft_token creation: done")
                console.log("nft_token data: ", res.data)
            })
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
        return (<div>
            <h5 className="card-title">Token Information</h5>
            <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">Wallet address: {tokenInfo.walletAddress}</li>
                <li className="list-group-item">Token Name: {tokenInfo.name}</li>
                <li className="list-group-item">Token Description: {tokenInfo.description}</li>
            </ul>
            {
                tokenInfo.imageUrl === ''
                    ?
                    <div className="btn__mint mb-3">
                        <div className="alert alert-danger text-break mb-3" role="alert">
                            No token image found
                        </div>
                    </div>
                    :
                    <div className="btn__mint mb-3">
                        <img className="mb-3"
                             src={tokenInfo.imageUrl}
                             alt="Card image cap"/>
                    </div>

            }
            <div className="btn__mint mb-3">
                <button
                    type="button"
                    disabled={formAlert.status || !metamaskConnection || tokenInfo.printed}
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
            {
                tokenInfo.printed
                    ?
                    <div className="alert alert-danger text-break text-center" role="alert">
                        Token already printed. You can't print it for the second time
                    </div>
                    :
                    <></>
            }
            {
                metamaskConnection ?
                    <div className="alert alert-success text-break text-center" role="alert">
                        Metamask is connected. Address: {metamaskChosenAddress}
                    </div>
                    :
                    <div className="alert alert-danger text-break text-center" role="alert">
                        Please connect you Metamask Account
                        <button onClick={clickMetaMaskButton} className="btn btn-primary m-lg-3">
                            Connect Metamask
                        </button>
                    </div>
            }
            {
                metamaskPrint ?
                    <div className="alert alert-success text-break text-center" role="alert">
                        Your token successfully printed.
                    </div>
                    :
                    <></>
            }
            <div className="token_mint__navigation">
                <Link to={"./"}>
                    Home
                </Link>
                {/*<Link to={"./nftList"}>*/}
                {/*    See all my NFTs*/}
                {/*</Link>*/}
            </div>
        </div>)
    }
}