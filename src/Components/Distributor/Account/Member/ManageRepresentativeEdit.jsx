import React, { Component, Fragment } from 'react';
import serialize from 'form-serialize';
import shortid from 'shortid';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import { AJAX_REQUEST } from "../../../../Constants/AppConstants";
import { NavLink } from 'react-router-dom';
import history from '../../../../history';
import classnames from 'classnames';
import validateMemberUpdateForm from '../../../../Validations/validateMemberUpdateForm';
import AlertWrapper from '../../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../../Common/AlertWrapperSuccess';
import $ from 'jquery';

let variation_wise_update_list = [];
let meal = [];

class ManageRepresentativeEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team_member_id: this.props.match.params.id,
            error_meg: '',
            products: [],
            meal: [],
            meal_exits: false,
            commission_items: [],
            message: '',
            first_name: '',
            last_name: '',
            email: '',
            status: 'active',
            password: '',
            global_commission_type: 'flat',
            global_commission: '',
            team_member_ss: 'One-Time',
            global_commission_flat: '',
            global_commission_percentage: '',
            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            server_message: '',
            loading: true,
            success_alert_wrapper_show: false,
            saving: false,
            supplementTab:true,
        }
        document.title = "Edit Team Member -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "product/getVariationWiseList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                variation_wise_update_list = results.response.data.supplement;
                meal = results.response.data.meal?results.response.data.meal:[];
                let meal_exits = results.response.data.meal?true:false;
                AJAX_REQUEST("POST", "distributor/getUpdateTeamMemberData", { team_member_id: this.props.match.params.id }).then(results => {
                    if (parseInt(results.response.code) === 1000) {
                        this.setState({
                            products: variation_wise_update_list,
                            meal: meal,
                            meal_exits: meal_exits,
                            commission_items: results.response.data.commission_items,
                            first_name: results.response.data.first_name,
                            last_name: results.response.data.last_name,
                            email: results.response.data.email,
                            status: results.response.data.status,
                            loading: false,
                        });
                    }
                });
                // this.setState({
                //     products                    :results.response.data,
                //     message                         :results.response.message,
                //     loading         :false,
                // });	
            } else {
                AJAX_REQUEST("POST", "distributor/getUpdateTeamMemberData", { team_member_id: this.props.match.params.id }).then(results => {
                    if (parseInt(results.response.code) === 1000) {
                        this.setState({
                            products: variation_wise_update_list,
                            meal: meal,
                            commission_items: results.response.data.commission_items,
                            first_name: results.response.data.first_name,
                            last_name: results.response.data.last_name,
                            email: results.response.data.email,
                            status: results.response.data.status,
                            error_meg: results.response.message,
                            loading: false,
                        });
                    }
                });
            }
        });

    }

    changeHandler = (e) => {
        if(e.target.type=='radio'){
            var result= e.target.id.split("_");
            var type = result.splice(0,1);
            type=type[0];

           var access_identifier=result.splice(1,1)[0];
    
            var input_field=type+'_input_'+access_identifier+'_'+e.target.id.split("_").pop();
            var elm=document.getElementById(input_field);
            elm.setAttribute("required", "");
    
            if(type=='flat'){
                var input_field='percentage_input_'+access_identifier+'_'+e.target.id.split("_").pop();
             var elm=document.getElementById(input_field);
             elm.removeAttribute("required");
            }else{
                var input_field='flat_input_'+access_identifier+'_'+e.target.id.split("_").pop();
             var elm=document.getElementById(input_field);
             elm.removeAttribute("required");
            }
        }
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false
            });
            history.push(`/my-account/manage-representative`);
        }.bind(this), timedata);
    }

    submitForm = (e) => {
        e.preventDefault();
        this.setState({ saving: true,isFormValid: true,success_alert_wrapper_show: false })
        document.getElementById('tm_add_saving').setAttribute('disabled', true);
        // document.getElementById('tm_add_saving').innerHTML = 'Updating...';
        document.getElementById('first_name').classList.remove('pl_error_input');
        document.getElementById('last_name').classList.remove('pl_error_input');
        document.getElementById('email').classList.remove('pl_error_input');
        const user_form_data = {
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }

        let form_valid_tadd = true;
        if (validator.isEmpty(user_form_data.first_name)) {
            form_valid_tadd = false;
            document.getElementById('first_name').classList.add('pl_error_input');
        }
        if (validator.isEmpty(user_form_data.last_name)) {
            form_valid_tadd = false;
            document.getElementById('last_name').classList.add('pl_error_input');
        }
        if (validator.isEmpty(user_form_data.email)) {
            form_valid_tadd = false;
            document.getElementById('email').classList.add('pl_error_input');
        }
        if (!validator.isEmail(user_form_data.email)) {
            form_valid_tadd = false;
            document.getElementById('email').classList.add('pl_error_input');
        }

        if (form_valid_tadd) {
            const form = document.querySelector('#new_team_form');
            const data = serialize(form, { hash: true });
            AJAX_REQUEST("POST", "distributor/updateTeamMember", data).then(results => {
                const response = results.response;
                if (parseInt(results.response.code) === 1000) {
                    this.setState({
                        message: results.response.message,
                        saving: false,
                        success_alert_wrapper_show: true,
                    });
                    document.querySelector("body").scrollIntoView();
                    this.timeOut(3000);
                }
                else {
                    this.setState({
                        error_meg: results.response.message,
                        server_message: results.response.message,
                        saving: false,
                        success_alert_wrapper_show: false,
                        isFormValid: false
                    });
                    document.querySelector("body").scrollIntoView();
                    document.getElementById('tm_add_saving').removeAttribute('disabled');
                    // document.getElementById('tm_add_saving').innerHTML = 'Update';
                }
            });
        } else {
            this.setState({ saving: false })
            document.querySelector("body").scrollIntoView();
            document.getElementById('tm_add_saving').removeAttribute('disabled');
            // document.getElementById('tm_add_saving').innerHTML = 'Update';
        }

    }

    changeHandlerGlobal = (e) => {
        if(e.target.type=='radio'){
            var result= e.target.id.split("_");
            var type = result.splice(0,1);
            type=type[0];
            var input_field=type+'_input_gcid';
            var elm=document.getElementById(input_field);
            elm.setAttribute("required", "");
            if(type=='flat'){
                var input_field='percentage_input_gcid';
             var elm=document.getElementById(input_field);
             elm.removeAttribute("required");
            }else{
                var input_field='flat_input_gcid';
             var elm=document.getElementById(input_field);
             elm.removeAttribute("required");
            }
        }
    }

    changeHandlerGlobalMeal = (e) => {
        if(e.target.type=='radio'){
            var result= e.target.id.split("_");
            var type = result.splice(0,1);
            type=type[0];
            var input_field=type+'_input_gmcid';
            var elm=document.getElementById(input_field);
            elm.setAttribute("required", "");
            if(type=='flat'){
                var input_field='percentage_input_gmcid';
             var elm=document.getElementById(input_field);
             elm.removeAttribute("required");
            }else{
                var input_field='flat_input_gmcid';
             var elm=document.getElementById(input_field);
             elm.removeAttribute("required");
            }
        }
    }

    variation_checked = (pid, type, name) => {
        if (type == 'flat') {
            document.getElementById("percentage_input_" + pid).removeAttribute("name");
            document.getElementById("flat_input_" + pid).setAttribute("name", name);
            document.getElementById("percentage_radio_" + pid).removeAttribute("checked");
            document.getElementById("flat_radio_" + pid).setAttribute("checked", "checked");
            document.getElementById("flat_radio_" + pid).click();
            document.getElementById('percentage_input_' + pid).value = '';
        } else {
            document.getElementById("flat_input_" + pid).removeAttribute("name");
            document.getElementById("percentage_input_" + pid).setAttribute("name", name);
            document.getElementById("flat_radio_" + pid).removeAttribute("checked");
            document.getElementById("percentage_radio_" + pid).setAttribute("checked", "checked");
            document.getElementById("percentage_radio_" + pid).click();
            document.getElementById('flat_input_' + pid).value = '';
        }
    }

    render() {
        const changeHandlerGlobal = this.changeHandlerGlobal;
        const changeHandlerGlobalMeal = this.changeHandlerGlobalMeal;
        const changeHandler = this.changeHandler;
        const variation_checked = this.variation_checked;
        const { errors, server_message, saving, message, success_alert_wrapper_show, email, first_name, last_name, status, team_member_id, commission_items } = this.state;
        const errors_data = server_message;

        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <div className="woocommerce-MyAccount-content inner_content">

                                <h2 className=" montserrat page-title">UPDATE TEAM MEMBER
                        <NavLink className="montserrat pull-right" to="/my-account/manage-representative">Manage</NavLink>
                                </h2>
                                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                <AlertWrapperSuccess errors_data={message} success_alert_wrapper_show={success_alert_wrapper_show} />
                                <form method="post" id="new_team_form" className="" onSubmit={this.submitForm} encType="multipart/form-data">
                                    <input name="team_member_id" value={team_member_id} type="hidden" />
                                    <div className="action_form add_new_form">

                                        <div className="form-group pull-left name_field">
                                            <label className={classnames(null, { 'pl_error_label': errors.first_name })}>First Name <span className="required">*</span></label>
                                            <input onChange={changeHandler} type="text" id="first_name" className={classnames("cus_field", { 'pl_error_input': errors.first_name })} name="first_name" defaultValue={first_name} />
                                        </div>

                                        <div className="form-group pull-right name_field">
                                            <label className={classnames(null, { 'pl_error_label': errors.last_name })}>Last Name <span className="required">*</span></label>
                                            <input onChange={changeHandler} type="text" id="last_name" className={classnames("cus_field", { 'pl_error_input': errors.last_name })} name="last_name" defaultValue={last_name} />
                                        </div>

                                        <div className="form-group pull-left name_field">
                                            <label className={classnames(null, { 'pl_error_label': errors.email })}>Email address <span className="required">*</span></label>
                                            <input onChange={changeHandler} type="text" id="email" className={classnames("cus_field", { 'pl_error_input': errors.email })} name="email" defaultValue={email} />
                                        </div>

                                        <div className="form-group pull-right name_field">
                                            <label className={classnames(null, { 'pl_error_label': errors.password })}>Password <span className="required">*</span></label>
                                            <input onChange={changeHandler} type="password" id="password" className={classnames("cus_field", { 'pl_error_input': errors.password })} name="password" />
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className="form-group">
                                            <label className="teamstatusupdate" style={{ display: 'inline' }}>Status : </label>&nbsp;&nbsp;
                                            <input type="radio" name="status" value="active" defaultChecked={status === 'active'} onChange={(e) => this.setState({ status: e.target.value })} /> Active &nbsp;
                                            <input type="radio" name="status" value="inactive" defaultChecked={status === 'inactive'} onChange={(e) => this.setState({ status: e.target.value })} /> Inactive
                                        </div>
                                    </div>

                                    <div className="s_tab_wrapper member_tab_wrapper">
                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="Supplement_link" data-toggle="tab" href="#Supplement_tab" role="tab" aria-controls="Supplement_link" aria-selected="true">Supplement COMMISSION</a>
                                            </li>
                                            {
                                                this.state.meal_exits?
                                                <li className="nav-item">
                                                    <a className="nav-link" id="Meal_link" data-toggle="tab" href="#Meal_tab" role="tab" aria-controls="Meal_link" aria-selected="false">Meal COMMISSION</a>
                                                </li>
                                                :''
                                            }
                                            
                                        </ul>
                                        <div className="tab-content" id="myTabContent">
                                            <div className="tab-pane fade show active" id="Supplement_tab" role="tabpanel" aria-labelledby="Supplement_tab">
                                                {/* supplement area start */}
                                                <div className="commision_wrapper">
                                        {/* <h2 className="montserrat page-title">COMMISSION (SUPPLEMENT)</h2> */}
                                        <div className="section_blog_container">
                                            <div className="section_blog">
                                                <label>Global Commission : </label>
                                                <span>
                                                    <input id="flat_radio_gcid" type="radio" onChange={changeHandlerGlobal} name="global_commission_type" value="flat" className="change_checker_radio" defaultChecked={commission_items.global_commission_type === 'flat'} /> Flat
                                                    <input id="flat_input_gcid" onChange={changeHandler} name="global_commission" type="text" className="regular-text change_checker_input" onKeyUp={() => this.variation_checked('gcid', 'flat', 'global_commission')} defaultValue={(commission_items.global_commission_type === 'flat') ? commission_items.global_commission : ''} />
                                                </span>

                                                <span>
                                                    <input id="percentage_radio_gcid" type="radio" onChange={changeHandlerGlobal} name="global_commission_type" value="percentage" className="change_checker_radio" defaultChecked={commission_items.global_commission_type === 'percentage'} /> Percentage
                                                    <input id="percentage_input_gcid" onChange={changeHandler} name="global_commission" type="text" className="regular-text change_checker_input" onKeyUp={() => this.variation_checked('gcid', 'percentage', 'global_commission')} defaultValue={(commission_items.global_commission_type === 'percentage') ? commission_items.global_commission : ''} />%
                                                </span>
                                            </div>

                                            <div className="section_blog">
                                                <label>Team Member Global Subscription Commission : </label>
                                                <span className="form_check_inline">
                                                    <input type="radio" name="team_member_recurring_commission" value="recurring" defaultChecked={commission_items.team_member_recurring_commission === 'recurring'} /> Recurring
                                                </span>
                                                <span className="form_check_inline">
                                                    <input type="radio" name="team_member_recurring_commission" value="onetime" defaultChecked={commission_items.team_member_recurring_commission === 'onetime'} /> One-Time
                                                </span>
                                            </div>

                                            {
                                                this.state.products.length <= 0 ? this.state.error_meg :
                                                    this.state.products.map(function (product, key) {
                                                        let p_commission = commission_items[product.product_id];
                                                        let p_commission_global = '';
                                                        let p_commission_subs_type = '';
                                                        let p_commission_subs_commission = '';
                                                        let p_commission_recurring_commission = '';
                                                        if (p_commission) {
                                                            p_commission_global = p_commission.global;
                                                            p_commission_subs_type = p_commission.save_subs_type;
                                                            p_commission_subs_commission = p_commission.save_subs_commission;
                                                            if (p_commission.recurring_commission) {
                                                                p_commission_recurring_commission = p_commission.recurring_commission;
                                                            }
                                                            // console.log(p_commission);
                                                        }
                                                        return (<div className="panel panel-default" key={shortid()}>
                                                            <div className="panel-heading">{product.hasOwnProperty('title') ? product.title : ''}</div>
                                                            <div className="panel-body">
                                                                <div className="section_blog">
                                                                    <label>Product Global : </label>
                                                                    <input
                                                                        name={`product_wise_commission[${product.product_id}][global]`} type="text"
                                                                        id={`global${product.product_id}`}
                                                                        defaultValue={p_commission_global}
                                                                    />
                                                                    %
                                                    </div>
                                                                <div className="section_blog">
                                                                    <label>Subscribe & Save : </label>
                                                                    <span>
                                                                        <input
                                                                            onChange={changeHandler}
                                                                            type="radio"
                                                                            name={`product_wise_commission[${product.product_id}][save_subs_type]`}
                                                                            value="flat" className="change_checker_radio"
                                                                            id={`flat_radio_p_${product.product_id}`}
                                                                            defaultChecked={p_commission_subs_type === 'flat'}
                                                                        />
                                                                        Flat


                                                            <input
                                                                            onChange={changeHandler}
                                                                            type="text"
                                                                            id={`flat_input_p_${product.product_id}`}
                                                                            className="regular-text change_checker_input" onKeyUp={() => variation_checked('p_' + product.product_id, 'flat', `product_wise_commission[${product.product_id}][save_subs_commission]`)}
                                                                            name={`product_wise_commission[${product.product_id}][save_subs_commission]`}
                                                                            defaultValue={(p_commission_subs_type === 'flat') ? p_commission_subs_commission : ''}

                                                                        />
                                                                    </span>

                                                                    <span>
                                                                        <input onChange={changeHandler}
                                                                            type="radio"
                                                                            name={`product_wise_commission[${product.product_id}][save_subs_type]`}
                                                                            value="percentage" className="change_checker_radio"
                                                                            id={`percentage_radio_p_${product.product_id}`}
                                                                            defaultChecked={p_commission_subs_type === 'percentage'}
                                                                        />

                                                                        Percentage

                                                            <input
                                                                            onChange={changeHandler}
                                                                            type="text"
                                                                            id={`percentage_input_p_${product.product_id}`}
                                                                            className="regular-text change_checker_input" onKeyUp={() => variation_checked('p_' + product.product_id, 'percentage', `product_wise_commission[${product.product_id}][save_subs_commission]`)}
                                                                            name={`product_wise_commission[${product.product_id}][save_subs_commission]`}
                                                                            defaultValue={(p_commission_subs_type === 'percentage') ? p_commission_subs_commission : ''}

                                                                        />
                                                                        %
                                                        </span>
                                                                </div>
                                                                <div className="section_blog">
                                                                    <label>Team Member Global Subscription Commission : </label>
                                                                    <span >
                                                                        <input
                                                                            
                                                                            type="radio"
                                                                            name={`product_wise_commission[${product.product_id}][recurring_commission]`}
                                                                            value="recurring"
                                                                            defaultChecked={p_commission_recurring_commission === 'recurring'}
                                                                        />
                                                                        Recurring
                                                        </span>
                                                                    <span >
                                                                        <input
                                                                            
                                                                            type="radio"
                                                                            name={`product_wise_commission[${product.product_id}][recurring_commission]`}
                                                                            value="onetime"
                                                                            defaultChecked={p_commission_recurring_commission === 'onetime'}
                                                                        />
                                                                        One-Time
                                                        </span>
                                                                </div>
                                                                <table className="roboto table table-bordered product_variable_table">
                                                                    <colgroup>
                                                                        <col width="30%" />
                                                                        <col width="30%" />
                                                                        <col width="40%" />
                                                                    </colgroup>
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="" colSpan="2">Variation(s)</th>
                                                                            <th className="text-center">Commission</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {
                                                                            product.variations.length <= 0 ? this.state.error_meg :
                                                                                product.variations.map(function (variation, key) {
                                                                                    let s_p_variation_type = '';
                                                                                    let s_p_variation_commission = '';
                                                                                    if (p_commission) {
                                                                                        if (p_commission.variation) {
                                                                                            let commission_variation = p_commission.variation;
                                                                                            let commission_variationstep = commission_variation[variation.variation_id];
                                                                                            if (commission_variationstep) {
                                                                                                s_p_variation_type = commission_variationstep.type;
                                                                                                s_p_variation_commission = commission_variationstep.commission;
                                                                                            }
                                                                                        }
                                                                                    }

                                                                                    return (
                                                                                        variation.flavor === null || variation.variation_id === null ?

                                                                                            <Fragment key={shortid()}>
                                                                                                <tr className="inactive" key={shortid()}>

                                                                                                    <td colSpan="2">
                                                                                                        {variation.hasOwnProperty('month') ? variation.month : ''}
                                                                                                        {' ($'}
                                                                                                        {variation.hasOwnProperty('price') ? variation.price : ''}
                                                                                                        {' )'}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <span className="section_blog">
                                                                                                            <span>
                                                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="radio" className="change_checker_radio"
                                                                                                                    name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][type]`}
                                                                                                                    value="flat" id={`flat_radio_pp_${variation.variation_id}`}
                                                                                                                    defaultChecked={s_p_variation_type === 'flat'}
                                                                                                                />
                                                                                                                Flat

                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="text"
                                                                                                                    id={`flat_input_pp_${variation.variation_id}`}
                                                                                                                    className="change_checker_input" onKeyUp={() => variation_checked('pp_' + variation.variation_id, 'flat', `product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`)} name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`}
                                                                                                                    defaultValue={(s_p_variation_type === 'flat') ? s_p_variation_commission : ''}
                                                                                                                />
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="radio" className="change_checker_radio"
                                                                                                                    name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][type]`}
                                                                                                                    value="percentage" id={`percentage_radio_pp_${variation.variation_id}`}
                                                                                                                    defaultChecked={s_p_variation_type === 'percentage'}

                                                                                                                />
                                                                                                                Percentage
                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="text"
                                                                                                                    id={`percentage_input_pp_${variation.variation_id}`}
                                                                                                                    className="change_checker_input" onKeyUp={() => variation_checked('pp_' + variation.variation_id, 'percentage', `product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`)} name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`}
                                                                                                                    defaultValue={(s_p_variation_type === 'percentage') ? s_p_variation_commission : ''}
                                                                                                                />
                                                                                                                %
                                                                                </span>
                                                                                                        </span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </Fragment> :

                                                                                            <Fragment key={shortid()}>
                                                                                                <tr className="inactive" key={shortid()}>
                                                                                                    <td>
                                                                                                        {variation.hasOwnProperty('flavor') ? variation.flavor : ''}
                                                                                                        {' ($'}
                                                                                                        {variation.hasOwnProperty('price') ? variation.price : ''}
                                                                                                        {' )'}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {variation.hasOwnProperty('month') ? variation.month : ''}
                                                                                                        {' ($'}
                                                                                                        {variation.hasOwnProperty('price') ? variation.price : ''}
                                                                                                        {' )'}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <span className="section_blog">
                                                                                                            <span>
                                                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="radio" className="change_checker_radio"
                                                                                                                    name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][type]`}
                                                                                                                    value="flat"
                                                                                                                    id={`flat_radio_pp_${variation.variation_id}`}
                                                                                                                    defaultChecked={s_p_variation_type === 'flat'}
                                                                                                                />
                                                                                                                Flat

                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="text" id={`flat_input_pp_${variation.variation_id}`}
                                                                                                                    onKeyUp={() => variation_checked('pp_' + variation.variation_id, 'flat', `product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`)} name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`}
                                                                                                                    className="change_checker_input"
                                                                                                                    defaultValue={(s_p_variation_type === 'flat') ? s_p_variation_commission : ''}
                                                                                                                />
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="radio" className="change_checker_radio"
                                                                                                                    name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][type]`}
                                                                                                                    value="percentage" id={`percentage_radio_pp_${variation.variation_id}`}
                                                                                                                    defaultChecked={s_p_variation_type === 'percentage'}

                                                                                                                />
                                                                                                                Percentage
                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="text"
                                                                                                                    id={`percentage_input_pp_${variation.variation_id}`}
                                                                                                                    onKeyUp={() => variation_checked('pp_' + variation.variation_id, 'percentage', `product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`)} name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`}
                                                                                                                    className="change_checker_input"
                                                                                                                    defaultValue={(s_p_variation_type === 'percentage') ? s_p_variation_commission : ''}
                                                                                                                />
                                                                                                                %
                                                                                </span>
                                                                                                        </span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </Fragment>

                                                                                    )
                                                                                })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>);
                                                    })
                                            }



                                        </div>
                                    </div>
                                    
                                                {/* supplement area end */}
                                            </div>
                                            {
                                                this.state.meal_exits?
                                                <div className="tab-pane fade" id="Meal_tab" role="tabpanel" aria-labelledby="Meal_link">
                                                {/* meal area start */}
                                                <div className="commision_wrapper">
                                        {/* <h2 className="montserrat page-title">COMMISSION (MEAL)</h2> */}
                                        <div className="section_blog_container">
                                            <div className="section_blog">
                                                <label>Global Commission : </label>
                                                <span>
                                                    <input id="flat_radio_gmcid" type="radio" onChange={changeHandlerGlobalMeal} name="meal_commission_type" value="flat" className="change_checker_radio" defaultChecked={commission_items.meal_commission_type === 'flat'} /> Flat
                                                    <input id="flat_input_gmcid" onChange={changeHandler} name="meal_commission" type="text" className="regular-text change_checker_input" onKeyUp={() => this.variation_checked('gmcid', 'flat', 'meal_commission')} defaultValue={(commission_items.meal_commission_type === 'flat') ? commission_items.meal_commission : ''} />
                                                </span>

                                                <span>
                                                    <input id="percentage_radio_gmcid" type="radio" onChange={changeHandlerGlobalMeal} name="meal_commission_type" value="percentage" className="change_checker_radio" defaultChecked={commission_items.meal_commission_type === 'percentage'} /> Percentage
                                                    <input id="percentage_input_gmcid" onChange={changeHandler} name="meal_commission" type="text" className="regular-text change_checker_input" onKeyUp={() => this.variation_checked('gmcid', 'percentage', 'meal_commission')} defaultValue={(commission_items.meal_commission_type === 'percentage') ? commission_items.meal_commission : ''} />%
                                                </span>
                                            </div>

                                            <div className="section_blog">
                                                <label>Team Member Global Subscription Commission : </label>
                                                <span className="form_check_inline">
                                                    <input type="radio" name="team_member_recurring_commission_meal" value="recurring" defaultChecked={commission_items.team_member_recurring_commission_meal === 'recurring'} /> Recurring
                                                </span>
                                                <span className="form_check_inline">
                                                    <input type="radio" name="team_member_recurring_commission_meal" value="onetime" defaultChecked={commission_items.team_member_recurring_commission_meal === 'onetime'} /> One-Time
                                                </span>
                                            </div>

                                            {
                                                this.state.meal.length <= 0 ? this.state.error_meg :
                                                    this.state.meal.map(function (product, key) {
                                                        let p_commission = commission_items[product.product_id];
                                                        let p_commission_global = '';
                                                        let p_commission_subs_type = '';
                                                        let p_commission_subs_commission = '';
                                                        let p_commission_recurring_commission = '';
                                                        if (p_commission) {
                                                            p_commission_global = p_commission.global;
                                                            p_commission_subs_type = p_commission.save_subs_type;
                                                            p_commission_subs_commission = p_commission.save_subs_commission;
                                                            if (p_commission.recurring_commission) {
                                                                p_commission_recurring_commission = p_commission.recurring_commission;
                                                            }
                                                            // console.log(p_commission);
                                                        }
                                                        return (<div className="panel panel-default" key={shortid()}>
                                                            <div className="panel-heading">{product.hasOwnProperty('title') ? product.title : ''}</div>
                                                            <div className="panel-body">
                                                                <div className="section_blog">
                                                                    <label>Meal Global : </label>
                                                                    <input
                                                                        name={`product_wise_commission[${product.product_id}][global]`} type="text"
                                                                        id={`global${product.product_id}`}
                                                                        defaultValue={p_commission_global}
                                                                    />
                                                                    %
                                                    </div>
                                                                <div className="section_blog">
                                                                    <label>Subscribe & Save : </label>
                                                                    <span>
                                                                        <input
                                                                            onChange={changeHandler}
                                                                            type="radio"
                                                                            name={`product_wise_commission[${product.product_id}][save_subs_type]`}
                                                                            value="flat" className="change_checker_radio"
                                                                            id={`flat_radio_p_${product.product_id}`}
                                                                            defaultChecked={p_commission_subs_type === 'flat'}
                                                                        />
                                                                        Flat


                                                            <input
                                                                            onChange={changeHandler}
                                                                            type="text"
                                                                            id={`flat_input_p_${product.product_id}`}
                                                                            className="regular-text change_checker_input" onKeyUp={() => variation_checked('p_' + product.product_id, 'flat', `product_wise_commission[${product.product_id}][save_subs_commission]`)}
                                                                            name={`product_wise_commission[${product.product_id}][save_subs_commission]`}
                                                                            defaultValue={(p_commission_subs_type === 'flat') ? p_commission_subs_commission : ''}

                                                                        />
                                                                    </span>

                                                                    <span>
                                                                        <input onChange={changeHandler}
                                                                            type="radio"
                                                                            name={`product_wise_commission[${product.product_id}][save_subs_type]`}
                                                                            value="percentage" className="change_checker_radio"
                                                                            id={`percentage_radio_p_${product.product_id}`}
                                                                            defaultChecked={p_commission_subs_type === 'percentage'}
                                                                        />

                                                                        Percentage

                                                            <input
                                                                            onChange={changeHandler}
                                                                            type="text"
                                                                            id={`percentage_input_p_${product.product_id}`}
                                                                            className="regular-text change_checker_input" onKeyUp={() => variation_checked('p_' + product.product_id, 'percentage', `product_wise_commission[${product.product_id}][save_subs_commission]`)}
                                                                            name={`product_wise_commission[${product.product_id}][save_subs_commission]`}
                                                                            defaultValue={(p_commission_subs_type === 'percentage') ? p_commission_subs_commission : ''}

                                                                        />
                                                                        %
                                                        </span>
                                                                </div>
                                                                <div className="section_blog">
                                                                    <label>Team Member Global Subscription Commission : </label>
                                                                    <span >
                                                                        <input
                                                                            
                                                                            type="radio"
                                                                            name={`product_wise_commission[${product.product_id}][recurring_commission]`}
                                                                            value="recurring"
                                                                            defaultChecked={p_commission_recurring_commission === 'recurring'}
                                                                        />
                                                                        Recurring
                                                        </span>
                                                                    <span >
                                                                        <input
                                                                            
                                                                            type="radio"
                                                                            name={`product_wise_commission[${product.product_id}][recurring_commission]`}
                                                                            value="onetime"
                                                                            defaultChecked={p_commission_recurring_commission === 'onetime'}
                                                                        />
                                                                        One-Time
                                                        </span>
                                                                </div>
                                                                <table className="roboto table table-bordered product_variable_table">
                                                                    <colgroup>
                                                                        <col width="30%" />
                                                                        <col width="30%" />
                                                                        <col width="40%" />
                                                                    </colgroup>
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="" colSpan="2">Variation(s)</th>
                                                                            <th className="text-center">Commission</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {
                                                                            product.variations.length <= 0 ? this.state.error_meg :
                                                                                product.variations.map(function (variation, key) {
                                                                                    let s_p_variation_type = '';
                                                                                    let s_p_variation_commission = '';
                                                                                    if (p_commission) {
                                                                                        if (p_commission.variation) {
                                                                                            let commission_variation = p_commission.variation;
                                                                                            let commission_variationstep = commission_variation[variation.variation_id];
                                                                                            if (commission_variationstep) {
                                                                                                s_p_variation_type = commission_variationstep.type;
                                                                                                s_p_variation_commission = commission_variationstep.commission;
                                                                                            }
                                                                                        }
                                                                                    }

                                                                                    return (
                                                                                        variation.flavor === null || variation.variation_id === null ?

                                                                                            <Fragment key={shortid()}>
                                                                                                <tr className="inactive" key={shortid()}>

                                                                                                    <td colSpan="2">
                                                                                                        {variation.hasOwnProperty('weight_name') ? variation.weight_name : ''}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <span className="section_blog">
                                                                                                            <span>
                                                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="radio" className="change_checker_radio"
                                                                                                                    name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][type]`}
                                                                                                                    value="flat" id={`flat_radio_pp_${variation.variation_id}`}
                                                                                                                    defaultChecked={s_p_variation_type === 'flat'}
                                                                                                                />
                                                                                                                Flat

                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="text"
                                                                                                                    id={`flat_input_pp_${variation.variation_id}`}
                                                                                                                    className="change_checker_input" onKeyUp={() => variation_checked('pp_' + variation.variation_id, 'flat', `product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`)} name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`}
                                                                                                                    defaultValue={(s_p_variation_type === 'flat') ? s_p_variation_commission : ''}
                                                                                                                />
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="radio" className="change_checker_radio"
                                                                                                                    name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][type]`}
                                                                                                                    value="percentage" id={`percentage_radio_pp_${variation.variation_id}`}
                                                                                                                    defaultChecked={s_p_variation_type === 'percentage'}

                                                                                                                />
                                                                                                                Percentage
                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="text"
                                                                                                                    id={`percentage_input_pp_${variation.variation_id}`}
                                                                                                                    className="change_checker_input" onKeyUp={() => variation_checked('pp_' + variation.variation_id, 'percentage', `product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`)} name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`}
                                                                                                                    defaultValue={(s_p_variation_type === 'percentage') ? s_p_variation_commission : ''}
                                                                                                                />
                                                                                                                %
                                                                                </span>
                                                                                                        </span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </Fragment> :

                                                                                            <Fragment key={shortid()}>
                                                                                                <tr className="inactive" key={shortid()}>
                                                                                                    <td>
                                                                                                        {variation.hasOwnProperty('flavor') ? variation.flavor : ''}
                                                                                                        {' ($'}
                                                                                                        {variation.hasOwnProperty('price') ? variation.price : ''}
                                                                                                        {' )'}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {variation.hasOwnProperty('weight_name') ? variation.weight_name : ''}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <span className="section_blog">
                                                                                                            <span>
                                                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="radio" className="change_checker_radio"
                                                                                                                    name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][type]`}
                                                                                                                    value="flat"
                                                                                                                    id={`flat_radio_pp_${variation.variation_id}`}
                                                                                                                    defaultChecked={s_p_variation_type === 'flat'}
                                                                                                                />
                                                                                                                Flat

                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="text" id={`flat_input_pp_${variation.variation_id}`}
                                                                                                                    onKeyUp={() => variation_checked('pp_' + variation.variation_id, 'flat', `product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`)} name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`}
                                                                                                                    className="change_checker_input"
                                                                                                                    defaultValue={(s_p_variation_type === 'flat') ? s_p_variation_commission : ''}
                                                                                                                />
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="radio" className="change_checker_radio"
                                                                                                                    name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][type]`}
                                                                                                                    value="percentage" id={`percentage_radio_pp_${variation.variation_id}`}
                                                                                                                    defaultChecked={s_p_variation_type === 'percentage'}

                                                                                                                />
                                                                                                                Percentage
                                                                                <input
                                                                                                                    onChange={changeHandler}
                                                                                                                    type="text"
                                                                                                                    id={`percentage_input_pp_${variation.variation_id}`}
                                                                                                                    onKeyUp={() => variation_checked('pp_' + variation.variation_id, 'percentage', `product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`)} name={`product_wise_commission[${product.product_id}][variations][${variation.variation_id}][commission]`}
                                                                                                                    className="change_checker_input"
                                                                                                                    defaultValue={(s_p_variation_type === 'percentage') ? s_p_variation_commission : ''}
                                                                                                                />
                                                                                                                %
                                                                                </span>
                                                                                                        </span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </Fragment>

                                                                                    )
                                                                                })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>);
                                                    })
                                            }



                                        </div>
                                    </div>
                                    
                                                {/* meal area end */}
                                            </div>
                                        
                                                :''
                                            }
                                            
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <button id="tm_add_saving" type="submit" className="cus_button" name="" value="">{this.state.saving ? "Updating..." : "Update"}</button>
                                    </div>
                                </form>
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default ManageRepresentativeEdit;