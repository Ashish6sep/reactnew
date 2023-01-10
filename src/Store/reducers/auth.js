import { SET_CURRENT_USER } from '../actions/actionTypes';

const initialState = {
    showAlertMessage: false,
    isAuthenticated: false,
    user:{}
}

export default (state = initialState, action = {}) => {
    switch(action.type) {
        case SET_CURRENT_USER:
        const empty_check = (obj) => {
            return Object.keys(obj).length === 0;
        }
        const alertMessageCheck = () => {
            if(empty_check(action.user)){
                return false;
            }else{
                if(action.user.alert_message){
                    if(action.user.alert_message === ''){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        }
        return {
            showAlertMessage: alertMessageCheck(),
            isAuthenticated: !empty_check(action.user),
            user: action.user
        }
        default: return state;
    }
}