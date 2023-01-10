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
            error_meg: '',
            w9_form_url: "",
            tax_form_verify_status: "no",
            w9_form_file: null,
            success_alert_wrapper_show: false,
            loading: true,
            saving: false,
            isLoading: false,
            isFormValid: true,
        }
        document.title = "W-9 Form -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "master_affiliate/getW9Form", {}).then(results => {
            const response = results.response;
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    w9_form_url: response.data.w9_form_url,
                    tax_form_verify_status: response.data.tax_form_verify_status,
                    loading: false,
                    error_meg: response.message,
                });
            } else {
                this.setState({
                    error_meg: response.message,
                    loading: false,
                });
            }
        });
    }

    changeW9File = (e) => {
        this.setState({ w9_form_file: e.target.files[0] });
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this), timedata);
    }

    w9FormUpload = (e) => {
        e.preventDefault();

        let data = new FormData();
        data.append('w9_form_file', this.state.w9_form_file);
        this.setState({ errors: {}, isLoading: true, saving: true, server_message: '', error_meg: '', isFormValid: true, });
        AJAX_REQUEST_WITH_FILE("POST", "master_affiliate/updateW9Form", data).done(function (results) {
            const response = results.response;
            if (parseInt(response.code) === 1000) {
                this.setState({
                    w9_form_url: response.data.w9_form_url,
                    tax_form_verify_status: response.data.tax_form_verify_status,
                    server_message: response.message,
                    isLoading: false,
                    success_alert_wrapper_show: true,
                    saving: false,
                    isFormValid: true,
                    error_meg: response.message,
                });
                document.getElementById('w9fileupload').value = '';
                this.timeOut(5000);
            } else {
                this.setState({
                    server_message: response.message,
                    isLoading: false,
                    isFormValid: false,
                    saving: false,
                    error_meg: response.message,
                });
            }
            // history.push("/my-account/w-9-form");

            // alert(results.response.message)
            // console.log(results.response);
        }.bind(this));
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
                            <div className="woocommerce-MyAccount-content inner_content w9_form">
                                <h2 className="montserrat page-title">W-9 Form</h2>
                                <p className="file-upload-header-text">If you would like to use a different EIN or SSN to report your earnings as a Master Affiliate, please submit a separate W-9 here. This is not required, and will not change the W-9 on file for your personal sales/earnings. If you need to update the EIN or SSN on file for your personal sales/earnings, please navigate to '<NavLink to="/my-account" style={{ textDecoration: "underline" }} >My Account</NavLink>' to do so.</p>
                                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show} />
                                <form onSubmit={this.w9FormUpload} className="woocommerce-EditAccountForm edit-account" action="" method="post" encType="multipart/form-data">
                                    <p>
                                        <label htmlFor="account_first_name"><b>Current W-9 Form:</b>
                                            {
                                                this.state.w9_form_url === "" ?
                                                    <span> Not uploaded yet</span>
                                                    :
                                                    <a href={`${this.state.w9_form_url}`} target="_blank" style={{ textDecoration: "underline" }}> Click here to view ({this.state.tax_form_verify_status === "yes" ? "Verified" : "Not Verified"})</a>
                                            }
                                        </label>
                                    </p>
                                    <p>
                                        Please note that uploading new W-9 form will be disable your payout till the new form get approved by Admin.
                    </p>
                                    <p>
                                        <label htmlFor="account_first_name"><b>W-9 Form Upload</b> (Please fill &amp; sign W-9 form <NavLink to="/w-9-tax-form" target="_blank" style={{ textDecoration: "underline" }} >here</NavLink>, after getting the W-9 downloaded form please attache following)</label>
                                    </p>
                                    <p> <input id="w9fileupload" type="file" onChange={this.changeW9File} required accept="application/pdf" /> </p>

                                    <div className="clear"></div>

                                    <button disabled={this.state.isLoading} type="submit" className="roboto_condensed cus_button" name="save_w_9_form" value="Upload">{saving ? "Uploading..." : "Upload"}</button>

                                </form>
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default W9Form;