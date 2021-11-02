export default function MetamaskConnection({
                                               metamaskConnection,
                                               metamaskChosenAddress,
                                               clickMetaMaskButton
                                           }) {
    if (metamaskConnection) {
        return (
            <div className="alert alert-success text-break text-center" role="alert">
                Metamask is connected. Address: {metamaskChosenAddress}
            </div>
        )
    } else {
        return (
            <div className="alert alert-danger text-break text-center" role="alert">
                Please connect you Metamask Account
                <button onClick={clickMetaMaskButton} className="btn btn-primary m-lg-3">
                    Connect Metamask
                </button>
            </div>
        )
    }
}