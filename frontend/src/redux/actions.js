import { SPECIFY_ADDRESS, LOGIN } from './actionTypes';

export const specifyAddress = address => ({
	type: SPECIFY_ADDRESS,
	payload: { address }
});

export const login = boolean => ({
	type: LOGIN,
	payload: { boolean }
});