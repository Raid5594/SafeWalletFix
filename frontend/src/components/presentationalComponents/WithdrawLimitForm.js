import React from 'react';

const WithdrawLimitForm = ({handleSubmit, handleInputChange}) => 
	<form id="WithdrawLimit" onSubmit={handleSubmit}>
		<input type="text" name="privateKey" onChange={handleInputChange} className="smartInput2" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<input type="text" name="safetyPrivateKey" onChange={handleInputChange} className="smartInput2" placeholder="Safety Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<button type="submit" className="smartButton">withdraw limit</button>
    </form>;

export default WithdrawLimitForm;