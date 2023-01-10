import React, { Component, Fragment } from 'react';
import { API_URL, API_KEY, AJAX_REQUEST, AJAX_REQUEST_WITH_FILE, GET_STORAGE, USER } from "../../../Constants/AppConstants";
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';
import $ from 'jquery';
import history from "../../../history";
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { userLoginWithData } from '../../../Store/actions/loginActions';

class NewAgreement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error_meg: '',
            errors: {},
            w9_form_url: "",
            tax_form_verify_status: "no",
            new_agreement_form: null,
            success_alert_wrapper_show: false,
            loading: true,
            saving: false,
            isLoading: false,
            isFormValid: true,
        }
        document.title = "Affiliate Agreement Form -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.setState({
            loading: false,
        });
    }

    changeW9File = (e) => {
        this.setState({ new_agreement_form: e.target.files[0] });
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false,
            });
            history.push('/');
        }.bind(this), timedata);
    }

    w9FormUpload = (e) => {
        e.preventDefault();

        let data = new FormData();
        data.append('new_agreement_form', this.state.new_agreement_form);
        this.setState({ errors: {}, isLoading: true, saving: true, server_message: '', error_meg: '', isFormValid: true, });
        AJAX_REQUEST_WITH_FILE("POST", "distributor/updateNewAgreementForm", data).done(function (results) {
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
                response.data.alert_message = ' ' + response.message;
                this.props.userLoginWithData(response.data);
                history.push('/');
            } else {
                this.setState({
                    server_message: response.message,
                    isLoading: false,
                    isFormValid: false,
                    saving: false,
                    error_meg: response.message,
                });
            }
        }.bind(this));
    }

    render() {
        const { server_message, errors, success_alert_wrapper_show, success_alert_wrapper_show_ca, saving, saving_ca } = this.state;
        const errors_data = server_message;
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <div className="container">
                                <div className="rows">
                                    <main className="site-content">
                                        <div className="page-content entry-content user_registration">
                                            <div className="registration-form">
                                                <form onSubmit={this.w9FormUpload} method="post" id="registration_Form" className="register action_form" encType="multipart/form-data">
                                                    <h2 className="montserrat page-title">Affiliate Agreement</h2>
                                                    <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                                    <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show} />

                                                    <div className="form-group input_type_file">
                                                        <label htmlFor="reg_agreement_pdf_file" style={{ marginBottom: '5px' }}>
                                                            Affiliate Agreement Form - Please <NavLink to="/agreement-form" style={{ color: '#0000FF' }} >click on the link</NavLink> to generate your DocuSign agreement, sign, and then download/save to your computer. Once completed, please upload the saved copy by clicking "Choose File" below, and then "UPLOAD" to attach to your account.
                                                            <span className="required">*</span>
                                                        </label>
                                                        <input onChange={this.changeW9File} accept="application/pdf" className={classnames("cus_field", { 'pl_error_input': errors.agreement_form })} type="file" id="w9fileupload" name="agreement_form" required />
                                                    </div>

                                                    <div className="clear"></div>
                                                    <button disabled={this.state.isLoading} type="submit" className="roboto_condensed cus_button" name="save_w_9_form" value="Upload">{saving ? "Uploading..." : "Upload"}</button>
                                                </form>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                            </div>


                        </Fragment>
                }
            </Fragment>
        );
    }
}

NewAgreement.propTypes = {
    userLoginWithData: PropTypes.func.isRequired,
}

export default connect(null, { userLoginWithData })(NewAgreement);