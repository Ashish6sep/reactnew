import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { API_KEY, GET_COOKIE, GET_STORAGE, DELETE_COOKIE } from '../../Constants/AppConstants';

import PropTypes from "prop-types";
import classnames from 'classnames';

import validateSignup from '../../Validations/Registration';
import AlertWrapper from '../Common/AlertWrapper';
import history from '../../history';

class RegistrationForm extends Component {
    constructor (props){
        super(props)
        
        let settings = '';
        if(GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        } 

        this.state = {
            api_key: API_KEY,
            affiliate_code: GET_COOKIE('af'),
            terms_of_use: settings? settings.internal_pages.terms_of_use : "/",
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            paypal_account: '',
            w9_form: null,
            agreement_form: null,
            role: 'distributor',
            terms_of_service_agree: '',
            errors: {},
            isValid:false,
            isLoading:false,
            isFormValid:true,
            server_message:''
        }
    }

    changeW9Form = (e) => {
        this.setState({w9_form: e.target.files[0]});
    }

    changeAgreementForm = (e) => {
        this.setState({agreement_form: e.target.files[0]});
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    changeAcceptHandler = (e) => {
        if(document.getElementById("terms_of_service_agree").checked){
            this.setState({
                terms_of_service_agree:'checked'
            });
        }else{
            this.setState({
                terms_of_service_agree:''
            });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const val_return = validateSignup(this.state);
        this.setState(val_return);
        if(val_return.isValid){

            let data = new FormData();
            data.append('api_key', this.state.api_key);
            data.append('first_name', this.state.first_name);
            data.append('last_name', this.state.last_name);
            data.append('username', this.state.username);
            data.append('email', this.state.email);
            data.append('password', this.state.password);
            data.append('paypal_account', this.state.paypal_account);
            data.append('w9_form', this.state.w9_form);
            data.append('agreement_form', this.state.agreement_form);
            data.append('role', this.state.role);
            data.append('terms_of_service_agree', this.state.terms_of_service_agree);
            data.append('affiliate_code', this.state.affiliate_code);
            
            this.setState({errors: {}, isLoading: true});
            this.props.userSignupRequest(data).then(results => {
                if(results.response.code===1000) {
                    this.setState({
                        server_message: results.response.message,
                        isLoading:false,
                        isFormValid:true
                    });
                    DELETE_COOKIE('af');
                    history.push('/');
                } else {
                    this.setState({
                        server_message: results.response.message,
                        isLoading:false,
                        isFormValid:false
                    });
                }            
            }
            );
        }
    }

    render() {
        const { errors, server_message } = this.state;
        
        const errors_data = server_message;
        return (
            <div className="registration-form">
                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                <form onSubmit={this.onSubmit} method="post" id="registration_Form" className="register action_form" encType="multipart/form-data">
                    <div className="form-group pull-left name_field has-error">
                        <label className={classnames(null, { 'pl_error_label': errors.first_name })} htmlFor="reg_sr_first_name">First Name <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.first_name })} name="first_name" id="reg_sr_first_name" value={this.state.first_name} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group pull-right name_field">
                        <label className={classnames(null, { 'pl_error_label': errors.last_name })} htmlFor="reg_sr_last_name">Last Name <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.last_name })} name="last_name" id="reg_sr_last_name" value={this.state.last_name} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.username })} htmlFor="reg_username">Username <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.username })} name="username" id="reg_username" value={this.state.username} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.email })} htmlFor="reg_email">Email address <span className="required">*</span></label>
                        <input type="email" className={classnames("cus_field", { 'pl_error_input': errors.email })} name="email" id="reg_email" value={this.state.email} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="reg_password">Password <span className="required">*</span></label>
                        <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.password })} name="password" id="reg_password" value={this.state.password} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.paypal_account })} htmlFor="reg_paypal_account">PayPal Account(To get the payout) <span className="required">*</span></label>
                        <input type="email" className={classnames("cus_field", { 'pl_error_input': errors.paypal_account })} name="paypal_account" id="reg_paypal_account" value={this.state.paypal_account} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group input_type_file">
                        <label htmlFor="reg_w9_form">W-9 Form (Please fill & sign W-9 form&nbsp;
                            <NavLink to="/w-9-tax-form" target="_blank"> here</NavLink>, after getting the W-9 downloaded form please attache following) <span className="required">*</span>
                        </label>
                        <input onChange={this.changeW9Form} accept="application/pdf" className={classnames("cus_field", { 'pl_error_input': errors.w9_form })} type="file" id="w9_form" name="w9_form" />
                    </div>
                    <div className="form-group input_type_file">
                        <label htmlFor="reg_agreement_pdf_file">Agreement Form (Please fill & sign agreement form <NavLink to="/affiliate-agreement" target="_blank"> here</NavLink>, after getting the agreement downloaded form please attache following) <span className="required">*</span></label>
                        <input onChange={this.changeAgreementForm} accept="application/pdf" className={classnames("cus_field", { 'pl_error_input': errors.agreement_form })} type="file" id="agreement_form" name="agreement_form" />
                    </div>
                    <div className="clearfix"></div>        
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_checkbox': errors.terms_of_service_agree })}>
                            <input className={classnames(null, { 'pl_error': errors.terms_of_service_agree })} name="terms_of_service_agree" type="checkbox" id="terms_of_service_agree" value={this.state.terms_of_service_agree} onChange={this.changeAcceptHandler} /> 
                            <span> Agree with
                                <NavLink to={`${this.state.terms_of_use}`} target="_blank"> terms of service</NavLink>
                            </span>
                        </label>
                    </div>
                    <div className="">	
                        <button type="submit" disabled={this.state.isLoading} className="cus_button" name="login">{this.state.isLoading?'Please Wait...':'Register'}</button>
                    </div>
                </form>
        </div>
        );
    }
}

RegistrationForm.propTypes = {
    userSignupRequest:PropTypes.func.isRequired
}
 
export default RegistrationForm;