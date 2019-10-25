import React from 'react';

const TransferWithKeyForm = ({handleSubmit, handleInputChange}) => 
    <form id="TransferForm" onSubmit={handleSubmit}>
        <input type="text" name="amountToTransfer" onChange={handleInputChange} className="smartInput4" placeholder="Amount" required pattern="\d+"/>
        <input type="text" name="recipientAddress" onChange={handleInputChange} className="smartInput4" placeholder="Recipient" required minLength="42" maxLength="42" pattern="0x\w+"/>
        <input type="text" name="privateKey" onChange={handleInputChange} className="smartInput4" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>
        <input type="text" name="safetyPrivateKey" onChange={handleInputChange} className="smartInput4" placeholder="Safety Key" required minLength="64" maxLength="64" pattern="\w+"/>
        <button type="submit" className="smartButton">Transfer Backup</button>
    </form>;

export default TransferWithKeyForm;