import React from 'react';

const WithdrawLimitFormERC = ({handleSubmit, handleInputChange}) => 
	<form id="WithdrawLimitERC" onSubmit={handleSubmit}>
		<input type="text" name="privateKey" onChange={handleInputChange} className="smartInput2" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<input type="text" name="safetyPrivateKey" onChange={handleInputChange} className="smartInput2" placeholder="Safety Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<button type="submit" className="smartButton">withdraw limit</button>
    </form>;

export default WithdrawLimitFormERC;