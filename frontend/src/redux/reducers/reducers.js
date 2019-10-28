import { SPECIFY_ADDRESS, SET_WEB3, SET_MULTISIG_CONTRACT, SET_MULTISIG_ADDRESS,
	SET_MULTISIG_ERC_CONTRACT, SET_TOKEN_IMPERIAL, SET_TOKEN_DEMOCRATIC, SET_CHOSEN_TOKEN,
	SET_CHOSEN_TOKEN_SYMBOL, UPDATE_ETHER_BALANCE, UPDATE_CONTRACT_BALANCE, 
	UPDATE_TOKEN_IMPERIAL_BALANCE, UPDATE_TOKEN_DEMOCRATIC_BALANCE, 
	UPDATE_TOKEN_IMPERIAL_CONTRACT_BALANCE, UPDATE_TOKEN_DEMOCRATIC_CONTRACT_BALANCE, 
	SET_UPDATE_ETHER_BALANCES, SET_UPDATE_ERC_BALANCES, SET_MULTISIG_ERC_ADDRESS } from '../actionTypes';

const initialState = {
	web3: '',
	multisig: '',
	multisigAddress: '',
	multisigERC20: '',
	multisigERC20Address: '',
	etherAddress: '',
	etherBalance: '',
	contractBalance: '',
	tokenImperial: '',
	tokenDemocratic: '',
	tokenImperialBalance: '',
	tokenDemocracticBalance: '',
	tokenImperialContractBalance: '',
	tokenDemocraticContractBalance: '',
	updateBalancesEther: '',
	updateBalancesERC: '',
	chosenToken: '',
	chosenTokenSymbol: '0x746f6b656e496d70657269616c00000000000000000000000000000000000000',
	login: false
};

export default function handlingActions(state = initialState, action) {
	switch (action.type) {
    case SPECIFY_ADDRESS:
		return Object.assign({}, state, {
			etherAddress: action.payload,
			login: true
		});
	case SET_WEB3:
		return Object.assign({}, state, {
			web3: action.payload
		});
	case SET_MULTISIG_CONTRACT:
		return Object.assign({}, state, {
			multisig: action.payload
		});
	case SET_MULTISIG_ADDRESS:
		return Object.assign({}, state, {
			multisigAddress: action.payload
		});	
	case SET_MULTISIG_ERC_CONTRACT:
		return Object.assign({}, state, {
			multisigERC20: action.payload
		});	
	case SET_TOKEN_IMPERIAL:
		return Object.assign({}, state, {
			tokenImperial: action.payload
		});
	case SET_TOKEN_DEMOCRATIC:
		return Object.assign({}, state, {
			tokenDemocratic: action.payload
		});
	case SET_CHOSEN_TOKEN:
		return Object.assign({}, state, {
			chosenToken: action.payload
		});
	case SET_CHOSEN_TOKEN_SYMBOL:
		return Object.assign({}, state, {
			chosenTokenSymbol: action.payload
		});	
	case UPDATE_ETHER_BALANCE:
		return Object.assign({}, state, {
			etherBalance: action.payload
		});
	case UPDATE_CONTRACT_BALANCE:
		return Object.assign({}, state, {
			contractBalance: action.payload
		});
	case UPDATE_TOKEN_IMPERIAL_BALANCE:
		return Object.assign({}, state, {
			tokenImperialBalance: action.payload
		});
	case UPDATE_TOKEN_DEMOCRATIC_BALANCE:
		return Object.assign({}, state, {
			tokenDemocracticBalance: action.payload
		});
	case UPDATE_TOKEN_IMPERIAL_CONTRACT_BALANCE:
		return Object.assign({}, state, {
			tokenImperialContractBalance: action.payload
		});
	case UPDATE_TOKEN_DEMOCRATIC_CONTRACT_BALANCE:
		return Object.assign({}, state, {
			tokenDemocraticContractBalance: action.payload
		});
	case SET_UPDATE_ETHER_BALANCES:
		return Object.assign({}, state, {
			updateBalancesEther: action.payload
		});
	case SET_UPDATE_ERC_BALANCES:
		return Object.assign({}, state, {
			updateBalancesERC: action.payload
		});
	case SET_MULTISIG_ERC_ADDRESS:
		return Object.assign({}, state, {
			multisigERC20Address: action.payload
		});	
    default:
      return state;
	}
}