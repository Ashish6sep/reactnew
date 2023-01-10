import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

import setAuthorizationToken from './Utils/setAuthorizationToken';
import { USER, SET_STORAGE, GET_STORAGE, GET_COOKIE, AJAX_SERVICE_LOGIN_REQUEST, REMOVE_STORAGE, API_KEY, PUBLIC_URL, DELETE_LOGIN_COOKIE } from './Constants/AppConstants';
import { setCurrentUser } from './Store/actions/loginActions';
import reducer from './Store/reducers/reducer';
import history from './history';
import { createRoot } from 'react-dom/client';

const store = createStore(
    reducer,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
);

const cur_cookie = GET_COOKIE(USER);
if(cur_cookie){
    const cur_cookie_parse = JSON.parse(GET_COOKIE(USER));
        SET_STORAGE(USER,JSON.stringify(cur_cookie_parse));
}

const cur_storage = JSON.parse(GET_STORAGE(USER));
if(cur_storage){
    // setAuthorizationToken(localStorage.plu);
    store.dispatch(setCurrentUser(cur_storage));
    if(cur_storage.token){
        const request_result = AJAX_SERVICE_LOGIN_REQUEST("POST","user/details",{
            user_token: cur_storage.token,
            api_key: API_KEY,
        });
        request_result.then(results => {
            if(results.response.code===1000) {
                let user_data = results.response.data;
                user_data.remember = cur_storage.remember;
                if(results.response.data.hasOwnProperty('site')){
                    if(results.response.data.site === 'public'){
                        window.location.href = PUBLIC_URL+'serviceLogin?token='+results.response.data.token;
                    }
                }
                SET_STORAGE(USER,JSON.stringify(user_data));
                store.dispatch(setCurrentUser(JSON.parse(GET_STORAGE(USER))));
                
            }
            else{
                REMOVE_STORAGE(USER);
                DELETE_LOGIN_COOKIE();
                store.dispatch(setCurrentUser({}));
            }
        });
    }else{
        REMOVE_STORAGE(USER);
        store.dispatch(setCurrentUser({}));
    }
}


// ReactDOM.render(
//     <Provider store={store}>
//         <Router history={history}>
//             <App />
//         </Router>
//     </Provider>,
//     document.getElementById('root')
// );

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>
);

serviceWorker.unregister();
