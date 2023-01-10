import React, { Fragment, Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
    API_KEY,
    GET_COOKIE,
    GET_STORAGE,
    DELETE_COOKIE,
    AJAX_PUBLIC_REQUEST,
    SET_STORAGE, USER, REMOVE_STORAGE
} from '../../Constants/AppConstants';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import classnames from 'classnames';
import { userSignupRequest } from '../../Store/actions/signupActions';
import validateSignupNew from '../../Validations/RegistrationNew';
import AlertWrapper from '../Common/AlertWrapper';
import AlertWrapperSuccess from '../Common/AlertWrapperSuccess';
import history from '../../history';
import $ from "jquery";
import Parser from 'html-react-parser';
import SignatureCanvas from 'react-signature-canvas'
import Modal, {closeStyle} from 'simple-react-modal'
class RegistrationFormNew extends Component {
    eSignature = {}
    constructor(props) {
        super(props)

        // Check Tax
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }



        this.state = {
            loading: true,
            countryList: [],
            countryListWithoutUSCanada: [],
            stateList: [],
            w9StateList: [],
            classificationList: [],
            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            server_message: '',
            success_alert_wrapper_show: false,
            signatureModalDisplay: false,
            signatureButtonDisabled: true,
            isEnableHowYouKnow:(settings.is_enable_how_you_know == 'yes') ? "yes" : "no",
            isKnowOthers: false,
            isKnowOtherInput: false,
            howYouKnowOptions: [],
            how_you_know: "",
            how_you_know_others: "",



            haveExistsUser: 0,
            form: {
                affiliate_code: GET_COOKIE('af'),
                site: GET_COOKIE('site'),
                first_name: '',
                last_name: '',
                business_name: '',
                street: '',
                street2: '',
                country: '',
                city: '',
                state: '',
                postcode: '',
                username: '',
                password: '',
                confirm_password: '',
                phone:'',
                paypal_account: '',

                type: '',
                // US Business Form
                is_business: '',
                name: '',
                number: '',
                address_1: '',
                address_2: '',
                w9_country: '',
                w9_city: '',
                w9_state: '',
                w9_postcode: '',
                classification: '',
                // US Checkbox
                is_information_provided: '',
                penalties_perjury: '',
                // Canada Business Form
                canadian_goods_services_tax_status: '',
                canadian_gst_account: '',
                canadian_gst_account_number: '',
                provincial_account: '',
                provincial_account_number: '',
                canadian_gst_completed: '',
                // Others Business Form
                affiliate_agreement: '',
                terms_of_service_agree: '',
                // eSignature
                signature: '',
            }
        }
    }

    componentDidMount() {
        this.getCountryList();
        this.getCountryListWithoutUSCanada();
        this.getClassificationList();
        this.setState({
            loading: false
        });

        if (this.state.isEnableHowYouKnow == 'yes') {
            this.getHowYouKnowOptions();
        }

        //check alert message
        /*
        if (GET_STORAGE('alert_message')) {
            this.setState({
                server_message: GET_STORAGE('alert_message'),
                success_alert_wrapper_show: true
            });

             setTimeout(function(){
                 REMOVE_STORAGE('alert_message');
             }, 1000);
        }*/
    }

    getHowYouKnowOptions = () => {
        // AJAX_PUBLIC_REQUEST("POST", "user/getHowYouKnowOptions", {}).then(results => {
        //     if (parseInt(results.response.code) === 1000) {
        //         this.setState({ howYouKnowOptions: results.response.data })
        //     } else {
        //         this.setState({
        //             howYouKnowOptions: [],
        //             error: results.response.message
        //         })
        //     }
        // });
    }

    howKnowChangeHandler = (e) => {
        if (e.target.value == 'others' || e.target.value == 'Social Media' || e.target.value == 'Friend Referral') {
            if (e.target.value == 'Social Media' || e.target.value == 'Friend Referral') {
                this.setState({
                    isKnowOthers: true,
                    isKnowOtherInput: true,
                    [e.target.name]: e.target.value
                })
            }else{
                this.setState({
                    isKnowOthers: true,
                    isKnowOtherInput: false,
                    [e.target.name]: e.target.value
                })
            }

        } else {
            this.setState({
                isKnowOthers: false,
                isKnowOtherInput: false,
                [e.target.name]: e.target.value,
                how_you_know_others: ""
            })
        }
    }

    howKnowOtherHendler= (e) => {
            this.setState({
                [e.target.name]: e.target.value
            })

    }

    changeHandler = (e) => {
        let value = e.target.value;

        if(e.target.type=='checkbox') {
            if(e.target.checked) {
                value = e.target.value;
            } else {
                value = '';
            }
        }

        let { form } = this.state;
        form[e.target.name] = value;

        if(e.target.name=='type') {
            form['w9_country'] = '';
            form['w9_state'] = '';
            form['number'] = '';
            this.setState({w9StateList: []});
        }

        if(e.target.value=='usa') {
            form['is_business'] = 'no';
            form['w9_country'] = '223';
            this.getStateList(223, 'w9_country');
        }

        //ssn/ein reset
        if(e.target.name === 'is_business'){
            form['number'] = '';
        }
        //ssn/ein format
        if(e.target.name === 'number'){
            if(this.state.form.is_business === 'yes'){
                value = this.getFormattedEIN(e.target.value);
            }else{
                value = this.getFormattedSSN(e.target.value);
            }
            form[e.target.name] = value;
        }

        this.setState({
            form: form
        });
        
    }

    getFormattedSSN = (value) => {
        if (!value) return value;
        const ssn = value.replace(/[^\d]/g, '');
        const ssnLength = ssn.length;
        if (ssnLength < 4) return ssn;
        if (ssnLength < 6) {
            return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
        }
        return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
    }

    getFormattedEIN = (value) => {
        if (!value) return value;
        const ein = value.replace(/[^\d]/g, '');
        const einLength = ein.length;

        if (einLength < 3) return ein;

        return `${ein.slice(0, 2)}-${ein.slice(2,9)}`;
    }

    getCountryList = () => {
        let data = { all: 'yes' };
        AJAX_PUBLIC_REQUEST("POST", "user/getCountry", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({ countryList: results.response.data });
            }
        });
    }

    getCountryListWithoutUSCanada = () => {
        AJAX_PUBLIC_REQUEST("POST", "user/getCountryWithoutUSCanada", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({ countryListWithoutUSCanada: results.response.data });
            }
        });
    }

    getStateList = (countryId, name) => {
        let data = { country_id: countryId };
        AJAX_PUBLIC_REQUEST("POST", "user/getState", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                const states = results.response.data;
                if(name == 'country') {
                    this.setState({
                        stateList: states
                    })
                } else if(name == 'w9_country') {
                    this.setState({
                        w9StateList: states
                    })
                }
            }
            
        });
    }

    getClassificationList = () => {
        AJAX_PUBLIC_REQUEST("POST", "distributor/getClassificationList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({ classificationList: results.response.data });
            }
        });
    }

    onChangeCountry = (e) => {
        let { form } = this.state;
        form[e.target.name] = e.target.value;
        let countryId = e.target.value;

        this.setState({
            form: form
        });
        if(countryId == 223){
            document.getElementById("tax_type_usa").click();
        }else if(countryId == 38){
            document.getElementById("tax_type_canadian").click();
        } else if(countryId > 0){
            document.getElementById("tax_type_other").click();
        }

        this.getStateList(countryId, e.target.name);
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
        let { form } = this.state;
        const val_return = validateSignupNew(form,this.state);
        this.setState(val_return);
        if (val_return.isValid) {
            let data = new FormData();

            data.append('api_key', API_KEY);
            data.append('affiliate_code', form.affiliate_code);
            data.append('site', form.site);
            data.append('is_save_w9_information', 'yes');
            data.append('first_name', form.first_name);
            data.append('last_name', form.last_name);
            data.append('business_name', form.business_name);
            data.append('street', form.street);
            data.append('street2', form.street2);
            data.append('country', form.country);
            data.append('city', form.city);
            data.append('state', form.state);
            data.append('postcode', form.postcode);
            data.append('username', form.username);
            data.append('password', form.password);
            data.append('phone', form.phone);
            data.append('confirm_password', form.confirm_password);
            data.append('paypal_account', form.paypal_account);    
            // US Business Form Data            
            data.append('type', form.type);            
            data.append('is_business', form.is_business);            
            data.append('name', form.name);            
            data.append('number', form.number);        
            data.append('address_1', form.address_1);            
            data.append('address_2', form.address_2);            
            data.append('w9_country', form.w9_country);            
            data.append('w9_city', form.w9_city);            
            data.append('w9_state', form.w9_state);            
            data.append('w9_postcode', form.w9_postcode);               
            data.append('classification', form.classification);      
            // Canada Business Form Data
            data.append('canadian_goods_services_tax_status', form.canadian_goods_services_tax_status);    
            data.append('canadian_gst_account', form.canadian_gst_account);    
            data.append('canadian_gst_account_number', form.canadian_gst_account_number);    
            data.append('provincial_account', form.provincial_account);    
            data.append('provincial_account_number', form.provincial_account_number);
            //how you know others
            data.append('hear_about_us', this.state.how_you_know);
            data.append('hear_about_us_details', this.state.how_you_know_others);


            // how_you_know: this.state.how_you_know,
            //     how_you_know_others: this.state.how_you_know_others,
            // eSignature
            data.append('signature', form.signature);
                   
            this.setState({ errors: {}, isLoading: true });

            this.props.userSignupRequest(data).then(results => {
                if (results.response.code === 1000) {
                   // SET_STORAGE('alert_message', results.response.message);
                    this.setState({
                        isLoading: false,
                        isFormValid: true,
                        server_message: results.response.message,
                        success_alert_wrapper_show: true,
                        form: {
                            first_name: '',
                            last_name: '',
                            business_name: '',
                            street: '',
                            street2: '',
                            country: '',
                            city: '',
                            state: '',
                            postcode: '',
                            username: '',
                            password: '',
                            confirm_password: '',
                            phone:'',
                            paypal_account: '',

                            type: '',
                            // US Business Form
                            is_business: '',
                            name: '',
                            number: '',
                            address_1: '',
                            address_2: '',
                            w9_country: '',
                            w9_city: '',
                            w9_state: '',
                            w9_postcode: '',
                            classification: '',
                            // US Checkbox
                            is_information_provided: '',
                            penalties_perjury: '',
                            // Canada Business Form
                            canadian_goods_services_tax_status: '',
                            canadian_gst_account: '',
                            canadian_gst_account_number: '',
                            provincial_account: '',
                            provincial_account_number: '',
                            canadian_gst_completed: '',
                            // Others Business Form
                            affiliate_agreement: '',
                            terms_of_service_agree: '',
                            // eSignature
                            signature: '',
                        }
                    });
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    this.timeOut(5000);
                    DELETE_COOKIE('af');
                    DELETE_COOKIE('site');

                    //history.push('/login');
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
            //document.querySelector("body").scrollIntoView();
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

    // Digital eSIgnature
    clearSignature = () => {
        this.eSignature.clear()
        this.setSignature();
    }

    saveSignature = () => {
        let data = this.eSignature.toDataURL();
        this.setSignature(data);
        this.setState({signatureModalDisplay: false})
    }

    setSignature = (signature='') => {
        let { form } = this.state;
        form['signature'] = signature;

        this.setState({
            form: form,
            signatureButtonDisabled: true
        });
    }

    signatureModalDisplay = () => {
        this.setState({ signatureModalDisplay: !this.state.signatureModalDisplay, signatureButtonDisabled: true })
    }

    signatureButtonDisabled = () => {
        let data = this.eSignature.toDataURL();
        let isDisabled = true;
        if(data) {
            isDisabled = false;
        }
        this.setState({ signatureButtonDisabled: isDisabled })
    }

    render() {
        const { errors, server_message, form } = this.state;
        const errors_data = server_message;

        return (
            <div className="registration-form">

                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={this.state.success_alert_wrapper_show} />
                <form onSubmit={this.onSubmit} method="post" id="registration_Form" className="register action_form" encType="multipart/form-data">
                    <div className="form-group pull-left name_field has-error">
                        <label className={classnames(null, { 'pl_error_label': errors.first_name })} htmlFor="reg_sr_first_name">First Name  <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.first_name })} name="first_name" id="reg_sr_first_name" value={form.first_name} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group pull-right name_field">
                        <label className={classnames(null, { 'pl_error_label': errors.last_name })} htmlFor="reg_sr_last_name">Last Name <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.last_name })} name="last_name" id="reg_sr_last_name" value={form.last_name} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <label className="">Business Name (As listed on your W-9 or GST) </label>
                        <input onChange={this.changeHandler} value={form.business_name} type="text" className={classnames("cus_field", { 'pl_error_input': errors.business_name })} name="business_name" placeholder="" />
                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.street })} htmlFor="reg_sr_street">Street Address <span className="required">*</span> <small>(As listed on your W-9 or GST)</small></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.street })} name="street" id="reg_sr_street" value={form.street} onChange={this.changeHandler} placeholder="House number or street name" />
                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.street2 })} htmlFor="reg_sr_street2"></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.street2 })} name="street2" id="reg_sr_street2" value={form.street2} onChange={this.changeHandler} placeholder="Apartment, suite, unit etc. (optional)" />
                    </div>
                    <div className="clearfix"></div>
                    <div className="form-group pull-left name_field">
                        <label className={classnames(null, { 'pl_error_label': errors.city })} htmlFor="reg_sr_city">Town/City <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.city })} name="city" id="reg_sr_city" value={form.city} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group pull-right name_field">
                        <label className={classnames(null, { 'pl_error_label': errors.country })} htmlFor="reg_sr_country">Country <span className="required">*</span></label>
                        <select onChange={this.onChangeCountry} value={form.country} name="country" className={classnames("cus_field", { 'pl_error_input': errors.country })}>
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
                        <select onChange={this.changeHandler} value={form.state} name="state" className={classnames("cus_field", { 'pl_error_input': errors.state })}>
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
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.postcode })} name="postcode" id="reg_sr_postcode" value={form.postcode} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.username })} htmlFor="reg_username">Username (email address) <span className="required">*</span></label>
                        <input onBlur={this.haveExistsUser} type="text" className={classnames("cus_field", { 'pl_error_input': errors.username })} name="username" id="reg_username" value={form.username} onChange={this.changeHandler} />
                    </div>

                    {
                        (this.state.haveExistsUser == 0) ?
                            <Fragment>
                                <div className="form-group pull-left name_field has-error">
                                    <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="reg_password">Password <span className="required">*</span></label>
                                    <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.password })} name="password" id="reg_password" value={form.password} onChange={this.changeHandler} />
                                </div>
                                <div className="form-group pull-right name_field has-error">
                                    <label className={classnames(null, { 'pl_error_label': errors.confirm_password })} htmlFor="reg_confirm_password">Confirm Password <span className="required">*</span></label>
                                    <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.confirm_password })} name="confirm_password" id="reg_confirm_password" value={form.confirm_password} onChange={this.changeHandler} />
                                </div>
                            </Fragment>
                            :
                            <Fragment>
                                <div className="form-grouphas-error">
                                    <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="reg_password">Your Existing Password <span className="required">*</span></label>
                                    <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.password })} name="password" id="reg_password" value={form.password} onChange={this.changeHandler} />
                                </div>
                            </Fragment>
                    }
                    <div className="clearfix"></div>
                    <div className="form-group">
                        <label className="">Phone No <span className="required">*</span> </label>
                        <input  value={form.phone} onChange={this.changeHandler}  type="text" className={classnames("cus_field", { 'pl_error_input': errors.phone })} name="phone" placeholder="" />
                    </div>

                    <div className="form-group">
                        <label className="">PayPal Email <span className="required">*</span> (This is where we will send your earnings) </label>
                        <input onChange={this.changeHandler} value={form.paypal_account} type="text" className={classnames("cus_field", { 'pl_error_input': errors.paypal_account })} name="paypal_account" placeholder="" />
                    </div>


                    {
                        // start How did you hear about us?
                        (this.state.isEnableHowYouKnow == "yes") ?
                            <Fragment>
                                <div className="form-group">
                                    <label className="dis_checkout_label">How'd you hear about us? <span className="required">*</span> </label>
                                    <select onChange={this.howKnowChangeHandler} value={this.state.how_you_know} name="how_you_know" id="how_you_know" className={classnames("cus_field", { 'pl_error_input': errors.how_you_know })}>
                                        <option   value="">Select One</option>
                                        <option  key={Math.random()} value="Gym Launch">Gym Launch</option>
                                        <option key={Math.random()} value="Alex and Leila Hormozi">Alex and Leila Hormozi </option>
                                        <option key={Math.random()} value="Google">Google</option>
                                        <option key={Math.random()} value="Social Media">Social Media</option>
                                        <option key={Math.random()} value="Friend Referral">Friend Referral</option>
                                        <option key={Math.random()} value="others">Others</option>
                                    </select>
                                </div>
                                {
                                    (this.state.isKnowOthers && this.state.isKnowOtherInput==false) ?
                                        <div className="form-group">
                                            <textarea onChange={this.howKnowOtherHendler} value={this.state.how_you_know_others} name="how_you_know_others" className={classnames("cus_field", { 'pl_error_input': errors.how_you_know_others })}  placeholder={this.state.how_you_know} rows="1" cols="2">{this.state.how_you_know_others}</textarea>
                                        </div>
                                        : ""
                                }

                                {
                                    (this.state.isKnowOthers && this.state.isKnowOtherInput) ?
                                        <div className="form-group">
                                            <input onChange={this.howKnowOtherHendler} value={this.state.how_you_know_others} name="how_you_know_others" className={classnames("cus_field", { 'pl_error_input': errors.how_you_know_others })}  placeholder={this.state.how_you_know}/>
                                        </div>
                                        : ""
                                }

                            </Fragment>
                            : ""
                        // end How did you hear about us?
                    }



                    <div className="clearfix"></div>
                        <div className="form-group">
                            <div className="col-form-label">
                                <label className={classnames(null, { 'pl_error_checkbox': errors.type })}>Tax Form Types <span className="required">*</span> </label>
                            </div>
                            <div className="row">
                                 <div className="col-sm-6">
                                      <label className="label-center"><input type="radio" name="type" id="tax_type_usa" value="usa" onChange={this.changeHandler} /> US Individual or Business</label>
                                      <label className="label-center"><input type="radio" name="type" id="tax_type_other" value="other" onChange={this.changeHandler} /> Other International Individual or Business </label>
                                 
                                  </div>   
                                   <div className="col-sm-6"> 
                                     <label className="label-center"><input type="radio" name="type" id="tax_type_canadian" value="canadian" onChange={this.changeHandler} /> Canadian Individual or Business </label>
                                 
                                   
                                  </div>  
                            </div> 
                        </div>

                    {/* <div className="form-group">
                        <label className={classnames(null, { 'pl_error_checkbox': errors.type })}>Tax Form Types <span className="required">*</span> </label>
                        <div className="form-group ml-5 mt-2">
                            <label><input type="radio" name="type" value="usa" onChange={this.changeHandler} /> US Individual or Business</label>
                            <label><input type="radio" name="type" value="canadian" onChange={this.changeHandler} /> Canadian Individual or Business </label>
                            <label><input type="radio" name="type" value="other" onChange={this.changeHandler} /> Other International Individual or Business </label>
                       
                        </div>
                    </div> */}
                    <div className="clearfix"></div>

                    {/* US Business Form Data */}
                    <div className="form-group">
                        {
                            (form.type=='usa' )?
                            <Fragment>
                                <h4 className="form-group-title">US Individual or Business</h4>
                                <Fragment>
                                    <div className="form-group   mt-2">
                                        <div className="col-form-label">
                                          <label className={classnames(null, { 'pl_error_checkbox': errors.is_business })}>Individual / Business<span className="required">*</span> </label>
                                        </div>
                                        <div className="row">
                                             <div className="col-sm-12">
                                             <label className="label-center"><input type="radio" name="is_business" value="no" onChange={this.changeHandler} defaultChecked={form.is_business=='no'} /> Individual</label>  
                                             </div>
                                               <div className="col-sm-12">
                                                    <label className="label-center"><input type="radio" name="is_business" value="yes" onChange={this.changeHandler} /> Business</label>
                                                </div> 
                                        </div>  

                                    </div>
                                </Fragment>                                
                                <Fragment>
                                    {
                                        (form.is_business=='no' )?
                                        <div className="form-group">
                                            <div className="form-group pull-left name_field">
                                                <label className={classnames(null, { 'pl_error_label': errors.name })} htmlFor="name">Personal Name <span className="required">*</span></label>
                                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.name })} name="name" id="name" value={form.name} onChange={this.changeHandler} />
                                            </div>
                                            <div className="form-group pull-right name_field">
                                                <label className={classnames(null, { 'pl_error_label': errors.number })} htmlFor="name">Social Security Number <span className="required">*</span></label>
                                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.number })} name="number" id="number" value={form.number} onChange={this.changeHandler} />
                                            </div>
                                        </div>
                                        : ''
                                    }
                                </Fragment>
                                <Fragment>
                                    {
                                        (form.is_business=='yes' )?
                                        <div className="form-group">
                                            <div className="form-group pull-left name_field">
                                                <label className={classnames(null, { 'pl_error_label': errors.name })} htmlFor="name">Business Name <span className="required">*</span></label>
                                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.name })} name="name" id="name" value={form.name} onChange={this.changeHandler} />
                                            </div>
                                            <div className="form-group pull-right name_field">
                                                <label className={classnames(null, { 'pl_error_label': errors.number })} htmlFor="name">Business Tax ID Number <span className="required">*</span></label>
                                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.number })} name="number" id="number" value={form.number} onChange={this.changeHandler} />
                                            </div>
                                        </div>
                                        :''
                                    }
                                </Fragment>

                                <Fragment>
                                    <div className="clearfix"></div>
                                    <div className="form-group">
                                        <label className={classnames(null, { 'pl_error_label': errors.address_1 })} htmlFor="reg_sr_address_1">Street Address <span className="required">*</span> <small>(As listed on your W-9 or GST)</small></label>
                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.address_1 })} name="address_1" id="reg_sr_address_1" value={form.address_1} onChange={this.changeHandler} placeholder="House number or street name" />
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="form-group">
                                        <label className={classnames(null, { 'pl_error_label': errors.address_2 })} htmlFor="reg_sr_address_2"></label>
                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.address_2 })} name="address_2" id="reg_sr_address_2" value={form.address_2} onChange={this.changeHandler} placeholder="Apartment, suite, unit etc. (optional)" />
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="form-group pull-left name_field">
                                        <label className={classnames(null, { 'pl_error_label': errors.w9_city })} htmlFor="reg_sr_w9_city">Town/City <span className="required">*</span></label>
                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.w9_city })} name="w9_city" id="reg_sr_w9_city" value={form.w9_city} onChange={this.changeHandler} />
                                    </div>
                                    <div className="form-group pull-right name_field">
                                        <label className={classnames(null, { 'pl_error_label': errors.w9_country })} htmlFor="reg_sr_w9_country">Country <span className="required">*</span></label>
                                        <select onChange={this.onChangeCountry} value={form.w9_country} name="w9_country" className={classnames("cus_field", { 'pl_error_input': errors.w9_country })}>
                                            {
                                                (this.state.countryList.length <= 0) ? null :
                                                    this.state.countryList.map(function (country, key) {
                                                        if(country.id==223) {
                                                            return (
                                                                <option key={key} value={country.id}>{country.name}</option>
                                                            )
                                                        } else {
                                                            return null
                                                        }
                                                    }.bind(this))
                                            }
                                        </select>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="form-group pull-left name_field has-error">
                                        <label className={classnames(null, { 'pl_error_label': errors.w9_state })} htmlFor="reg_sr_w9_state">State <span className="required">*</span></label>
                                        <select onChange={this.changeHandler} value={form.w9_state} name="w9_state" className={classnames("cus_field", { 'pl_error_input': errors.w9_state })}>
                                            <option value="">Select a state...</option>
                                            {
                                                (this.state.w9StateList.length <= 0) ? null :
                                                    this.state.w9StateList.map(function (state, key) {
                                                        return (
                                                            <option key={key} value={state.code}>{state.name}</option>
                                                        )
                                                    }.bind(this))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group pull-right name_field">
                                        <label className={classnames(null, { 'pl_error_label': errors.w9_postcode })} htmlFor="reg_sr_w9_postcode">Zip <span className="required">*</span></label>
                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.w9_postcode })} name="w9_postcode" id="reg_sr_w9_postcode" value={form.w9_postcode} onChange={this.changeHandler} />
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="form-group">
                                        <label className={classnames(null, { 'pl_error_label': errors.classification })} htmlFor="classification">Please Select Classification of the Information provided above: <span className="required">*</span></label>
                                        <select onChange={this.changeHandler} value={form.classification} name="classification" className={classnames("cus_field", { 'pl_error_input': errors.classification })}>
                                            <option value=""> Select Classification of the Information...</option>
                                            {
                                                (this.state.classificationList.length <= 0) ? null :
                                                    this.state.classificationList.map(function (item, key) {
                                                        return (
                                                            <option key={key} value={item}>{item}</option>
                                                        )
                                                    }.bind(this))
                                            }
                                        </select>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="form-group">
                                        <label className={classnames("d-flex align-content-start", { 'pl_error_checkbox': errors.is_information_provided })}>
                                            <input className={classnames(null, { 'pl_error': errors.is_information_provided })} name="is_information_provided" type="checkbox" id="is_information_provided" value='yes' onChange={this.changeHandler} />
                                            <span className="redio-text-lable"> I understand that the information provided above is in replacement of a formal W-9 form. 
                                            </span>
                                        </label>
                                    </div>

                                    <div className="clearfix"></div>
                                    <div className="form-group">
                                        <label className={classnames("label-center", { 'pl_error_checkbox': errors.penalties_perjury })}>
                                            <input className={classnames(null, { 'pl_error': errors.penalties_perjury })} name="penalties_perjury" type="checkbox" id="penalties_perjury" value='yes' onChange={this.changeHandler} />
                                            <span> Under penalties of perjury, I certify that:</span>
                                        </label>
                                        <div className="ml-3 register-order-last">
                                            {/* <label className={classnames(null, { 'pl_error_checkbox': errors.penalties_perjury_type })}><input type="radio" name="penalties_perjury_type" value="The number shown on this form is my correct taxpayer identification number" onChange={this.changeHandler} /> The number shown on this form is my correct taxpayer identification number </label>
                                            <label className={classnames(null, { 'pl_error_checkbox': errors.penalties_perjury_type })}><input type="radio" name="penalties_perjury_type" value="I am a U.S. citizen or other U.S. person" onChange={this.changeHandler} /> I am a U.S. citizen or other U.S. person </label>
                                            <label className={classnames(null, { 'pl_error_checkbox': errors.penalties_perjury_type })}><input type="radio" name="penalties_perjury_type" value="The information provided is accurate to the information registered with the Internal Revenue Service" onChange={this.changeHandler} /> The information provided is accurate to the information registered with the Internal Revenue Service </label>
                                             */}
                                              <ul>
                                                   <li>The number shown on this form is my correct taxpayer identification number</li>
                                                   <li>I am a U.S. citizen or other U.S. person</li>
                                                   <li>The information provided is accurate to the information registered with the Internal Revenue</li>
                                              </ul>
                                        </div>                                     
                                    </div>
                                </Fragment>
                            </Fragment>
                            :''
                        }                    
                    </div>


                    {/* Canadian Business Form Data */}
                    {
                        <div className="form-group">
                            {
                                (form.type=='canadian' )?
                                <Fragment>
                                    <h4 className="form-group-title">Canadian Individual or Business</h4>
                                    <label className={classnames("d-flex align-content-start", { 'pl_error_checkbox': errors.canadian_goods_services_tax_status})}><input type="radio" name="canadian_goods_services_tax_status" value="yes" onChange={this.changeHandler} /><span className="redio-text-lable"> Yes, I wish to have the Goods & Services Tax, Harmonized Sales Tax and/or Provincial Sales Tax issued to me on my earnings from Prestige Labs.  I attest that I have read and agree to the terms laid out in the <a href="/affiliate-canadian-tax--commissions" target="_blank" className="text-dark"><u>Notice to Levy Canadian Tax on Commissions Paid to Registered Canadian Affiliate</u></a>. </span></label>
                                    {
                                        (form.canadian_goods_services_tax_status=='yes')?
                                        <div className="mt-3">
                                            <div className="clearfix"></div>
                                            <div className="form-group">
                                                <label className="">Registered Canadian GST/HST Account Number <span className="required">*</span></label>
                                                <input onChange={this.changeHandler} value={form.canadian_gst_account_number} type="text" className={classnames("cus_field", { 'pl_error_input': errors.canadian_gst_account_number })} name="canadian_gst_account_number" placeholder="" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="form-group">
                                                <label className="">Name listed on Canadian GST/HST Account <span className="required">*</span></label>
                                                <input onChange={this.changeHandler} value={form.canadian_gst_account} type="text" className={classnames("cus_field", { 'pl_error_input': errors.canadian_gst_account })} name="canadian_gst_account" placeholder="" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="form-group">
                                                <label className="">Provincial Account Number</label>
                                                <input onChange={this.changeHandler} value={form.provincial_account_number} type="text" className={classnames("cus_field", { 'pl_error_input': errors.provincial_account_number })} name="provincial_account_number" placeholder="" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="form-group">
                                                <label className="">Name listed on Provincial Account</label>
                                                <input onChange={this.changeHandler} value={form.provincial_account} type="text" className={classnames("cus_field", { 'pl_error_input': errors.provincial_account })} name="provincial_account" placeholder="" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="form-group">
                                                <label className={classnames("d-flex align-content-start", { 'pl_error_checkbox': errors.canadian_gst_completed })}>
                                                    <input className={classnames(null, { 'pl_error': errors.canadian_gst_completed })} name="canadian_gst_completed" type="checkbox" id="canadian_gst_completed" value='yes' onChange={this.changeHandler} />
                                                    <span className="redio-text-lable"> I understand that if the information above is not completed that I will not receive GST/HST and/or PST on the Prestige Labs earnings.
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        :''
                                    }
                                    <label className={classnames("d-flex  align-content-start", { 'pl_error_checkbox': errors.canadian_goods_services_tax_status})}><input type="radio" name="canadian_goods_services_tax_status" value="no" onChange={this.changeHandler} /> <span className="redio-text-lable"> No, I decline the option to receive the Goods & Services Tax, Harmonized Sales Tax and/or Provincial Sales Tax issued to me on my earnings from Prestige Labs. I attest that GLS Labs LLC dba Prestige Labs will be held harmless for any Canada Revenue Agency taxes on these earnings.</span> </label>
                                </Fragment>
                                : ''
                            }
                        </div>
                    }

                    {/* Others Business Form Data  */}
                    {
                        <div className="form-group">
                            {
                                (form.type=='other') ? 
                                <Fragment>
                                    <h4 className="form-group-title">Other International Individual or Business</h4>
                                    <div className="form-group pull-left name_field">
                                        <label className={classnames(null, { 'pl_error_label': errors.w9_country })} htmlFor="reg_sr_w9_country">Country <span className="required">*</span></label>
                                        <select onChange={this.onChangeCountry} value={form.w9_country} name="w9_country" className={classnames("cus_field", { 'pl_error_input': errors.w9_country })}>
                                            <option value="">Select a Country…</option>
                                            {
                                                (this.state.countryListWithoutUSCanada.length <= 0) ? null :
                                                    this.state.countryListWithoutUSCanada.map(function (country, key) {
                                                        return (
                                                            <option key={key} value={country.id}>{country.name}</option>
                                                        )
                                                    }.bind(this))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group pull-right name_field has-error">
                                        <label className={classnames(null, { 'pl_error_label': errors.w9_state })} htmlFor="reg_sr_w9_state">State <span className="required">*</span></label>
                                        <select onChange={this.changeHandler} value={form.w9_state} name="w9_state" className={classnames("cus_field", { 'pl_error_input': errors.w9_state })}>
                                            <option value="">Select a state...</option>
                                            {
                                                (this.state.w9StateList.length <= 0) ? null :
                                                    this.state.w9StateList.map(function (state, key) {
                                                        return (
                                                            <option key={key} value={state.code}>{state.name}</option>
                                                        )
                                                    }.bind(this))
                                            }
                                        </select>
                                    </div>
                                    <div className="clearfix"></div>
                                </Fragment>
                                : ''
                            }
                        </div>
                    }

                    <div className="clearfix" style={{ marginTop: '35px' }}></div>
                    <div className="clearfix"></div>
                    <div className="clearfix"></div>
                    <div className="form-group">
                        <label className={classnames("d-flex align-content-start", {'pl_error_checkbox': errors.affiliate_agreement})}>
                            <input className={classnames(null, {'pl_error': errors.affiliate_agreement})} name="affiliate_agreement" type="checkbox" id="affiliate_agreement" value='yes' onChange={this.changeHandler}/>
                            <span className="redio-text-lable">
                                <strong>By clicking here, I agree to be bound by the <NavLink onClick={this.showAgreementModal} to="#">Prestige Lab Affiliate Agreement</NavLink></strong>
                                            </span>
                        </label>
                    </div>
                    <div className="form-group">
                        <label className={classnames('d-flex align-content-start', {'pl_error_checkbox': errors.terms_of_service_agree})}>
                            <input className={classnames(null, {'pl_error': errors.terms_of_service_agree})} name="terms_of_service_agree" type="checkbox" id="terms_of_service_agree" value='yes' onChange={this.changeHandler}/>
                            <span className="redio-text-lable">  I agree to be contacted by Prestige Labs and Gym Launch Secrets via the number and email provided about my application as well as offers and deals, including through the use of automated technology. I understand that consent is not a condition to purchase anything.
                                            </span>
                        </label>
                    </div>

                    <div className="clearfix" style={{ marginTop: '35px' }}></div>
                    <div className="clearfix"></div>

                    <div className="form-group justify-content-center">

                        <Modal
                            className=""
                            containerClassName="signature-modal"
                            closeOnOuterClick={false}
                            show={this.state.signatureModalDisplay}
                            onClose={() => this.signatureModalDisplay()}
                        >
                            <a className="signature-modal-close" style={closeStyle} onClick={() => this.signatureModalDisplay()}>X</a>
                            <div className="e-signature">
                                <SignatureCanvas
                                    ref={(ref) => {
                                        this.eSignature = ref
                                    }}
                                    penColor='black'
                                    canvasProps={{width: 360, height: 150, className: 'sigCanvas'}}
                                    minWidth={0.5}
                                    maxWidth={1.5}
                                    minDistance={5}
                                    dotSize={() => (this.minWidth + this.maxWidth) / 2}
                                    onEnd={() => this.signatureButtonDisabled()}
                                />
                                <button type="button" className="btn-clear" onClick={this.clearSignature} disabled={this.state.signatureButtonDisabled}>Clear</button>
                                &nbsp;
                                <button type="button" className="cus_button" onClick={this.saveSignature} disabled={this.state.signatureButtonDisabled}>Continue</button>
                            </div>
                        </Modal>
                        {form.signature ?
                            <div className="form-group signature d-flex align-items-center justify-content-center">
                                <img src={form.signature}/>
                            </div>
                            :
                            <> </>
                        }

                        {
                            (form.type != '') ?
                                <div className="d-flex align-items-center justify-content-center w-100">
                                    <button type="button" className={classnames('btn-signature', {'pl_error_checkbox': errors.signature})} onClick={() => this.signatureModalDisplay()}>{form.signature ? 'Change Signature' : 'Electronic Signature'}</button>
                                </div>
                                : ''
                        }

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

RegistrationFormNew.propTypes = {
    userSignupRequest: PropTypes.func.isRequired
}

export default connect(null, { userSignupRequest })(RegistrationFormNew);