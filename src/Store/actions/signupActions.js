import CryptoJS from 'crypto-js';

import { AJAX_REQUEST_WITH_FILE, AJAX_SERVICE_LOGIN_REQUEST, SET_STORAGE, USER, GET_STORAGE, ENCRYPT_SECRET_KEY, CUSTOMER_URL, REFER_URL, SET_LOGIN_COOKIE } from '../../Constants/AppConstants';

import { SET_CURRENT_USER } from './actionTypes';

const config = {
    headers: {'Access-Control-Allow-Origin': '*'}
};

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    }
}

export function userSignupRequest(userData) {
    return dispatch => {
        // const request_result = AJAX_REQUEST_WITH_FILE("POST","user/registration",userData);
        const request_result = AJAX_REQUEST_WITH_FILE("POST","distributor/signup_request_new",userData);
        request_result.then(results => {
            if(results.response.code===1000) {
                /*
                const user_data = results.response.data;
                user_data.remember = false;
                if(userData.remember === 'checked'){
                    // user_data.user_login = window.btoa(CryptoJS.AES.encrypt(userData.user_login, ENCRYPT_SECRET_KEY));
                    // user_data.password = window.btoa(CryptoJS.AES.encrypt(userData.password, ENCRYPT_SECRET_KEY));
                    user_data.remember = true;
                }

                if(Object.values(results.response.data.roles).includes('distributor')) {
                    user_data.role = 'distributor';
                }else if(Object.values(results.response.data.roles).includes('team_member')){
                    user_data.role = 'team_member';
                }else{
                    user_data.role = 'master_affiliate';
                }

                SET_STORAGE(USER,JSON.stringify(user_data));
                SET_LOGIN_COOKIE(JSON.stringify(user_data));
                // setAuthorizationToken(results.response.data.token);
                const cur_storage2 = GET_STORAGE(USER);
                const cur_storage = JSON.parse(cur_storage2);
                dispatch(setCurrentUser(cur_storage));
                
                if(user_data.role === 'customer'){
                    window.location.href = CUSTOMER_URL+'serviceLogin?token='+user_data.token;
                }*/

                // Decrypt
                // console.log(cur_storage);
                // const bytes  = CryptoJS.AES.decrypt(window.atob(cur_storage.password).toString(), ENCRYPT_SECRET_KEY);
                // const plaintext = bytes.toString(CryptoJS.enc.Utf8);
                // console.log(plaintext);
            } else {
                // console.log(results);
                // history.push('/');
            }            
        });
        return request_result;
    }
}

export function affiliateSignupRequest(userData) {
    return dispatch => {
        const request_result = AJAX_REQUEST_WITH_FILE("POST","distributor/becomeMasterAffiliate",userData);
        request_result.then(results => {
            if(results.response.code===1000) {
                if(results.response.data.status==="success"){
                    const user_data = results.response.data.user_data;
                    user_data.remember = true;
    
                    if(Object.values(user_data.roles).includes('distributor')) {
                        user_data.role = 'distributor';
                    }else if(Object.values(user_data.roles).includes('team_member')){
                        user_data.role = 'team_member';
                    }else{
                        user_data.role = 'master_affiliate';
                    }
    
                    SET_STORAGE(USER,JSON.stringify(user_data));
                    SET_LOGIN_COOKIE(JSON.stringify(user_data));
                    const cur_storage2 = GET_STORAGE(USER);
                    const cur_storage = JSON.parse(cur_storage2);
                    dispatch(setCurrentUser(cur_storage));
                }
            }
            if(results.response.code===4001) {
                SET_STORAGE(USER,JSON.stringify({}));
                const cur_storage2 = GET_STORAGE(USER);
                const cur_storage = JSON.parse(cur_storage2);
                dispatch(setCurrentUser(cur_storage));
            }
        });
        return request_result;
    }
}

export function serviceLoginRequest(userData) {
    return dispatch => {
        const request_result = AJAX_SERVICE_LOGIN_REQUEST("POST","user/details",userData);
        request_result.then(results => {
            if(results.response.code===1000) {
                const user_data = results.response.data;
                user_data.remember = false;
                if(userData.remember === 'checked'){
                    // user_data.user_login = window.btoa(CryptoJS.AES.encrypt(userData.user_login, ENCRYPT_SECRET_KEY));
                    // user_data.password = window.btoa(CryptoJS.AES.encrypt(userData.password, ENCRYPT_SECRET_KEY));
                    user_data.remember = true;
                }

                if(Object.values(results.response.data.roles).includes('distributor')) {
                    user_data.role = 'distributor';
                }else if(Object.values(results.response.data.roles).includes('team_member')){
                    user_data.role = 'team_member';
                }else{
                    user_data.role = 'master_affiliate';
                }
                
                SET_STORAGE(USER,JSON.stringify(user_data));
                SET_LOGIN_COOKIE(JSON.stringify(user_data));
                const cur_storage2 = GET_STORAGE(USER);
                const cur_storage = JSON.parse(cur_storage2);
                dispatch(setCurrentUser(cur_storage));
                // if(user_data.role === 'customer'){
                //     window.location.href = CUSTOMER_URL+'serviceLogin?token='+user_data.token;
                // }
            }           
        });
        return request_result;
    }
}

export function alertMessageRemoval() {
    return dispatch => {
        const cur_storage2 = GET_STORAGE(USER);
        const cur_storage = JSON.parse(cur_storage2);
        dispatch(setCurrentUser(cur_storage));
    }
}