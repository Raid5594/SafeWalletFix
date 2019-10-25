import React from 'react';

const IncreaseAllowanceFormERC = ({handleSubmit, handleInputChange}) => 
	<form id="TokenAllowanceFormERC" onSubmit={handleSubmit}>
		<input type="text" name="amountAllowance" onChange={handleInputChange} className="smartInput2" placeholder="Amount" required pattern="\d+"/>
		<input type="text" name="privateKey" onChange={handleInputChange} className="smartInput2" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<button type="submit" className="smartButton">increase allowance</button>
    </form>;

export default IncreaseAllowanceFormERC;