import React from 'react';

const SafeAddressForm = ({handleSubmit, handleInputChange}) => 
	<form id="SafetyForm" onSubmit={handleSubmit}>
		<input type="text" name="addressToCheck" onChange={handleInputChange} className="smartInput" placeholder="Account address" required minLength="42" maxLength="42" pattern="0x\w+"/>
		<button type="submit" className="smartButton">safe address</button>
    </form>;

export default SafeAddressForm;