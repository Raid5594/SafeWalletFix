import React from 'react';

const RecoveryFormERC = ({handleSubmit, handleInputChange}) => 
	<form id="RecoverERC" onSubmit={handleSubmit}>
		<input type="text" name="amountToTransfer" onChange={handleInputChange} className="smartInput4" placeholder="Amount" required pattern="\d+"/>
		<input type="text" name="ownerPublic" onChange={handleInputChange} className="smartInput4" placeholder="Current Owner" required minLength="42" maxLength="42" pattern="0x\w+"/>  
		<input type="text" name="recipientAddress" onChange={handleInputChange} className="smartInput4" placeholder="Recipient" required minLength="42" maxLength="42" pattern="0x\w+"/>
		<input type="text" name="privateKey" onChange={handleInputChange} className="smartInput4" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>  
		<button type="submit" className="smartButton">recover erc</button>
    </form>;

export default RecoveryFormERC;