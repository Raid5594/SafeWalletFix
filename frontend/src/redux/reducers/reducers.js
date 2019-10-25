import { SPECIFY_ADDRESS, LOGIN } from '../actionTypes';

const initialState = {
	etherAddress: '',
	login: false
};

export default function handlingActions(state = initialState, action) {
	switch (action.type) {
    case SPECIFY_ADDRESS:
		return Object.assign({}, state, {
			etherAddress: action.payload
		});
    case LOGIN:
		return Object.assign({}, state, {
			visibilityFilter: action.payload
		});
    default:
      return state;
	}
}