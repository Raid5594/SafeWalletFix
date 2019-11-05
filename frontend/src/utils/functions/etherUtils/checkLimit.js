const checkLimit = (ownerPub, modal, multisig) => {
    multisig.methods.limits(ownerPub).call({ from: ownerPub }).then( limit => {

        modal.setState({ 
            limit: limit.dailyLimit,
            dailyLimitReceipt: true
        });
        modal.openModal();
        }
    );
}

export default checkLimit;