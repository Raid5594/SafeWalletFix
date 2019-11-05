import React from 'react';

const DepositFormERC = ({handleSubmit, handleInputChange}) => 
	<form id="DepositFormERC" onSubmit={handleSubmit}>
		<input type="text" name="amountDeposit" onChange={handleInputChange} className="smartInput2" placeholder="Amount" required pattern="\d+"/>
		<input type="text" name="privateKey" onChange={handleInputChange} className="smartInput2" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>  
		<button type="submit" className="smartButton">deposit token</button>
    </form>;

export default DepositFormERC;