import React from 'react';

const ReceiptComponent = ({transactionHash, blockHash, blockNumber, gasUsed}) =>
    <React.Fragment>
        <p className="modalTextTx">Transaction confirmed!</p> 
        <hr/>
        <p className="modalTextTx">
        <span className="modalTextBlack">Please view the receipt:</span><br/>
        <span className="modalTextBlack">Transaction hash is:</span><br/>
        {transactionHash}<br/>
        <span className="modalTextBlack">Block hash is:</span><br/>
        {blockHash}<br/>
        <span className="modalTextBlack">Block number is:</span><br/>
        {blockNumber}<br/>
        <span className="modalTextBlack">Gas used:</span><br/>
        {(parseInt(gasUsed)).toString()}
        </p> 
    </React.Fragment>;


export default ReceiptComponent;