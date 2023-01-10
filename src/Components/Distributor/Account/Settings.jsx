import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team_member_global_subscription_commission: '',
            isLoading:false,
            isFormValid:true,
            server_message:'',
            success_alert_wrapper_show:false,
            loading                 :true,
            saving: false
        }
        document.title = "Settings -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","distributor/settings",{}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    team_member_global_subscription_commission: response.data.team_member_global_subscription_commission,
                    loading                 :false,
                    server_message: response.message,
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

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this),timedata);
    }

    FormSubmit = (e) => {
        e.preventDefault();
        this.setState({
            isLoading:true,
            saving: true
        });
        AJAX_REQUEST("POST","distributor/updateSettings",this.state).then(results => {
            const response = results.response;
            if(parseInt(response.code)===1000) {
                this.setState({
                    server_message: response.message,
                    isFormValid:true,
                    isLoading:false,
                    success_alert_wrapper_show: true,
                    saving: false
                });
                this.timeOut(5000);
            }else{
                this.setState({
                    server_message: response.message,
                    isFormValid:false,
                    isLoading:false,
                    saving: false
                });
            }         
        });
    }

    render() {
        const { server_message, success_alert_wrapper_show, saving } = this.state;
        const errors_data = server_message;
        return (
            <Fragment>
                {
                        this.state.loading ? 
                        <div className="loading"></div>
                        :
                    <Fragment>
                <div className="woocommerce-MyAccount-content">
                    <h2 className="montserrat page-title">Settings</h2>
                    <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                    <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show}/>  
                    <form className="woocommerce-EditAccountForm edit-account" action="" method="post" onSubmit={this.FormSubmit}>
                        <div className="distributor_settings">
                            <label className="label_block" htmlFor="account_first_name">Team Member Global Subscription Commission : </label>&nbsp;&nbsp;
                            <input type="radio" name="team_member_global_subscription_commission" value="recurring" checked={this.state.team_member_global_subscription_commission === 'recurring'} onChange={(e) => this.setState({ team_member_global_subscription_commission: e.target.value })} /> Recurring &nbsp;     
                            <input type="radio" name="team_member_global_subscription_commission" value="onetime" checked={this.state.team_member_global_subscription_commission === 'onetime'} onChange={(e) => this.setState({ team_member_global_subscription_commission: e.target.value })} /> One-Time           
                        </div>
                        <button type="submit" disabled={this.state.isLoading} className="roboto_condensed cus_button" name="save_account_settings" value="Save changes">{saving?"Saving...":"Save changes"}</button>
                    </form>
                                             
                </div>
            </Fragment>
                }
        </Fragment>
        );
    }
}
 
export default Settings;