import React, { Component, Fragment } from 'react';
import { API_KEY, AJAX_REQUEST} from "../../../../Constants/AppConstants";
import AlertWrapper from '../../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../../Common/AlertWrapperSuccess';
import $ from 'jquery';
import history from "../../../../history";
import SignatureCanvas from 'react-signature-canvas';
import Modal, {closeStyle} from 'simple-react-modal';
import validateW9Form from '../../../../Validations/ValidateW9Form';
import classnames from 'classnames';
import Parser from 'html-react-parser';

class W9FormInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            countryList: [],
            countryListWithoutUSCanada: [],
            w9StateList: [],
            isEditable: false,
            classificationList: [],
            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            server_message: '',
            success_alert_wrapper_show: false,
            signatureModalDisplay: false,
            signatureButtonDisabled: true,
            
            form: {
                api_key: API_KEY,
                type: '',
                // US Business Form
                is_business: '',
                name: '',
                number: '',
                address_1: '',
                address_2: '',
                country_name: '',
                w9_country: '',
                w9_city: '',
                w9_state: '',
                w9_postcode: '',
                classification: '',
                // Canada Business Form
                canadian_goods_services_tax_status: '',
                canadian_gst_account: '',
                canadian_gst_account_number: '',
                provincial_account: '',
                provincial_account_number: '',
                // eSignature
                signature: '',
            }
        }
        document.title = "Tax Form Information -Prestige Labs";
    }

    componentDidMount() {
        this.getAffiliateW9Information();
        this.getCountryList();
        this.getCountryListWithoutUSCanada();
        this.getClassificationList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.isEditable !== prevState.isEditable && prevState.isEditable === true && this.state.isEditable === false){
            this.setState({ loading: true });
            this.getAffiliateW9Information();
        }
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
            this.setState({w9StateList: []});
        }

        if(e.target.value=='usa') {
            form['is_business'] = 'no';
            form['w9_country'] = '223';
            this.getStateList(223, 'w9_country');
        }

        //ssn/ein reset
        if(e.target.name === 'is_business'){
            if(e.target.value === 'yes'){
                value = this.getFormattedEIN(this.state.form.number);
            }else{
                value = this.getFormattedSSN(this.state.form.number);
            }
            form['number'] = value;
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
        AJAX_REQUEST("POST", "user/getCountry", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({ countryList: results.response.data });
            }
        });
    }

    getCountryListWithoutUSCanada = () => {
        AJAX_REQUEST("POST", "user/getCountryWithoutUSCanada", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({ countryListWithoutUSCanada: results.response.data });
            }
        });
    }

    getStateList = (countryId) => {
        let data = { country_id: countryId };
        AJAX_REQUEST("POST", "user/getState", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    w9StateList: results.response.data,
                })
            } else {
                this.setState({w9StateList: []})
            }
            
        });
    }

    getClassificationList = () => {
        AJAX_REQUEST("POST", "distributor/getClassificationList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({ classificationList: results.response.data });
            }
        });
    }

    getAffiliateW9Information = () => {
        AJAX_REQUEST("POST","distributor/getAffiliateW9Information",{}).then(results => {
            const response = results.response;
            if(parseInt(response.code)===1000) {
                let data = response.data? response.data : '';
                let {form} = this.state;    

                if(data) {
                    form = {
                        type: data.type,
                        // US Business Form
                        is_business: data.is_business,
                        name: data.name,
                        number: data.number,
                        address_1: data.address_1,
                        address_2: data.address_2,
                        country_name: data.country_name,
                        w9_country: data.country_id,
                        w9_city: data.city,
                        w9_state: data.state,
                        w9_postcode: data.postcode,
                        classification: data.classification,
                        // Canada Business Form
                        canadian_goods_services_tax_status: data.canadian_goods_services_tax_status,
                        canadian_gst_account: data.canadian_gst_account,
                        canadian_gst_account_number: data.canadian_gst_account_number,
                        provincial_account: data.provincial_account,
                        provincial_account_number: data.provincial_account_number,
                        // eSignature
                        signature: data.signature,
                    }

                    this.getStateList(data.country_id);
                }

                this.setState({
                    loading: false,
                    form
                });	
            }
        });
    }

    onChangeCountry = (e) => {
        let { form } = this.state;
        form[e.target.name] = e.target.value;
        form['w9_state'] = ''
        let countryId = e.target.value;

        this.setState({
            form: form
        });

        this.getStateList(countryId);
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false
            });
            history.push('/my-account/w-9-form-information');
        }.bind(this), timedata);
    }

    onSubmit = (e) => {
        e.preventDefault();
        let { form } = this.state;
        const val_return = validateW9Form(form);
        this.setState(val_return);
        if (val_return.isValid) {
            this.setState({ errors: {}, isLoading: true });
            AJAX_REQUEST("POST", "distributor/updateAffiliateW9Information", form).then(results => {
                if (results.response.code === 1000) {
                    this.setState({
                        isLoading: false,
                        isFormValid: true,
                        server_message: results.response.message,
                        success_alert_wrapper_show: true,
                    });
                    this.getAffiliateW9Information();
                    this.timeOut(2000);
                } else {
                    this.setState({
                        server_message: results.response.message,
                        isLoading: false,
                        isFormValid: false,
                        success_alert_wrapper_show: false,
                    });
                }
            });

        }
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
        const { errors, server_message, form, isEditable} = this.state;
        const errors_data = server_message;
        return (
            <Fragment>
                {
                    this.state.loading ? 
                    <div className="loading"></div>
                    :
                    <Fragment>
                        <div className="woocommerce-MyAccount-content inner_content w9_form">
                            <h2 className="montserrat page-title">
                                Tax Form Information
                                {
                                    (form.type)?
                                        <a className={classnames('pull-right montserrat')} onClick={() => this.setState({isEditable: !isEditable})} style={{cursor:'pointer'}}>{isEditable ? Parser('<u>Cancel</u>') : Parser('<u>Edit</u>')}</a>
                                    :''                                
                                }
                                
                            </h2>

                            {
                                (isEditable) ?
                                <Fragment>
                                    <div className="registration-form">
                                        <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                        <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={this.state.success_alert_wrapper_show} />
                                        <form onSubmit={this.onSubmit} method="post" id="registration_Form" className="register action_form" encType="multipart/form-data">
                                            <div className="clearfix"></div>

                                            {/* US Business Form Data */}
                                            {/* <div className="form-group"> */}

                                            <div className="clearfix"></div>
                                             <div className="form-group">

                                                <div className="col-form-label">
                                                     <label className={classnames(null, { 'pl_error_checkbox': errors.type })}>Tax Form Types <span className="required">*</span> </label>
                                                </div>
                                                <div className="row">
                                                      <div className="col-sm-6">
                                                          <label className="label-center"><input type="radio" name="type" value="usa" onChange={this.changeHandler} defaultChecked={form.type=='usa'} />US Individual or Business</label>
                                                          <label className="label-center"><input type="radio" name="type" value="canadian" onChange={this.changeHandler} defaultChecked={form.type=='canadian'} /> Canadian Individual or Business </label>
                                                       </div>   
                                                        <div className="col-sm-6"> 
                                                              <label className="label-center"><input type="radio" name="type" value="other" onChange={this.changeHandler} defaultChecked={form.type=='other'} /> Other International Individual or Business</label>
                                                        </div> 
                                                 </div>

                                            </div>
                                            {/* <div className="form-group">
                                                <label className={classnames(null, { 'pl_error_checkbox': errors.type })}>W9 Form Types <span className="required">*</span> </label>
                                                <div className="form-group ml-5 mt-2">
                                                    <label><input type="radio" name="type" value="usa" onChange={this.changeHandler} defaultChecked={form.type=='usa'} /> US Individual or Business</label>
                                                    <label><input type="radio" name="type" value="canadian" onChange={this.changeHandler} defaultChecked={form.type=='canadian'} /> Canadian Individual or Business </label>
                                                   
                                                    <label><input type="radio" name="type" value="other" onChange={this.changeHandler} defaultChecked={form.type=='other'} /> Other International Individual or Business </label>
                                                </div>
                                            </div> */}
                                            <div className="form-group">
                                                {
                                                    (form.type=='usa' )?
                                                    <Fragment>
                                                        <h4 className="form-group-title">US Individual or Business</h4>
                                                        <Fragment>
                                                             <div className="form-groupmt-2 mb-2">
                                                                 <div className="col-form-label">
                                                                    <label className={classnames(null, { 'pl_error_checkbox': errors.is_business })}>Individual / Business<span className="required">*</span> </label>
                                                                 </div>
                                                                    <div className="row">
                                                                        <div className="col-sm-12">
                                                                            <label className="label-center"><input type="radio" name="is_business" value="no" onChange={this.changeHandler} defaultChecked={form.is_business=='no'} /> Individual</label>
                                                                        </div>
                                                                        <div className="col-sm-12">
                                                                        <label className="label-center"><input type="radio" name="is_business" value="yes" onChange={this.changeHandler} defaultChecked={form.is_business=='yes'} /> Business</label>
                                                                    </div>
                                                                     </div>

                                                             </div>
                                                            {/* <div className="form-group ml-5 mt-2">
                                                                <label className={classnames(null, { 'pl_error_checkbox': errors.is_business })}>Individual / Business<span className="required">*</span> </label>
                                                                <div className="form-group form-inline">
                                                                    <label><input type="radio" name="is_business" value="no" onChange={this.changeHandler} defaultChecked={form.is_business=='no'} /> Individual</label> &nbsp; 
                                                                    <label><input type="radio" name="is_business" value="yes" onChange={this.changeHandler} defaultChecked={form.is_business=='yes'} /> Business</label>
                                                                </div>                                        
                                                            </div> */}
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
                                                            <label className={classnames("d-flex align-content-start", { 'pl_error_checkbox': errors.canadian_goods_services_tax_status})}><input type="radio" name="canadian_goods_services_tax_status" value="yes" onChange={this.changeHandler} checked={form.canadian_goods_services_tax_status=='yes'} /> <span className="redio-text-lable-2">Yes, I wish to have the Goods & Services Tax, Harmonized Sales Tax and/or Provincial Sales Tax issued to me on my earnings from Prestige Labs.  I attest that I have read and agree to the terms laid out in the <a href="/affiliate-canadian-tax--commissions" target="_blank" className="text-dark"><u>Notice to Levy Canadian Tax on Commissions Paid to Registered Canadian Affiliate</u></a>.</span></label>
                                                            <label className={classnames("d-flex align-content-start", { 'pl_error_checkbox': errors.canadian_goods_services_tax_status})}><input type="radio" name="canadian_goods_services_tax_status" value="no" onChange={this.changeHandler} checked={form.canadian_goods_services_tax_status=='no'} /><span className="redio-text-lable-2"> No, I decline the option to receive the Goods & Services Tax, Harmonized Sales Tax and/or Provincial Sales Tax issued to me on my earnings from Prestige Labs. I attest that GLS Labs LLC dba Prestige Labs will be held harmless for any Canada Revenue Agency taxes on these earnings. </span></label>
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
                                                                        <label className="">Name listed Canadian GST/HST Account <span className="required">*</span></label>
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
                                                                </div>
                                                                :''
                                                            }
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
                                                        </Fragment>
                                                        : ''
                                                    }
                                                </div>
                                            }

                                            <div className="form-group justify-content-center">

                                                <Modal
                                                    className=""
                                                    containerClassName="signature-modal"
                                                    closeOnOuterClick={false}
                                                    show={this.state.signatureModalDisplay}
                                                    onClose={() => this.signatureModalDisplay()}
                                                >                        
                                                    <a className="signature-modal-close" style={closeStyle} onClick={()=> this.signatureModalDisplay()}>X</a>
                                                    <div className="e-signature">
                                                        <SignatureCanvas 
                                                        ref={(ref) => { this.eSignature = ref }}
                                                        penColor='black' 
                                                        canvasProps={{width: 360, height: 150, className: 'sigCanvas'}} 
                                                        minWidth={0.5}
                                                        maxWidth={1.5} 
                                                        minDistance={5}
                                                        dotSize={() => (this.minWidth + this.maxWidth) / 2}
                                                        onEnd={() => this.signatureButtonDisabled()}
                                                        />
                                                        <button type="button" className="btn-clear" onClick={this.clearSignature} disabled={this.state.signatureButtonDisabled}>Clear</button> &nbsp; 
                                                        <button type="button" className="cus_button" onClick={this.saveSignature} disabled={this.state.signatureButtonDisabled}>Continue</button>
                                                    </div>
                                                </Modal>
                                                { form.signature ?  
                                                <div className="form-group signature d-flex align-items-center justify-content-center w-100">  
                                                    <img  src={form.signature} /> 
                                                </div>
                                                :
                                                <> </>
                                                }

                                                <div className="d-flex align-items-center justify-content-center w-100"> 
                                                <button type="button" className={classnames('btn-signature', { 'pl_error_checkbox': errors.signature })} onClick={() => this.signatureModalDisplay()}>{form.signature? 'Change Signature' : 'Electronic Signature'}</button>
                                                </div>
                                            </div>
                                            
                                            <div className="form-group">
                                                <button type="submit" disabled={this.state.isLoading} className="cus_button" name="login">{this.state.isLoading ? 'Please Wait...' : 'Submit'}</button>
                                            </div>
                                        </form>
                                    </div>
                                </Fragment>
                                :
                                <Fragment>
                                    <table className="my_account_orders">
                                        <tbody>
                                            {
                                                (form.type)?
                                                <Fragment>
                                                    <tr>
                                                        <th width="30%">Tax Form Types</th>
                                                        <td>{form.type ? form.type.toUpperCase() : ''}</td>
                                                    </tr>
                                                    {
                                                        (form.type=='usa') ?
                                                        <Fragment>
                                                            <tr>
                                                                <th>Is Business?</th>
                                                                <td>{ form.is_business? form.is_business.toUpperCase() : ''}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>{form.is_business=='yes' ? 'Business Name' : 'Personal Name'}</th>
                                                                <td>{form.name}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>{form.is_business=='yes' ? 'Business Tax ID Number' : 'Social Security Number'}</th>
                                                                <td>{form.number}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Street Address</th>
                                                                <td>{form.address_1} {form.address_2}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Town/City</th>
                                                                <td>{form.w9_city}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Country</th>
                                                                <td>{form.country_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>State</th>
                                                                <td>{form.w9_state}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Zip</th>
                                                                <td>{form.w9_postcode}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Classification</th>
                                                                <td>{form.classification}</td>
                                                            </tr>
                                                        </Fragment>
                                                        :                                         
                                                        (form.type=='canadian') ?
                                                        <Fragment>
                                                            <tr>
                                                                <th>Goods Services Tax Enable</th>
                                                                <td>{form.canadian_goods_services_tax_status? form.canadian_goods_services_tax_status.toUpperCase() : ''}</td>
                                                            </tr>
                                                            {
                                                                (form.canadian_goods_services_tax_status=='yes') ?
                                                                <Fragment>
                                                                    <tr>
                                                                        <th>Registered Canadian GST/HST Account Number</th>
                                                                        <td>{form.canadian_gst_account_number}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Name listed Canadian GST/HST Account</th>
                                                                        <td>{form.canadian_gst_account}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Provincial Account Number</th>
                                                                        <td>{form.provincial_account_number}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Name listed on Provincial Account</th>
                                                                        <td>{form.provincial_account}</td>
                                                                    </tr>
                                                                </Fragment>
                                                                :''
                                                            }                                                    
                                                        </Fragment>
                                                        :
                                                        (form.type=='other')?
                                                            <Fragment>
                                                                <tr>
                                                                    <th>Country</th>
                                                                    <td>{form.country_name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>State</th>
                                                                    <td>{form.w9_state}</td>
                                                                </tr>
                                                            </Fragment>
                                                        :''
                                                        
                                                    }
                                                    <tr>
                                                        <th>Signature</th>
                                                        <td><img src={form.signature} height="50" /></td>
                                                    </tr>
                                                </Fragment>
                                                :
                                                <tr>
                                                    <td colSpan="2" className="text-center">W9 Form information not found.</td>
                                                </tr>
                                            }
                                                                                        
                                        </tbody>
                                    </table>
                                </Fragment>
                            }
                            
                        </div>
                    </Fragment>
                }
            </Fragment>
        );
    }
}

export default W9FormInformation;