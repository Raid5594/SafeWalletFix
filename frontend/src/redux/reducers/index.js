import { combineReducers } from 'redux';
import handlingActions from './reducers';

export default combineReducers({ 
	data: handlingActions 
});
