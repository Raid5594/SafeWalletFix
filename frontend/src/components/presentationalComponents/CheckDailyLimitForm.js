import React from 'react';

const CheckDailyLimitForm = ({handleSubmit, handleInputChange}) => 
	<form id="CheckDailyLimitERC" onSubmit={handleSubmit}>
        <input type="text" name="ownerPub" onChange={handleInputChange} className="smartInput" placeholder="Owner Public Key" required minLength="42" maxLength="42" pattern="0x\w+"/> 
        <button type="submit" className="smartButton">check daily limit</button>
    </form>;

export default CheckDailyLimitForm;