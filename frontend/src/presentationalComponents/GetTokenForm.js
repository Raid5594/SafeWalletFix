import React from 'react';

const GetTokenForm = ({handleSubmit, handleInputChange}) => 
	<form id="TokenForm" onSubmit={handleSubmit}> 
		<input type="text" name="privateKey" onChange={handleInputChange} className="smartInput" placeholder="Private Key" required minLength="64" maxLength="64" pattern="\w+"/>
		<button type="submit" className="smartButton">enable 2fa</button>
    </form>;

export default GetTokenForm;