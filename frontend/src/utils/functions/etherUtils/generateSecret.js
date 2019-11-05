const generateSecret = (web3, address, privateKey, setSecret) => {
    web3.eth.getTransactionCount(address, (err, txCount) => {
        if (err) {
            console.log(err);
        } else {
            const signatureObj = web3.eth.accounts.sign(`Token ${txCount}`, `0x${privateKey}`);
            const addrRecover = web3.eth.accounts.recover(`Token ${txCount}`, signatureObj.signature);
            const xhttp = new XMLHttpRequest();
            const data = { address: address , signature : signatureObj.signature};
            console.log(data);
            console.log(addrRecover);
            
            xhttp.onreadystatechange = () => {
                    if (xhttp.readyState === 4) { // request is done
                        if (xhttp.status === 200) { // successfully
                            var obj = JSON.parse(xhttp.responseText);
                            console.log(obj.secret);
                            if(obj.secret != null) {
                              setSecret(obj.secret);
                            }
                        }
                    }
                };
            xhttp.open('POST', 'http://localhost:5597/totp-generate', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(data));
        }
    });
};

export default generateSecret;