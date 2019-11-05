import React from 'react';

const DepositForm = ({handleSubmit, handleInputChange}) => 
	<form id="DepositForm" onSubmit={handleSubmit}>
		<input type="text" name="amountToDeposit" onChange={handleInputChange} className="smartInput2" placeholder="Amount" required pattern="\d+"/>
		<input type="text" name="privateKey" onChange={handleInputChange} className="smartInput2" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<button type="submit" className="smartButton">deposit</button>
	</form>;

export default DepositForm;