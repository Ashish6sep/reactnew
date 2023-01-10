import { ADD_FLASH_MESSAGE } from '../actions/actionTypes';
import shortid from 'shortid';

export default (state = [], action = {}) => {
    switch(action.type) {
        case ADD_FLASH_MESSAGE:
        default: return state;
    }
}