import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST, CURRENCY_FORMAT, GET_STORAGE } from "../../../Constants/AppConstants";
import daterangepicker from 'daterangepicker';
import $ from 'jquery';
import moment from "moment";
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';

class SubscriptionCancellationBillingUpdate extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            subscription_id: parseInt(this.props.match.params.subscription_id),
            next_payment_date:'',
            submitButton: false,

            success_alert_wrapper_show:false,
            error_alert_wrapper_show:true,            
            server_message:'',
        }
        document.title = "Subscription Billing Date Update -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView() // Scroll to Top
        // document.getElementById("pageTitle").innerHTML = "SUBSCRIPTION #"+this.state.subscription_id;
        this.getSubscriptionDetails();
    }

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                error_alert_wrapper_show: true,
                success_alert_wrapper_show: false
            });
        }.bind(this),timedata);
    }

    getSubscriptionDetails = () => {
        let data = {
            subscription_id: this.state.subscription_id
        }
        AJAX_REQUEST("POST", "subscription/getDetails", data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    next_payment_date:results.response.data.next_payment_date,
                    loading:false,
                });	
            } else {
                this.setState({
                    error_meg: results.response.message,
                    loading: false,
                });
            }            
        });
    }

    openChangeDate=(e)=>{
        $('.subscription_end_date_edit').hide();
        $('.subscription_end_date_edit_calender').show();

        $('.datepicker').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            startDate: moment(),
            minDate: moment(),
            locale: {
                format: 'YYYY-MM-DD'
            }
        });
    }
    
    closeChangeDate=(e)=>{
        $('.subscription_end_date_edit').show();
        $('.subscription_end_date_edit_calender').hide();
    }
   
    saveChange=(e)=>{
        this.setState({ submitButton: true })
        e.preventDefault();
        $('.subscription_end_date_edit').show();
        $('.subscription_end_date_edit_calender').hide();

        const next_payment_date = $('#the_date').val();
        const data = {next_payment_date:next_payment_date,subscription_id:this.state.subscription_id}

        AJAX_REQUEST("POST","subscription/changePaymentDate",data).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                const new_dated     = results.response.data.next_payment_date;
                $('#show_new_date').text(new_dated);

                this.setState({
                    server_message: results.response.message,
                    success_alert_wrapper_show:true, 
                    error_alert_wrapper_show:true, 
                    submitButton: false, 
                })
                this.timeOut(5000);
            } else {
                this.setState({                    
                    server_message: results.response.message,
                    success_alert_wrapper_show:false,                    
                    error_alert_wrapper_show:false,
                    submitButton: false,
                });
            }
        });
    }

    render() {

        return ( 
                <Fragment>
                    {
                        this.state.loading ? 
                        <div className="loading"></div>
                        :
                        <div className="MyAccount-content">
                            <section className="woocommerce-order-details">
                                <AlertWrapper errors_data={this.state.server_message} isFormValid={this.state.error_alert_wrapper_show}/>
                                <AlertWrapperSuccess errors_data={this.state.server_message} success_alert_wrapper_show={this.state.success_alert_wrapper_show}/>  
                                <h2 className=" montserrat page-title">SUBSCRIPTION BILLING DATE UPDATE</h2>
                                <table className="shop_table my_account_orders customer_subscriotion_view">
                                    <tbody>
                                        <tr>
                                            <td className="td_width">Next Payment Date</td>
                                            <td>
                                                <span id="show_new_date">{this.state.next_payment_date}</span>
                                                <div className="subscription_end_date_edit">
                                                    <a onClick={this.openChangeDate} className="roboto_condensed wc-forward edit_toggle">Change Payment Date</a>
                                                </div>
                                                <div className="subscription_end_date_edit_calender">
                                                    <input onChange={this.changeHandler} className="cus_field datepicker" id="the_date" type="text" name="" />
                                                    <a onClick={this.saveChange} className="roboto_condensed wc-forward">{this.state.submitButton? "Saving...": "Save Change"}</a> &nbsp;
                                                    <a onClick={this.closeChangeDate} className="roboto_condensed wc-forward subscription_end_date_cancel">Cancel</a>
                                                </div>
                                            </td>
                                        </tr>                                       
                                    </tbody>
                                </table>
                            </section>
                        </div>
                    }
                </Fragment>
            );
    }
}
 
export default SubscriptionCancellationBillingUpdate;
