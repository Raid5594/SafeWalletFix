const verifyToken = (token, address, setData) => {
    var xhttp = new XMLHttpRequest();
    var data = { 
        token: token, 
        address: address
    };
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) { // request is done
            if (xhttp.status === 200) { // successfully
                var obj = JSON.parse(xhttp.responseText);
                console.log(obj.verified);
                setData('goodToken', obj.verified);
            }
        }
    };
    console.log(data);
    xhttp.open('POST', 'http://localhost:5597/totp-verify', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
    setData('notVerified', false);
};

export default verifyToken;