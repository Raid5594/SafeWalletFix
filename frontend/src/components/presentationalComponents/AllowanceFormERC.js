import React from 'react';

const AllowanceFormERC = ({handleSubmit, handleInputChange}) => 
	<form id="AllowanceFormERC" onSubmit={handleSubmit}>
        <input type="text" name="ownerPub" onChange={handleInputChange} className="smartInput" placeholder="Owner Public Key" required minLength="42" maxLength="42" pattern="0x\w+"/> 
        <button type="submit" className="smartButton">check allowance</button>
    </form>;

export default AllowanceFormERC;