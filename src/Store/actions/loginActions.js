import CryptoJS from 'crypto-js';
import $ from 'jquery';
import setAuthorizationToken from '../../Utils/setAuthorizationToken';

import { API_URL, SET_STORAGE, USER, GET_STORAGE, REMOVE_STORAGE, ENCRYPT_SECRET_KEY, AJAX_PUBLIC_REQUEST, DESTROY_ALL_CART, NEXT_MONTH, SET_LOGIN_COOKIE, DELETE_LOGIN_COOKIE, DELETE_COOKIE } from '../../Constants/AppConstants';
import history from '../../history';

import { SET_CURRENT_USER } from './actionTypes';

const config = {
    headers: { 'Access-Control-Allow-Origin': '*' }
};

// function ajax_request(type='GET',additional_url,data){
//     data.site = SITE;
//     return $.ajax({
//         type: type,
//         url: API_URL + additional_url,
//         data: data
//     });
// }

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    }
}

export function logout() {
    return dispatch => {
        REMOVE_STORAGE(USER);
        DELETE_COOKIE(USER);
        DELETE_LOGIN_COOKIE();
        DESTROY_ALL_CART();
        // setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
        history.push('/login');
    }
}

export function serviceLogout() {
    return dispatch => {
        REMOVE_STORAGE(USER);
        DELETE_COOKIE(USER);
        DELETE_LOGIN_COOKIE();
        DESTROY_ALL_CART();
        // setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
    }
}

export function userLoginRequest(userData) {
    return dispatch => {
        // return axios.post(API_URL+'user/registration', userData, config);
        const request_result = AJAX_PUBLIC_REQUEST("POST", "user/login", userData);
        request_result.then(results => {
            if (results.response.code === 1000) {
                const user_data = results.response.data;
                user_data.remember = false;
                if (userData.remember === 'checked') {
                    // user_data.user_login = window.btoa(CryptoJS.AES.encrypt(userData.user_login, ENCRYPT_SECRET_KEY));
                    // user_data.password = window.btoa(CryptoJS.AES.encrypt(userData.password, ENCRYPT_SECRET_KEY));
                    user_data.remember = true;
                }

                if (Object.values(results.response.data.roles).includes('distributor')) {
                    user_data.role = 'distributor';
                } else if (Object.values(results.response.data.roles).includes('team_member')) {
                    user_data.role = 'team_member';
                } else {
                    user_data.role = 'master_affiliate';
                }

                SET_STORAGE(USER, JSON.stringify(user_data));
                SET_LOGIN_COOKIE(JSON.stringify(user_data));
                SET_STORAGE('cart', JSON.stringify(user_data.cart_data));
                // setAuthorizationToken(results.response.data.token);
                const cur_storage2 = GET_STORAGE(USER);
                const cur_storage = JSON.parse(cur_storage2);
                dispatch(setCurrentUser(cur_storage));

                // Decrypt
                // console.log(cur_storage);
                // const bytes  = CryptoJS.AES.decrypt(window.atob(cur_storage.password).toString(), ENCRYPT_SECRET_KEY);
                // const plaintext = bytes.toString(CryptoJS.enc.Utf8);
                // console.log(plaintext);
            } else {
                // console.log(results);
                // history.push('/');
            }
        }
        );
        return request_result;
    }
}

export function userLoginWithData(userData) {
    return dispatch => {
        const user_data = userData;
        user_data.remember = false;
        user_data.remember = true;
        user_data.role = 'distributor';

        SET_STORAGE(USER, JSON.stringify(user_data));
        const cur_storage2 = GET_STORAGE(USER);
        const cur_storage = JSON.parse(cur_storage2);
        dispatch(setCurrentUser(cur_storage));
    }
}