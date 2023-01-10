import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import classnames from 'classnames';
import validatePaypalEmail from '../../../Validations/paypalEmail';
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';
import { NavLink } from 'react-router-dom';

class PaypalAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: [],
            active_email:"",
            errors: {},
            isValid:false,
            isLoading:false,
            isFormValid:true,
            server_message:'',
            error_meg : '',
            success_alert_wrapper_show:false,
            loading                 :true,
            saving: false
        }
        document.title = "PayPal Email -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","master_affiliate/getPaypalInfo",{}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    logs: response.data.logs,
                    active_email:response.data.active_email,
                    loading                 :false,
                    error_meg:response.message,
                });
            }else{
                this.setState({
                    loading                 :false,
                    server_message: response.message,
                    error_meg:response.message,
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
        const val_return = validatePaypalEmail(this.state);
        this.setState(val_return);
        if(val_return.isValid){
            this.setState({errors: {}, isLoading: true,saving: true,server_message:'',});
            AJAX_REQUEST("POST","master_affiliate/updatePaypalEmail",{paypal_email:this.state.active_email}).then(results => {
                const response = results.response;
                if(parseInt(response.code)===1000) {
                    this.setState({
                        server_message: response.message,
                        isFormValid:true,
                        isLoading:false,
                        success_alert_wrapper_show: true,
                        saving: false,
                        error_meg:response.message,
                        logs: response.data.logs,
                        active_email:response.data.active_email,
                    });
                    this.timeOut(5000);
                }else{
                    this.setState({
                        server_message: response.message,
                        isFormValid:false,
                        isLoading:false,
                        saving: false,
                        error_meg:response.message,
                    });
                }         
            });
        }
    }

    render() { 
        const { errors, server_message, success_alert_wrapper_show, saving, active_email, logs } = this.state;
        const errors_data = server_message;
        return (
            <Fragment>
                {
                        this.state.loading ? 
                        <div className="loading"></div>
                        :
            <Fragment>
                <div className="woocommerce-MyAccount-content inner_content w9_form">
                    <h2 className=" montserrat page-title">MY PAYPAL EMAIL</h2>
                    <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                    <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show}/>
                    <form className="action_form my_paypal_form" action="" method="post" onSubmit={this.onSubmit}>
                        <p>
                        If you would like to use a different PayPal Account to collect your earnings as a Master Affiliate, please submit that here. This is not required, and will not change the PayPal Account on file for your personal sales/earnings. If you need to update the PayPal Account on file for your personal sales/earnings, please navigate to '<NavLink to="/my-account" style={{ textDecoration: "underline" }} >My Account</NavLink>' to do so. Please note that payouts can not be processed if PayPal account is not provided.
                        </p>
                        <div className="form-group">
                            <label htmlFor="active_email" className={classnames(null, { 'pl_error_label': errors.active_email })} >PayPal E-mail <span className="required">*</span></label>
                            <input type="text" onChange={this.changeHandler} className={classnames("cus_field", { 'pl_error_input': errors.active_email })} name="active_email" id="active_email" value={active_email}/>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={this.state.isLoading} className="roboto_condensed cus_button" name="save_paypal_account" >{saving?"Saving...":"Save changes"}</button>
                        </div>
                    </form>

                    <div className="table-responsive">
                            <h2 className=" montserrat page-title">PAYPAL EMAIL UPDATE LOGS</h2>
                        <table className="table my_account_orders shop_table_responsive">
                            <thead>
                                <tr>
                                    <th>PayPal Email</th>
                                    <th>Added</th>
                                    <th>Changed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    logs.length <= 0 ? <tr><td className="text-center" colSpan="3"> No Data Found!</td></tr>:
                                    logs.map(function(order,key){
                                    return(
                                        <tr className="order alternate" key={key}>
                                            <td data-title="PayPal Email" className="order-number">{order.paypal_email}</td>
                                            <td data-title="Added" className="order-number">{order.added}</td>
                                            <td data-title="Changed" className="order-number">{order.changed}</td>
                                        </tr>
                                    )
                                    })
                                }
                            </tbody>
                        </table>           
                    </div>                                                       
                </div>
            </Fragment>
                }
        </Fragment>
        );
    }
}
 
export default PaypalAccount;