import React from 'react';
import './NftListing.css';
import axios from "axios";
import dateFormat, { masks } from "dateformat";

export default function NftListing() {
    const [nfts, setNfts] = React.useState([]);

    React.useEffect(async () => {
        async function getAllNftsFromServer() {
            const userEmail = JSON.parse(localStorage.getItem('email'))
            console.log(userEmail)
            // axios.get(`https://binance-hack.herokuapp.com/api/model/getAllNftsByUserEmail/${localStorage.getItem('email')}`)
            axios.get('http://localhost:5000/api/user/getAllNftsByUserEmail/' + userEmail)
                .then(res => {
                    console.log('res.data.result: ', res.data.result)
                    setNfts((_) => res.data.result)
                })
                .catch((err) => {
                    console.log(err.response.data)
                })
        }

        getAllNftsFromServer();
    }, [])

    return (
        <div className="auth-inner">
            <div className="list-group">
                {nfts.map((nft) =>
                    <div key={nft.token_id} className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="d-flex w-100 justify-content-between mt-5">
                            <h5 className="mb-1">{nft.name}</h5>
                            <small>{nft.contract_type}</small>
                        </div>
                        <ul className="list-group list-group-flush mb-3">
                            <li className="list-group-item">Owner address: {nft.owner_of}</li>
                            <li className="list-group-item">Symbol: {nft.symbol}</li>
                            <li className="list-group-item">Token Address: {nft.token_address}</li>
                            <li className="list-group-item">Token ID: {nft.token_id}</li>
                            <li className="list-group-item">Synced at: {dateFormat(new Date(nft.synced_at), "dddd, mmmm yyyy")}</li>
                        </ul>
                        <div className="nft_listing__image">
                            <img
                                src="https://lh3.googleusercontent.com/JGr2C0ak0sf6Rp_E5V2bX5dqD1vkPPPHIcq_AqIE2PT4lqRrq2wraMICa-oCVRMViSzMgrbVoG6OcDWAnoKV5QE1_PPkCSAHBFl2Nd0"
                                alt="Card image cap"/>
                        </div>
                    </div>
                )}
                {nfts.map((nft) =>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{nft.name}</h5>
                            <small>{nft.contract_type}</small>
                        </div>
                        <ul className="list-group list-group-flush mb-3">
                            <li className="list-group-item">Owner address: {nft.owner_of}</li>
                            <li className="list-group-item">Symbol: {nft.symbol}</li>
                            <li className="list-group-item">Token Address: {nft.token_address}</li>
                            <li className="list-group-item">Token ID: {nft.token_id}</li>
                            <li className="list-group-item">Synced at: {nft.synced_at}</li>
                        </ul>
                        <div className="nft_listing__image">
                            <img
                                src="https://lh3.googleusercontent.com/JGr2C0ak0sf6Rp_E5V2bX5dqD1vkPPPHIcq_AqIE2PT4lqRrq2wraMICa-oCVRMViSzMgrbVoG6OcDWAnoKV5QE1_PPkCSAHBFl2Nd0"
                                alt="Card image cap"/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}