import { combineReducers } from 'redux';
import flashMessages from './flashMessages';
import cartPage from './cartPage';
import auth from './auth';

export default combineReducers({
    flashMessages,
    cartPage,
    auth
});