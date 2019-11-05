import React from 'react';

const SetLimitFormERC = ({handleSubmit, handleInputChange}) => 
	<form id="SetLimitERC" onSubmit={handleSubmit}>
		<input type="text" name="limit" onChange={handleInputChange} className="smartInput3" placeholder="Limit" required pattern="\d+"/>
		<input type="text" name="privateKey" onChange={handleInputChange} className="smartInput3" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<input type="text" name="safetyPrivateKey" onChange={handleInputChange} className="smartInput3" placeholder="Safety Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<button type="submit" className="smartButton">set daily limit</button>
    </form>;

export default SetLimitFormERC;