import React, { Component, Fragment } from 'react';
import history from '../../../history';
import classnames from 'classnames';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';
import validateBillingAddress from '../../../Validations/validateBillingAddress';
import $ from "jquery";

class EditBillingAddress extends Component {
    constructor(props){
        super(props);
        this.state={
            loading                 :true,
            action_btn_label        :false,
            countryList             :[],
            stateList               :[],
            billing_first_name      :'',
            billing_last_name       :'',
            billing_company         :'',
            billing_address_1       :'',
            billing_address_2       :'',
            billing_city            :'',
            billing_postcode        :'',
            billing_country         :'',
            billing_state           :'',
            billing_phone           :'',
            billing_email           :'',
            success_alert_wrapper_show: false,
            errors: {},
            isValid:false,
            isLoading:false,
            isFormValid:true,
            server_message:'',
        }
        document.title = "Edit Billing Address -Prestige Labs";
    }

    componentDidMount() {    
        document.querySelector("body").scrollIntoView(); 
        this.getBillingAddress();
        this.getCountryList(); 
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getCountryList = () => {
        AJAX_REQUEST("POST", "user/getCountry", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({ countryList: results.response.data });		
            }           
        });
    }

    getStateList = (countryId) => {
        let data = {country_id: countryId};
        AJAX_REQUEST("POST", "user/getState", data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({ stateList: results.response.data });		
            } else {
                this.setState({stateList: []})
            }            
        });
    }

    onChangeCountry = (e) => {
        let countryId = e.target.value;
        this.setState({ [e.target.name]: countryId })
        this.getStateList(countryId);
    }
    
    getBillingAddress = () => {
        AJAX_REQUEST("POST", "user/billingDetails", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    loading: false,
                    billing_first_name         :results.response.data.billing_first_name,
                    billing_last_name          :results.response.data.billing_last_name,
                    billing_company            :results.response.data.billing_company,
                    billing_address_1          :results.response.data.billing_address_1,
                    billing_address_2          :results.response.data.billing_address_2,
                    billing_city               :results.response.data.billing_city,
                    billing_postcode           :results.response.data.billing_postcode,
                    billing_country            :results.response.data.billing_country_id,
                    billing_state              :results.response.data.billing_state,
                    billing_phone              :results.response.data.billing_phone,
                    billing_email              :results.response.data.billing_email
                });	
                this.getStateList(this.state.billing_country);
            } else {
                this.setState({
                    loading: false,
                    error_meg:results.response.message,
                })
            }            
        });
    }

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                success_alert_wrapper_show: false
            });
            history.push('/my-account/edit-addresses');
        }.bind(this),timedata);
    }
        
    onSubmitHandler = (e) => {
        e.preventDefault();
        const val_return = validateBillingAddress(this.state);
        this.setState(val_return);
        if(val_return.isValid){
            this.setState({errors: {}, isLoading: true,action_btn_label: true,server_message:''});
            const data = {
                    billing_first_name         :this.state.billing_first_name,
                    billing_last_name          :this.state.billing_last_name,
                    billing_company            :this.state.billing_company,
                    billing_address_1          :this.state.billing_address_1,
                    billing_address_2          :this.state.billing_address_2,
                    billing_city               :this.state.billing_city,
                    billing_postcode           :this.state.billing_postcode,
                    billing_country            :this.state.billing_country,                
                    billing_state              :this.state.billing_state,
                    billing_phone              :this.state.billing_phone,
                    billing_email              :this.state.billing_email,
                }
            AJAX_REQUEST("POST","user/updateBillingAddress", data).then(results => {
                if(parseInt(results.response.code)===1000) {
                    this.setState({
                        server_message: results.response.message,
                        isFormValid:true,
                        isLoading:false,
                        action_btn_label: false,
                        success_alert_wrapper_show: true
                    });
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    this.timeOut(5000);
                } 
                else{
                    this.setState({
                        server_message: results.response.message,
                        isFormValid:false,
                        isLoading:false,
                        action_btn_label: false,
                        success_alert_wrapper_show: false
                    });
                }          
            });
        }
    }

    render() { 
        const { server_message, success_alert_wrapper_show, errors, isLoading } = this.state;
        const errors_data = server_message;
        return ( 
            <Fragment>
                {
                    (this.state.loading)? 
                    <div className="loading"></div>
                    :
                    <Fragment>
                        <h2 className="montserrat page-title">Billing address</h2>
                        <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                        <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show}/>
                        <form onSubmit={this.onSubmitHandler} method="post" className="edit_account_form action_form" encType="multipart/form-data">
                            <div className="form-group pull-left name_field">
                                <label>First Name <span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_first_name })} name="billing_first_name" id="" onChange={this.changeHandler} value={this.state.billing_first_name} />
                            </div>
                            <div className="form-group pull-right name_field">
                                <label>Last Name <span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_last_name })} name="billing_last_name" id="" onChange={this.changeHandler} value={this.state.billing_last_name} />
                            </div>
                            <div className="clearfix"></div>
                            <div className="form-group">
                                <label>Company Name (optional)</label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_company })} name="billing_company" id="" onChange={this.changeHandler} value={this.state.billing_company} />                                    
                            </div>
                            <div className="form-group">
                                <label>Country <span className="required">*</span></label>
                                <select onChange={this.onChangeCountry} value={this.state.billing_country} name="billing_country" className={classnames("cus_field", { 'pl_error_input': errors.billing_country })}>
                                    <option value="">Select a Country…</option>
                                    { 
                                        (this.state.countryList.length <= 0 )? null : 
                                        this.state.countryList.map(function(country, key){
                                            return (
                                                <option key={key} value={country.id}>{country.name}</option>
                                            )                     
                                        }.bind(this))
                                    } 
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Street Address <span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_address_1 })} name="billing_address_1" id="" onChange={this.changeHandler} value={this.state.billing_address_1}/>
                            </div>
                            <div className="form-group">
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_address_2 })} name="billing_address_2" id="" onChange={this.changeHandler} value={this.state.billing_address_2} placeholder="Apartment, suite, unit etc. (optional)"/>
                            </div>
                            <div className="form-group">
                                <label>Town / City <span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_city })} name="billing_city" id="" onChange={this.changeHandler} value={this.state.billing_city} />
                            </div>
                            <div className="form-group">
                                <label>State  <span className="required">*</span></label>
                                <select onChange={this.changeHandler} value={this.state.billing_state} name="billing_state" className={classnames("cus_field", { 'pl_error_input': errors.billing_state })}>
                                    <option value="">Select a state...</option>
                                    { 
                                        (this.state.stateList.length <= 0 ) ? null :
                                        this.state.stateList.map(function(state, key){
                                            return (
                                                <option key={key} value={state.code}>{state.name}</option>
                                            )                     
                                        }.bind(this))
                                    } 
                                </select>
                            </div>
                            <div className="form-group">
                                <label>ZIP<span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_postcode })} name="billing_postcode" id="" onChange={this.changeHandler} value={this.state.billing_postcode} />
                            </div>
                            <div className="form-group">
                                <label className="">Phone <span className="required">*</span> </label>
                                <input onChange={this.changeHandler} value={this.state.billing_phone} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_phone })} name="billing_phone" placeholder="" />
                            </div>
                            <div className="form-group">
                                <label className="">Email Address <span className="required">*</span> </label>
                                <input onChange={this.changeHandler} value={this.state.billing_email} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_email })} name="billing_email" placeholder="" />
                            </div>
                            <p>Update the billing used for all of my active subscriptions (optional)</p>
                            <div className="">	
                                <button type="submit" disabled={this.state.isLoading} className="roboto_condensed cus_button" name="login" value="Login">{this.state.action_btn_label?"Saving...":"Save Changes"}</button>
                            </div>
                        </form>
                    </Fragment>
                }                
            </Fragment> 
        );
    }
}
 
export default EditBillingAddress;