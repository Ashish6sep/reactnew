import React, { Component, Fragment } from 'react';
import { API_URL, API_KEY, AJAX_REQUEST, AJAX_REQUEST_WITH_FILE, GET_STORAGE, USER } from "../../../../Constants/AppConstants";
import AlertWrapper from '../../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../../Common/AlertWrapperSuccess';
import $ from 'jquery';
import history from "../../../../history";
import { NavLink } from 'react-router-dom';

class W9Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error_meg : '',
            w9_form_url: "",
            tax_form_verify_status:"no",
            w9_form_file: null,

            canadian_gst_url: "",
            canadian_gst_verify_status:"no",
            canadian_gst_form_file: null,

            success_alert_wrapper_show:false,
            success_alert_wrapper_show_ca:false,
            loading                 :true,
            saving: false,
            isLoading:false,

            saving_ca: false,
            isLoading_ca:false,

            isFormValid:true,
            isFormValid_ca:true,
        }
        document.title = "W-9 Form -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","distributor/getW9Form",{}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    w9_form_url: response.data.w9_form_url,
                    tax_form_verify_status:response.data.tax_form_verify_status,
                    canadian_gst_url: response.data.canadian_gst_url,
                    canadian_gst_verify_status:response.data.canadian_gst_verify_status,
                    loading                 :false,
                    error_meg:response.message,
                });	
            }else{
                this.setState({
                    error_meg: response.message,
                    loading                 :false,
                });
            }
        });
    }

    changeW9File = (e) => {
        this.setState({w9_form_file: e.target.files[0]});
    }

    changeW9FileCa = (e) => {
        this.setState({canadian_gst_form_file: e.target.files[0]});
    }

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                success_alert_wrapper_show: false,
                success_alert_wrapper_show_ca: false
            });
            // for global message dismiss
            let globalMessageBtn = document.querySelector('#globalMessageBtn');
            if(globalMessageBtn){
                document.getElementById("globalMessageBtn").click();
            }
        }.bind(this),timedata);
    }

    w9FormUpload = (e) => {
        e.preventDefault();

        let data = new FormData();
        data.append('w9_form_file', this.state.w9_form_file);
        this.setState({errors: {}, isLoading: true,saving: true,server_message:'',error_meg:'',isFormValid:true,});
        AJAX_REQUEST_WITH_FILE("POST", "distributor/updateW9Form", data).done(function(results){
            const response = results.response;
            if(parseInt(response.code)===1000) {
                this.setState({
                    w9_form_url: response.data.w9_form_url,
                    tax_form_verify_status: response.data.tax_form_verify_status,
                    server_message: response.message,
                    isLoading:false,
                    success_alert_wrapper_show: true,
                    saving: false,
                    isFormValid:true,
                    error_meg:response.message,
                });
                document.getElementById('w9fileupload').value = '';
                this.timeOut(5000);
            }else{
                this.setState({
                    server_message: response.message,
                    isLoading:false,
                    isFormValid:false,
                    saving: false,
                    error_meg:response.message,
                });
            }
        }.bind(this));
    }

    w9FormUploadCA = (e) => {
        e.preventDefault();

        let data = new FormData();
        data.append('canadian_gst_form_file', this.state.canadian_gst_form_file);
        this.setState({errors: {}, isLoading_ca: true,saving_ca: true,server_message:'',error_meg:'',isFormValid_ca:true,});
        AJAX_REQUEST_WITH_FILE("POST", "distributor/updateCanadianGstForm", data).done(function(results){
            const response = results.response;
            if(parseInt(response.code)===1000) {
                this.setState({
                    canadian_gst_url: response.data.canadian_gst_url,
                    canadian_gst_verify_status: response.data.canadian_gst_verify_status,
                    server_message: response.message,
                    isLoading_ca:false,
                    success_alert_wrapper_show_ca: true,
                    saving_ca: false,
                    isFormValid_ca:true,
                    error_meg:response.message,
                });
                document.getElementById('w9fileupload_ca').value = '';
                this.timeOut(5000);
            }else{
                this.setState({
                    server_message: response.message,
                    isLoading_ca:false,
                    isFormValid_ca:false,
                    saving_ca: false,
                    error_meg:response.message,
                });
            }
        }.bind(this));
    }

    render() {
        const { server_message, success_alert_wrapper_show, success_alert_wrapper_show_ca, saving, saving_ca } = this.state;
        const errors_data = server_message;
        return (
            <Fragment>
                {
                        this.state.loading ? 
                        <div className="loading"></div>
                        :
            <Fragment>
            <div className="woocommerce-MyAccount-content inner_content w9_form">
                <h2 className="montserrat page-title">W-9 Form</h2>
                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show}/>
                <form onSubmit={this.w9FormUpload} className="woocommerce-EditAccountForm edit-account" action="" method="post" encType="multipart/form-data">
                    <p>
                    <label htmlFor="account_first_name"><b>Current W-9 Form:</b>
                        {
                            this.state.w9_form_url ===""? 
                            <span> Not uploaded yet</span>
                            : 
                            <a href={`${this.state.w9_form_url}`} target="_blank" style={{textDecoration: "underline"}}> Click here to view ({this.state.tax_form_verify_status==="yes"?"Verified":"Not Verified"})</a>
                        }
                    </label>
                    </p>
                    <p>
                    Please note that uploading new W-9 form will be disable your payout till the new form get approved by Admin.
                    </p>
                    <p>
                        <label htmlFor="account_first_name"><b>W-9 Form Upload</b> (Please fill &amp; sign W-9 form <NavLink to="/w-9-tax-form" target="_blank" style={{textDecoration: "underline"}} >here</NavLink>, after getting the W-9 downloaded form please attache following)</label>
                    </p>
                    <p> <input id="w9fileupload" type="file" onChange={this.changeW9File} required accept="application/pdf" /> </p>
                    
                    <div className="clear"></div>
                   
                    <button disabled={this.state.isLoading} type="submit" className="roboto_condensed cus_button" name="save_w_9_form" value="Upload">{saving?"Uploading...":"Upload"}</button>
                    
                </form>
            </div>
            <br />
            <br />
            <br />
            <div className="woocommerce-MyAccount-content inner_content w9_form">
                <h2 className="montserrat page-title">Canadian GST</h2>
                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid_ca}/>
                <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show_ca}/>
                <form onSubmit={this.w9FormUploadCA} className="woocommerce-EditAccountForm edit-account" action="" method="post" encType="multipart/form-data">
                    <p>
                    <label htmlFor="account_first_name"><b>Current Canadian GST:</b>
                        {
                            this.state.canadian_gst_url ===""? 
                            <span> Not uploaded yet</span>
                            : 
                            <a href={`${this.state.canadian_gst_url}`} target="_blank" style={{textDecoration: "underline"}}> Click here to view ({this.state.canadian_gst_verify_status==="yes"?"Verified":"Not Verified"})</a>
                        }
                    </label>
                    </p>
                    <p>
                    Please note that uploading new Canadian GST will be disable your payout till the new form get approved by Admin.
                    </p>
                    <p>
                        <label htmlFor="account_first_name"><b>Canadian GST Upload</b> (Please fill &amp; sign Canadian GST <NavLink to="/w-9-tax-form-ca" target="_blank" style={{textDecoration: "underline"}} >here</NavLink>, after getting the Canadian GST downloaded form please attache following)</label>
                    </p>
                    <p> <input id="w9fileupload_ca" type="file" onChange={this.changeW9FileCa} required accept="application/pdf" /> </p>
                    
                    <div className="clear"></div>
                   
                    <button disabled={this.state.isLoading_ca} type="submit" className="roboto_condensed cus_button" name="save_w_9_form" value="Upload">{saving_ca?"Uploading...":"Upload"}</button>
                    
                </form>
            </div>
            </Fragment>
            }
        </Fragment>
        );
    }
}
 
export default W9Form;