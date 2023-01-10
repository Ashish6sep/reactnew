import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import history from '../../../history';
import classnames from 'classnames';
import { connect } from 'react-redux';
import validateUserProfile from '../../../Validations/userProfile';
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';

class EditAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            displayname: "",
            email: "",
            current_password: "",
            new_password: "",
            confirm_new_password: "",
            username: "",
            role: "",
            photo: "",
            affiliate_url: "",
            paypal_account: "",
            w9_form: "",
            agreement_form: "",
            errors: {},
            isValid:false,
            isLoading:false,
            isFormValid:true,
            server_message:'',
            success_alert_wrapper_show:false,
            loading                 :true,
            saving: false
        }
        document.title = "Account Details -Prestige Labs";
    }

    componentDidMount(){
        if(this.props.user){
            if(this.props.user.new_agreement_required=="yes"){
                history.push('/agreement');
            }
        }
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","user/details",{}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    displayname: response.data.displayname,
                    email: response.data.email,
                    loading                 :false,
                    // server_message: response.message,
                });	
            }else{
                this.setState({
                    loading                 :false,
                    server_message: response.message,
                    isFormValid:false,
                });	
            }
        });
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this),timedata);
    }

    onSubmit = (e) => {
        e.preventDefault();
        const val_return = validateUserProfile(this.state);
        this.setState(val_return);
        if(val_return.isValid){
            this.setState({errors: {}, isLoading: true,saving: true,server_message:'',});

            AJAX_REQUEST("POST","user/updateInfo",this.state).then(results => {
                const response = results.response;
                if(parseInt(response.code)===1000) {
                    this.setState({
                        server_message: response.message,
                        isFormValid:true,
                        isLoading:false,
                        saving: false,
                        success_alert_wrapper_show: true,
                        current_password: "",
                        new_password: "",
                        confirm_new_password: ""
                    });
                    this.timeOut(5000);
                }else{
                    this.setState({
                        server_message: response.message,
                        isFormValid:false,
                        isLoading:false,
                        saving: false,
                    });
                }         
            });
        }
    }

    render() { 
        const { errors, server_message, success_alert_wrapper_show, saving } = this.state;
        const full_state = this.state;
        const errors_data = server_message;
        return (
            <Fragment>
                {
                        this.state.loading ? 
                        <div className="loading"></div>
                        :
                    <Fragment>
            <form method="post" className="edit_account_form action_form" encType="multipart/form-data" onSubmit={this.onSubmit}>
            <h2 className="montserrat page-title">Account Details</h2>
            <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
            <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show}/> 
                <div className="form-group pull-left name_field">
                    <label className={classnames(null, { 'pl_error_label': errors.first_name })} htmlFor="first_name">First Name <span className="required">*</span></label>
                    <input onChange={this.changeHandler} type="text" className={classnames("cus_field", { 'pl_error_input': errors.first_name })} name="first_name" id="first_name" value={full_state.first_name} />
                </div>
                <div className="form-group pull-right name_field">
                    <label className={classnames(null, { 'pl_error_label': errors.last_name })} htmlFor="last_name">Last Name <span className="required">*</span></label>
                    <input onChange={this.changeHandler} type="text" className={classnames("cus_field", { 'pl_error_input': errors.last_name })} name="last_name" id="last_name" value={full_state.last_name} />
                </div>
                <div className="clearfix"></div>
                <div className="form-group">
                    <label className={classnames(null, { 'pl_error_label': errors.displayname })} htmlFor="displayname">Display name <span className="required">*</span></label>
                    <input onChange={this.changeHandler} type="text" className={classnames("cus_field", { 'pl_error_input': errors.displayname })} name="displayname" id="displayname" value={full_state.displayname} />
                    <small><em>This will be how your name will be displayed in the account section and in reviews</em></small>
                </div>
                <div className="form-group">
                    <label className={classnames(null, { 'pl_error_label': errors.email })} htmlFor="email">Email address <span className="required">*</span></label>
                    <input onChange={this.changeHandler} type="email" className={classnames("cus_field", { 'pl_error_input': errors.email })} name="email" id="email" value={full_state.email} />
                </div>
                <div className="form-group">
                    <h3 className="montserrat page-title"> Password change</h3>
                </div>
                <div className="form-group">
                    <label className={classnames(null, { 'pl_error_label': errors.current_password })} htmlFor="current_password">Current password (leave blank to leave unchanged) <span className="required">*</span></label>
                    <input onChange={this.changeHandler} type="password" className={classnames("cus_field", { 'pl_error_input': errors.current_password })} name="current_password" id="current_password" value={full_state.current_password} />
                </div>
                <div className="form-group">
                    <label className={classnames(null, { 'pl_error_label': errors.new_password })} htmlFor="new_password">New password (leave blank to leave unchanged) <span className="required">*</span></label>
                    <input onChange={this.changeHandler} type="password" className={classnames("cus_field", { 'pl_error_input': errors.new_password })} name="new_password" id="new_password" value={full_state.new_password} />
                </div>
                <div className="form-group">
                    <label className={classnames(null, { 'pl_error_label': errors.confirm_new_password })} htmlFor="confirm_new_password">Confirm new password<span className="required">*</span></label>
                    <input onChange={this.changeHandler} type="password" className={classnames("cus_field", { 'pl_error_input': errors.confirm_new_password })} name="confirm_new_password" id="confirm_new_password" value={full_state.confirm_new_password} />
                </div>
                <div className="">	
                    <button type="submit" disabled={this.state.isLoading} className="roboto_condensed cus_button" name="login" value="Login">{saving?"Saving...":"Save changes"}</button>
                </div>
            </form>
            </Fragment>
            }
        </Fragment>
        );
    }
}
 
function mapStateToProps(state) {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(EditAccount);