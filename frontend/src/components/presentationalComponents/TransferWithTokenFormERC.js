import React from 'react';

const TransferWithTokenFormERC = ({handleSubmit, handleInputChange}) => 
    <form id="TransferFormTokenERC" onSubmit={handleSubmit}>
        <input type="text" name="amountToTransfer" onChange={handleInputChange} className="smartInput4" placeholder="Amount" required pattern="\d+"/>
        <input type="text" name="recipientAddress" onChange={handleInputChange} className="smartInput4" placeholder="Recipient" required minLength="42" maxLength="42" pattern="0x\w+"/>
        <input type="text" name="privateKey" onChange={handleInputChange} className="smartInput4" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>
        <input type="text" name="tokenTFA" onChange={handleInputChange} className="smartInput4" placeholder="Token" required minLength="6" maxLength="6" pattern="\d+"/>
        <button type="submit" className="smartButton">Transfer Token</button>
    </form>;

export default TransferWithTokenFormERC;