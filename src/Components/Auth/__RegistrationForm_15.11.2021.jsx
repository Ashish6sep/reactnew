import React, { Fragment, Component } from 'react';
import { NavLink } from 'react-router-dom';
import { API_KEY, GET_COOKIE, GET_STORAGE, DELETE_COOKIE, AJAX_PUBLIC_REQUEST, AJAX_REQUEST_WITH_FILE, DISTRIBUTOR_URL, USER, SET_LOGIN_COOKIE, SET_STORAGE } from '../../Constants/AppConstants';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import classnames from 'classnames';
import { userSignupRequest } from '../../Store/actions/signupActions';
import validateSignup from '../../Validations/Registration';
import AlertWrapper from '../Common/AlertWrapper';
import AlertWrapperSuccess from '../Common/AlertWrapperSuccess';
import history from '../../history';
import $ from "jquery";
import Parser from 'html-react-parser';

class RegistrationForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            affiliate_code: GET_COOKIE('af'),
            site: GET_COOKIE('site'),
            countryList: [],
            stateList: [],
            first_name: '',
            last_name: '',
            username: '',
            password: '',
            confirm_password: '',
            phone: '',
            country: '',
            street: '',
            street2: '',
            city: '',
            state: '',
            postcode: '',
            paypal_account: '',
            business_name: '',
            is_corporation: '',
            social_security_no: '',
            affiliate_agreement: '',
            terms_of_service_agree: '',
            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            server_message: '',
            success_alert_wrapper_show: false,

            haveExistsUser: 0,
        }
    }

    componentDidMount() {
        // document.querySelector("body").scrollIntoView();
        this.getCountryList();
        this.setState({
            loading: false
        });
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    getCountryList = () => {
        AJAX_PUBLIC_REQUEST("POST", "user/getCountry", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({ countryList: results.response.data });
            }
        });
    }

    getStateList = (countryId) => {
        let data = { country_id: countryId };
        AJAX_PUBLIC_REQUEST("POST", "user/getState", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({ stateList: results.response.data });
            } else {
                this.setState({ stateList: [] })
            }
        });
    }

    onChangeCountry = (e) => {
        let countryId = e.target.value;
        if (countryId != "") {
            this.setState({ [e.target.name]: countryId })
        } else {
            this.setState({ [e.target.name]: countryId, billing_state: '' })
        }
        this.getStateList(countryId);
    }

    changeAcceptHandler = (e) => {
        if (document.getElementById("terms_of_service_agree").checked) {
            this.setState({
                terms_of_service_agree: 'checked'
            });
        } else {
            this.setState({
                terms_of_service_agree: ''
            });
        }
    }

    changeAgreementHandler = (e) => {
        if (document.getElementById("affiliate_agreement").checked) {
            this.setState({
                affiliate_agreement: 'checked'
            });
        } else {
            this.setState({
                affiliate_agreement: ''
            });
        }
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false
            });
            history.push('/my-account');
        }.bind(this), timedata);
    }

    onSubmit = (e) => {
        e.preventDefault();
        const val_return = validateSignup(this.state);
        this.setState(val_return);
        if (val_return.isValid) {

            let data = new FormData();
            data.append('api_key', API_KEY);
            data.append('affiliate_code', this.state.affiliate_code);
            data.append('site', this.state.site);
            data.append('first_name', this.state.first_name);
            data.append('last_name', this.state.last_name);
            data.append('username', this.state.username);
            data.append('password', this.state.password);
            data.append('confirm_password', this.state.confirm_password);
            data.append('phone', this.state.phone);
            data.append('country', this.state.country);
            data.append('street', this.state.street);
            data.append('street2', this.state.street2);
            data.append('city', this.state.city);
            data.append('state', this.state.state);
            data.append('postcode', this.state.postcode);
            data.append('social_security_no', this.state.social_security_no);
            data.append('paypal_account', this.state.paypal_account);
            data.append('business_name', this.state.business_name);
            data.append('is_corporation', this.state.is_corporation);

            this.setState({ errors: {}, isLoading: true });

            this.props.userSignupRequest(data).then(results => {
                if (results.response.code === 1000) {
                    this.setState({
                        isLoading: false,
                        isFormValid: true,
                        server_message: results.response.message,
                        success_alert_wrapper_show: true,
                        first_name: '',
                        last_name: '',
                        username: '',
                        password: '',
                        confirm_password: '',
                        phone: '',
                        country: '',
                        street: '',
                        street2: '',
                        city: '',
                        state: '',
                        postcode: '',
                        social_security_no: '',
                        paypal_account: '',
                        business_name: '',
                        is_corporation: '',
                    });
                    this.timeOut(1000);
                    DELETE_COOKIE('af');
                    DELETE_COOKIE('site');
                    // document.querySelector("body").scrollIntoView();
                } else {
                    this.setState({
                        server_message: results.response.message,
                        isLoading: false,
                        isFormValid: false,
                        success_alert_wrapper_show: false,
                    });
                    // document.querySelector("body").scrollIntoView();
                }
            })

        } else {
            // document.querySelector("body").scrollIntoView();
        }
    }

    showAgreementModal = (e) => {
        $("#affiliateAgreementModal").modal({
            backdrop: 'static',
            keyboard: false,
        });
    }

    haveExistsUser = (e) => {
        let data = { email: this.state.username }
        AJAX_PUBLIC_REQUEST("POST", "user/haveExists", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    haveExistsUser: results.response.data.have_exists,
                })
            } else {
                this.setState({
                    haveExistsUser: 0,
                })
            }
        });
    }

    render() {
        const { errors, server_message } = this.state;

        const errors_data = server_message;
        return (
            <div className="registration-form">
                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={this.state.success_alert_wrapper_show} />
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
                        <label className={classnames(null, { 'pl_error_label': errors.username })} htmlFor="reg_username">Username (email address) <span className="required">*</span></label>
                        <input onBlur={this.haveExistsUser} type="text" className={classnames("cus_field", { 'pl_error_input': errors.username })} name="username" id="reg_username" value={this.state.username} onChange={this.changeHandler} />
                    </div>

                    {
                        (this.state.haveExistsUser == 0) ?
                            <Fragment>
                                <div className="form-group pull-left name_field has-error">
                                    <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="reg_password">Password <span className="required">*</span></label>
                                    <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.password })} name="password" id="reg_password" value={this.state.password} onChange={this.changeHandler} />
                                </div>
                                <div className="form-group pull-right name_field has-error">
                                    <label className={classnames(null, { 'pl_error_label': errors.confirm_password })} htmlFor="reg_confirm_password">Confirm Password <span className="required">*</span></label>
                                    <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.confirm_password })} name="confirm_password" id="reg_confirm_password" value={this.state.confirm_password} onChange={this.changeHandler} />
                                </div>
                            </Fragment>
                            :
                            <Fragment>
                                <div className="form-grouphas-error">
                                    <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="reg_password">Your Existing Password <span className="required">*</span></label>
                                    <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.password })} name="password" id="reg_password" value={this.state.password} onChange={this.changeHandler} />
                                </div>
                            </Fragment>
                    }

                    <div className="clearfix"></div>
                    <div className="form-group">
                        <label className="">Phone Number (must include area code) <span className="required">*</span> </label>
                        <input onChange={this.changeHandler} value={this.state.phone} type="text" className={classnames("cus_field", { 'pl_error_input': errors.phone })} name="phone" placeholder="" />
                    </div>

                    <div className="clearfix"></div>
                    <div className="form-group pull-left name_field has-error">
                        <label className={classnames(null, { 'pl_error_label': errors.street })} htmlFor="reg_sr_street">Street Address <span className="required">*</span> <small>(As listed on your W-9 or GST)</small></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.street })} name="street" id="reg_sr_street" value={this.state.street} onChange={this.changeHandler} placeholder="House number or street name" />
                    </div>
                    <div className="form-group pull-right name_field">
                        <label className={classnames(null, { 'pl_error_label': errors.city })} htmlFor="reg_sr_city">Town/City <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.city })} name="city" id="reg_sr_city" value={this.state.city} onChange={this.changeHandler} />
                    </div>

                    <div className="clearfix"></div>
                    <div className="form-group pull-left name_field has-error">
                        <label className={classnames(null, { 'pl_error_label': errors.street2 })} htmlFor="reg_sr_street2"></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.street2 })} name="street2" id="reg_sr_street2" value={this.state.street2} onChange={this.changeHandler} placeholder="Apartment, suite, unit etc. (optional)" />
                    </div>
                    <div className="form-group pull-right name_field">
                        <label className={classnames(null, { 'pl_error_label': errors.country })} htmlFor="reg_sr_country">Country <span className="required">*</span></label>
                        <select onChange={this.onChangeCountry} value={this.state.country} name="country" className={classnames("cus_field", { 'pl_error_input': errors.country })}>
                            <option value="">Select a Country…</option>
                            {
                                (this.state.countryList.length <= 0) ? null :
                                    this.state.countryList.map(function (country, key) {
                                        return (
                                            <option key={key} value={country.id}>{country.name}</option>
                                        )
                                    }.bind(this))
                            }
                        </select>
                    </div>

                    <div className="clearfix"></div>
                    <div className="form-group pull-left name_field has-error">
                        <label className={classnames(null, { 'pl_error_label': errors.state })} htmlFor="reg_sr_state">State <span className="required">*</span></label>
                        <select onChange={this.changeHandler} value={this.state.state} name="state" className={classnames("cus_field", { 'pl_error_input': errors.state })}>
                            <option value="">Select a state...</option>
                            {
                                (this.state.stateList.length <= 0) ? null :
                                    this.state.stateList.map(function (state, key) {
                                        return (
                                            <option key={key} value={state.code}>{state.name}</option>
                                        )
                                    }.bind(this))
                            }
                        </select>
                    </div>
                    <div className="form-group pull-right name_field">
                        <label className={classnames(null, { 'pl_error_label': errors.postcode })} htmlFor="reg_sr_postcode">Zip <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.postcode })} name="postcode" id="reg_sr_postcode" value={this.state.postcode} onChange={this.changeHandler} />
                    </div>

                    <div className="clearfix"></div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.social_security_no })} htmlFor="reg_sr_social_security_no">Social Security or EIN Number <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.social_security_no })} name="social_security_no" id="reg_sr_social_security_no" value={this.state.social_security_no} onChange={this.changeHandler} />
                    </div>
                    <div className="clearfix"></div>
                    <div className="form-group">
                        <label className="">PayPal Email <span className="required">*</span> (This is where we will send your earnings) </label>
                        <input onChange={this.changeHandler} value={this.state.paypal_account} type="text" className={classnames("cus_field", { 'pl_error_input': errors.paypal_account })} name="paypal_account" placeholder="" />
                    </div>
                    <div className="form-group">
                        <label className="">Business Name <span className="required">*</span> (As listed on your W-9 or GST) </label>
                        <input onChange={this.changeHandler} value={this.state.business_name} type="text" className={classnames("cus_field", { 'pl_error_input': errors.business_name })} name="business_name" placeholder="" />
                    </div>
                    <div className="form-group form-inline">
                        <label className={classnames(null, { 'pl_error_checkbox': errors.is_corporation })}>Are you a corporation? <span className="required">*</span> </label> &nbsp;&nbsp;&nbsp;&nbsp;
                        <label><input type="radio" name="is_corporation" value="yes" onChange={(e) => this.setState({ is_corporation: e.target.value })} /> Yes</label> &nbsp;&nbsp;&nbsp;
                        <label><input type="radio" name="is_corporation" value="no" onChange={(e) => this.setState({ is_corporation: e.target.value })} /> No </label>
                    </div>

                    <div className="clearfix"></div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_checkbox': errors.affiliate_agreement })}>
                            <input className={classnames(null, { 'pl_error': errors.affiliate_agreement })} name="affiliate_agreement" type="checkbox" id="affiliate_agreement" value={this.state.affiliate_agreement} onChange={this.changeAgreementHandler} />
                            <span> <strong>By clicking here, I agree to be bound by the <NavLink onClick={this.showAgreementModal} to="#">Prestige Lab Affiliate Agreement</NavLink></strong>
                            </span>
                        </label>
                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_checkbox': errors.terms_of_service_agree })}>
                            <input className={classnames(null, { 'pl_error': errors.terms_of_service_agree })} name="terms_of_service_agree" type="checkbox" id="terms_of_service_agree" value={this.state.terms_of_service_agree} onChange={this.changeAcceptHandler} />
                            <span>  I agree to be contacted by Prestige Labs and Gym Launch Secrets via the number and email provided about my application as well as offers and deals, including through the use of automated technology. I understand that consent is not a condition to purchase anything.
                            </span>
                        </label>
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={this.state.isLoading} className="cus_button" name="login">{this.state.isLoading ? 'Please Wait...' : 'Submit'}</button>
                    </div>
                </form>

                <div className="modal fade" id="affiliateAgreementModal" tabIndex="-1" role="dialog" aria-labelledby="affiliateAgreementModal" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header cus-modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body montserrat">
                                <div className="cus-modal-title" style={{ marginBottom: '0px' }}> &nbsp; Prestige Lab Affiliate Agreement</div>
                                {Parser(this.props.agreement_text)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

RegistrationForm.propTypes = {
    userSignupRequest: PropTypes.func.isRequired
}

// export default RegistrationForm;
export default connect(null, { userSignupRequest })(RegistrationForm);