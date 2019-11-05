import * as types from '../types';

export const specifyAddress = address => ({
	type: types.SPECIFY_ADDRESS,
	payload: address 
});

export const setWeb3 = web3 => ({
	type: types.SET_WEB3,
	payload: web3
});

export const setMultisig = contract => ({
	type: types.SET_MULTISIG_CONTRACT,
	payload: contract
});

export const setMultisigAddress = address => ({
	type: types.SET_MULTISIG_ADDRESS,
	payload: address
});

export const setMultisigERC = contract => ({
	type: types.SET_MULTISIG_ERC_CONTRACT,
	payload: contract
});

export const setTokenImperial = token => ({
	type: types.SET_TOKEN_IMPERIAL,
	payload: token
});

export const setTokenDemocratic = token => ({
	type: types.SET_TOKEN_DEMOCRATIC,
	payload: token
});

export const setChosenToken = token => ({
	type: types.SET_CHOSEN_TOKEN,
	payload: token
});

export const setChosenTokenSymbol = symbol => ({
	type: types.SET_CHOSEN_TOKEN_SYMBOL,
	payload: symbol
});


export const updateEtherBalance = balance => ({
	type: types.UPDATE_ETHER_BALANCE,
	payload: balance
});

export const updateContractBalance = balance => ({
	type: types.UPDATE_CONTRACT_BALANCE,
	payload: balance
});

export const updateTokenImperialBalance = balance => ({
	type: types.UPDATE_TOKEN_IMPERIAL_BALANCE,
	payload: balance
});

export const updateTokenDemocraticBalance = balance => ({
	type: types.UPDATE_TOKEN_DEMOCRATIC_BALANCE,
	payload: balance
});

export const updateTokenImperialContractBalance = balance => ({
	type: types.UPDATE_TOKEN_IMPERIAL_CONTRACT_BALANCE,
	payload: balance
});

export const updateTokenDemocraticContractBalance = balance => ({
	type: types.UPDATE_TOKEN_DEMOCRATIC_CONTRACT_BALANCE,
	payload: balance
});

export const setUpdateBalancesEther = func => ({
	type: types.SET_UPDATE_ETHER_BALANCES,
	payload: func
});

export const setUpdateBalancesERC = func => ({
	type: types.SET_UPDATE_ERC_BALANCES,
	payload: func
});

export const setMultisigERC20Address = address => ({
	type: types.SET_MULTISIG_ERC_ADDRESS,
	payload: address
});


