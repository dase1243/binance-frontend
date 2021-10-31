import React from 'react';
import './NftListing.css';
import axios from "axios";
import dateFormat, {masks} from "dateformat";

const constanta = [
    {
        token_address: '0x1e182357f3fe72231569e78f41b21f038f4dc908',
        token_id: '12',
        amount: '1',
        owner_of: '0x56aecd2df4ffae55adb8737031c78d9d10d7506c',
        block_number: '13709497',
        nft_image: 'https://firebasestorage.googleapis.com/v0/b/binance-hack-c03b1/o/617e929e4f95ad001679622a.png?alt=media&token=b8737488-455e-4e13-aab2-fbf7bc4fa9b7',
    },
    {
        token_address: '0x1e182357f3fe72231569e78f41b21f038f4dc908',
        token_id: '8',
        amount: '1',
        owner_of: '0x56aecd2df4ffae55adb8737031c78d9d10d7506c',
        block_number: '13673710',
        nft_image: 'https://firebasestorage.googleapis.com/v0/b/binance-hack-c03b1/o/617e939c4f95ad001679622c.png?alt=media&token=230856c5-3a40-4f3d-b6ae-edf9bc4196ed',
    },
    {
        token_address: '0x1e182357f3fe72231569e78f41b21f038f4dc908',
        token_id: '11',
        amount: '1',
        owner_of: '0x56aecd2df4ffae55adb8737031c78d9d10d7506c',
        block_number: '13709291',
        nft_image: 'https://firebasestorage.googleapis.com/v0/b/binance-hack-c03b1/o/617e97794f95ad0016796233.png?alt=media&token=f84c5238-a010-486b-959d-5cfd516802e0',
    },
    {
        token_address: '0x1e182357f3fe72231569e78f41b21f038f4dc908',
        token_id: '10',
        amount: '1',
        owner_of: '0x56aecd2df4ffae55adb8737031c78d9d10d7506c',
        block_number: '13706661',
        nft_image: 'https://firebasestorage.googleapis.com/v0/b/binance-hack-c03b1/o/617e93e64f95ad001679622e.png?alt=media&token=32bbbccc-08a5-44ec-8d29-6abd0a78e790',
    },
    {
        token_address: '0x1e182357f3fe72231569e78f41b21f038f4dc908',
        token_id: '13',
        amount: '1',
        owner_of: '0x56aecd2df4ffae55adb8737031c78d9d10d7506c',
        block_number: '13709679',
        nft_image: 'https://firebasestorage.googleapis.com/v0/b/binance-hack-c03b1/o/617e976f4f95ad0016796232.png?alt=media&token=06feada5-080f-4fcc-8867-6c0ecf923c23',
    }
]

export default function NftListing() {
    // const [nfts, setNfts] = React.useState([]);

    // React.useEffect(async () => {
    //     async function getAllNftsFromServer() {
    //         const userEmail = JSON.parse(localStorage.getItem('email'))
    //         console.log(userEmail)
    //         axios.get(`https://binance-hack.herokuapp.com/api/user/getAllNftsByUserEmail/${userEmail}`)
    //             // axios.get('http://localhost:5000/api/user/getAllNftsByUserEmail/' + userEmail)
    //             .then(res => {
    //                 console.log('res.data.result: ', res.data.result)
    //                 setNfts((_) => res.data.result)
    //             })
    //             .catch((err) => {
    //                 console.log(err.response.data)
    //             })
    //     }
    //
    //     getAllNftsFromServer();
    // }, [])


    return (
        <div className="auth-inner">
            <div className="list-group">
                {constanta.map((nft) =>
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
                        </ul>
                        <div className="nft_listing__image">
                            <img
                                src={nft.nft_image}
                                alt="Card image cap"/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}