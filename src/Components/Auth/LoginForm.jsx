import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { API_KEY, CUSTOMER_URL, PUBLIC_URL, GET_COOKIE, DELETE_COOKIE, SITE, ENABLE_NEW_LOGIN, GET_STORAGE, REFER_URL } from '../../Constants/AppConstants';

import PropTypes from "prop-types";
import classnames from 'classnames';

import validateLogin from '../../Validations/Login';
import AlertWrapper from '../Common/AlertWrapper';
import history from '../../history';
import FlashMessagesList from '../FlashMessages/FlashMessagesList';

import { connect } from 'react-redux';
import { userLoginRequest, serviceLogout } from '../../Store/actions/loginActions';

class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            api_key: API_KEY,
            user_login: '',
            password: '',
            remember: '',
            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            server_message: '',
            registration_link:PUBLIC_URL
        }
    }

    componentDidMount() {
        if(GET_COOKIE("af") != ""){
            this.setState({
                registration_link:PUBLIC_URL+"affiliate-signup-request?af="+GET_COOKIE("af")+'&site='+SITE
            })
        }else{
            this.setState({
                registration_link:PUBLIC_URL+'affiliate-signup-request?site='+SITE
            })
        }
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    changeRememberHandler = (e) => {
        if (document.getElementById("remember").checked) {
            this.setState({
                remember: 'checked'
            });
        } else {
            this.setState({
                remember: ''
            });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const val_return = validateLogin(this.state);
        this.setState(val_return);
        if (val_return.isValid) {
            this.setState({ errors: {}, isLoading: true });
            this.props.userLoginRequest(this.state).then(results => {
                if(results.response.code===1000) {
                    if((Object.values(results.response.data.roles).includes('distributor')) || (Object.values(results.response.data.roles).includes('team_member'))){
                        // if(history.goBack(1)){
                        //     history.goBack(1);
                        // }else{
                        // history.push('/');
                        history.push('/my-account');
                        // }
                    }else if(Object.values(results.response.data.roles).includes('customer')){
                        this.props.serviceLogout();

                        let settings = null;
                        if (GET_STORAGE("settings")) {
                            settings = JSON.parse(GET_STORAGE("settings"));
                        }

                        let meal_menu_active = false;
                        if(settings && settings.meal_menu_public == "yes"){
                            meal_menu_active = true;
                        }else{
                            if(results.response.data.meal_menu_activated){
                                meal_menu_active = true;
                            }
                        }

                        if(meal_menu_active){
                            if(results.response.data.site == "refer"){
                                window.location.href = REFER_URL+'serviceLogin?token='+results.response.data.token+'&redirect=meals';
                            }else{
                                window.location.href = PUBLIC_URL+'serviceLogin?token='+results.response.data.token+'&redirect=meals';
                            }
                        }else{
                            window.location.href = CUSTOMER_URL+'serviceLogin?token='+results.response.data.token;
                        }
                    }else{
                        history.push('/my-affiliate-account');
                    }
                } else {
                    this.setState({
                        server_message: results.response.message,
                        isLoading: false,
                        isFormValid: false
                    });
                }
            }
            );
        }
    }

    clickRegistration = (e) => {
        e.preventDefault();
        DELETE_COOKIE("af");
        window.location.href = this.state.registration_link;
    }

    render() {
        const { errors, server_message } = this.state;
        const errors_data = server_message;
        return (
            <div className="login-form">
                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                <FlashMessagesList />
                <form className="action_form" onSubmit={this.onSubmit} method="post">
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.user_login })} htmlFor="user_login">Username or email address <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.user_login })} name="user_login" id="user_login" value={this.state.user_login} onChange={this.changeHandler} />

                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="password">Password <span className="required">*</span></label>
                        <input className={classnames("cus_field", { 'pl_error_input': errors.password })} type="password" name="password" id="password" value={this.state.password} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={this.state.isLoading} className="cus_button" name="login" value="Login">{this.state.isLoading ? 'Please Wait...' : 'Login'}</button>

                        <div className="inline_checkbox custom-control custom-checkbox">
                            <input onChange={this.changeRememberHandler} type="checkbox" className={classnames('custom-control-input', { 'pl_error_checkbox': errors.remember })} id="remember" name="remember" />
                            <label className="custom-control-label" htmlFor="remember">Remember me</label>
                        </div>
                        
                        {
                            !ENABLE_NEW_LOGIN?
                            <div className="new_distributor_sign_up"><a href={this.state.registration_link} onClick={this.clickRegistration}> Join Our Team</a></div>
                            :''
                        }
                            
                        
                        {/* <div className="new_distributor_sign_up"><NavLink to="/registration"> New Distributor? Sign up</NavLink></div>
                        <div className="clearfix"></div> */}
                    </div>
                    <div className="lost_password">
                        <NavLink activeClassName='active' to="/password-reset"> Lost your password?</NavLink>
                    </div>
                </form>
            </div>
        );
    }
}

LoginForm.propTypes = {
    userLoginRequest: PropTypes.func.isRequired,
    serviceLogout:PropTypes.func.isRequired,
}

export default connect(null, { userLoginRequest, serviceLogout })(LoginForm);