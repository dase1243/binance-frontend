import React from 'react';
import './NftListing.css';
import axios from "axios";
import {Link} from "react-router-dom";

export default function NftListing() {
    const [nfts, setNfts] = React.useState([]);

    React.useEffect(() => {
        console.log('nfts from useEffect: ', nfts)
    }, [nfts])

    React.useEffect(async () => {
        async function getAllNftsFromServer() {
            let emailString = localStorage.getItem('email');
            axios.get(`${process.env.REACT_APP_BACKEND_URL}api/user/getAllNftsByUserEmail/${emailString}`)
                .then(res => {
                    // console.log('res.data.result: ', res.data)

                    const new_nfts = [];
                    res.data.result.forEach((nft) => {
                        axios.get(`${nft.token_uri}`)
                            .then(nested_res => {
                                // console.log('res.data.result: ', nested_res.data)

                                nft.token_description = nested_res.data.description
                                nft.token_image = nested_res.data.image
                                nft.token_name = nested_res.data.name
                            })
                            .catch(err => {
                                console.log(err.data)
                            })
                        new_nfts.push(nft)
                    })

                    // console.log('new_nfts: ', new_nfts)
                    setNfts((_) => new_nfts)
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
                {nfts.length === 0
                    ?
                    <div className="btn__play">
                        <div className="alert alert-success text-break text-center" role="alert">
                            So far no NFTs on Your account. Play and Create Heroes to Mint them
                        </div>
                        <Link className="btn btn-primary" to={"./"}>
                            Play
                        </Link>
                    </div>
                    :
                    nfts.map((nft) => {
                            return (
                                <div key={nft.token_id}
                                     className="list-group-item list-group-item-action flex-column align-items-start">
                                    <div className="d-flex w-100 justify-content-between mt-5">
                                        <h5 className="mb-1">{nft.name}</h5>
                                        <small>{nft.contract_type}</small>
                                    </div>
                                    <ul className="list-group list-group-flush mb-3">
                                        <li className="list-group-item">Owner address: {nft.owner_of}</li>
                                        <li className="list-group-item">Symbol: {nft.symbol}</li>
                                        <li className="list-group-item">Token Address: {nft.token_address}</li>
                                        <li className="list-group-item">Token ID: {nft.token_id}</li>

                                        {nft.token_description ? <li className="list-group-item">Token
                                            Description: {nft.token_description}</li> : <></>}
                                        {nft.token_name ?
                                            <li className="list-group-item">Token Name: {nft.token_name}</li> : <></>}
                                    </ul>
                                    {
                                        nft.token_image
                                            ?
                                            <div className="nft_listing__image">
                                                <img
                                                    src={nft.token_image}
                                                    alt="Card image cap"
                                                />
                                            </div>
                                            :
                                            <></>
                                    }
                                </div>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}