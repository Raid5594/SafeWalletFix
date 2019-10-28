import { SPECIFY_ADDRESS, SET_WEB3, SET_MULTISIG_CONTRACT, SET_MULTISIG_ADDRESS,
	SET_MULTISIG_ERC_CONTRACT, SET_TOKEN_IMPERIAL, SET_TOKEN_DEMOCRATIC, SET_CHOSEN_TOKEN,
	SET_CHOSEN_TOKEN_SYMBOL, UPDATE_ETHER_BALANCE, UPDATE_CONTRACT_BALANCE, 
	UPDATE_TOKEN_IMPERIAL_BALANCE, UPDATE_TOKEN_DEMOCRATIC_BALANCE, 
	UPDATE_TOKEN_IMPERIAL_CONTRACT_BALANCE, UPDATE_TOKEN_DEMOCRATIC_CONTRACT_BALANCE, 
	SET_UPDATE_ETHER_BALANCES, SET_UPDATE_ERC_BALANCES, SET_MULTISIG_ERC_ADDRESS } from './actionTypes';

export const specifyAddress = address => ({
	type: SPECIFY_ADDRESS,
	payload: address 
});

export const setWeb3 = web3 => ({
	type: SET_WEB3,
	payload: web3
});

export const setMultisig = contract => ({
	type: SET_MULTISIG_CONTRACT,
	payload: contract
});

export const setMultisigAddress = address => ({
	type: SET_MULTISIG_ADDRESS,
	payload: address
});

export const setMultisigERC = contract => ({
	type: SET_MULTISIG_ERC_CONTRACT,
	payload: contract
});

export const setTokenImperial = token => ({
	type: SET_TOKEN_IMPERIAL,
	payload: token
});

export const setTokenDemocratic = token => ({
	type: SET_TOKEN_DEMOCRATIC,
	payload: token
});

export const setChosenToken = token => ({
	type: SET_CHOSEN_TOKEN,
	payload: token
});

export const setChosenTokenSymbol = symbol => ({
	type: SET_CHOSEN_TOKEN_SYMBOL,
	payload: symbol
});


export const updateEtherBalance = balance => ({
	type: UPDATE_ETHER_BALANCE,
	payload: balance
});

export const updateContractBalance = balance => ({
	type: UPDATE_CONTRACT_BALANCE,
	payload: balance
});

export const updateTokenImperialBalance = balance => ({
	type: UPDATE_TOKEN_IMPERIAL_BALANCE,
	payload: balance
});

export const updateTokenDemocraticBalance = balance => ({
	type: UPDATE_TOKEN_DEMOCRATIC_BALANCE,
	payload: balance
});

export const updateTokenImperialContractBalance = balance => ({
	type: UPDATE_TOKEN_IMPERIAL_CONTRACT_BALANCE,
	payload: balance
});

export const updateTokenDemocraticContractBalance = balance => ({
	type: UPDATE_TOKEN_DEMOCRATIC_CONTRACT_BALANCE,
	payload: balance
});

export const setUpdateBalancesEther = func => ({
	type: SET_UPDATE_ETHER_BALANCES,
	payload: func
});

export const setUpdateBalancesERC = func => ({
	type: SET_UPDATE_ERC_BALANCES,
	payload: func
});

export const setMultisigERC20Address = address => ({
	type: SET_MULTISIG_ERC_ADDRESS,
	payload: address
});


