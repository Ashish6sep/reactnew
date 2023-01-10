import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import history from '../../../history';
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';

class SubscriptionCancellationConfirm extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            isOthers: false,
            subscription_id: parseInt(this.props.match.params.subscription_id),
            comments: '',
            submitButton: false,

            success_alert_wrapper_show:false,
            error_alert_wrapper_show:true,            
            server_message:'',
        }
        document.title = "Subscription Cancellation -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView() // Scroll to Top
        // document.getElementById("pageTitle").innerHTML = "SUBSCRIPTION #"+this.state.subscription_id;
        this.setState({ loading: false, })
    }

    selectOption = (e) => {
        if(e.target.value=='others') {
            this.setState({ 
                isOthers:true, 
                comments: ""
            });
        } else {
            this.setState({
                isOthers:false,  
                comments: e.target.value
            })
        }       
    }
    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                error_alert_wrapper_show: true,
                success_alert_wrapper_show: false
            });
            history.push('/my-account/subscription-order/active-subscription');
        }.bind(this),timedata);
    }

    onSubmitCancelled = (e) => {
        e.preventDefault();
        this.setState({ submitButton: true, });

        let data = {
            subscription_id: this.state.subscription_id,
            comments: this.state.comments,
        }
        AJAX_REQUEST("POST","subscription/cancelled", data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    server_message: results.response.message,
                    success_alert_wrapper_show:true, 
                    error_alert_wrapper_show:true,                   
                    submitButton: false,
                });
                this.timeOut(5000);                
            } 
            else{
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
                                <form onSubmit={this.onSubmitCancelled} method="POST">
                                    <AlertWrapper errors_data={this.state.server_message} isFormValid={this.state.error_alert_wrapper_show}/>
                                    <AlertWrapperSuccess errors_data={this.state.server_message} success_alert_wrapper_show={this.state.success_alert_wrapper_show}/>  
                                    <h2 className=" montserrat page-title">SUBSCRIPTION CANCELLATION</h2>
                                    <p> Are you sure you want to cancel? </p>
                                    <p> We’re sorry to see you go. Would you take a quick minute and let us know why you’re canceling?</p>
                                    <div className="customer_continue_sub_cancel">
                                        <p><label><input onClick={(e)=>this.selectOption(e)} name="comments[]" type="radio" value="I didn't use them" defaultChecked="checked" /> I didn't use them</label></p>
                                        <p><label><input onClick={(e)=>this.selectOption(e)} name="comments[]" type="radio" value="I didn't enjoy the flavors" /> I didn't enjoy the flavors</label></p>
                                        <p><label><input onClick={(e)=>this.selectOption(e)} name="comments[]" type="radio" value="I do not plan on exercising anymore" /> I do not plan on exercising anymore</label></p>
                                        <p><label><input onClick={(e)=>this.selectOption(e)} name="comments[]" type="radio" value="I received the wrong order/shipping was delayed" /> I received the wrong order/shipping was delayed</label></p>
                                        <p><label><input onClick={(e)=>this.selectOption(e)} name="comments[]" type="radio" value="others" /> Others</label></p>
                                    </div>
                                    {
                                        this.state.isOthers?
                                        <textarea className="cus_field" onChange={this.changeHandler} name="comments"></textarea>
                                        : ""
                                    }                                
                                    <p><button className="roboto_condensed cus_button" type="submit">{this.state.submitButton? "Please Wait...": "CANCEL SUBSCRIPTION"}</button></p>
                                </form>
                            </section>
                        </div>
                    }
                </Fragment>
            );
    }
}
 
export default SubscriptionCancellationConfirm;
