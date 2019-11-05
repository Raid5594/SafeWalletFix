import React from 'react';

const SafeDepositForm = ({handleSubmit, handleInputChange}) => 
	<form id="DepositFormSafely" onSubmit={handleSubmit}>
        <input type="text" name="amountToDeposit" onChange={handleInputChange} className="smartInput3" placeholder="Amount" required pattern="\d+"/>
        <input type="text" name="safetyPubKey" onChange={handleInputChange} className="smartInput3" placeholder="Safety Public" required minLength="42" maxLength="42" pattern="0x\w+"/>
        <input type="text" name="privateKey" onChange={handleInputChange} className="smartInput3" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<button type="submit" className="smartButton">deposit safely</button>
    </form>;

export default SafeDepositForm;