import React from 'react';

const InitialTxHashComponent = ({transactionHash}) =>
    <p className="modalTextTx">
        <span className="modalTextBlack">Transaction hash is:</span>
        <br/>
        {transactionHash}
    </p>; 

export default InitialTxHashComponent;