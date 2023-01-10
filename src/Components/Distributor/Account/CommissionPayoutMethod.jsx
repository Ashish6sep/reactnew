import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';

class CommissionPayoutMethod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            saving: false,
            errorAlertShow: false,
            successAlertShow: false,
            message: '',

            supplement_payout_method_label: '',
            supplement_payout_method: '',
            supplement_payout_method_before_threshold: '',
            supplement_payout_method_before_threshold_change: '',
            supplement_payout_method_after_threshold: '',
            supplement_payout_method_after_threshold_change: '',
            supplement_allowed_to_change: 'no',
            supplement_coupon_threshold: '',
            supplement_update_logs: [],

            meal_payout_status: 'active',
            meal_payout_method_label: '',
            meal_payout_method: '',
            meal_payout_method_before_threshold: '',
            meal_payout_method_before_threshold_change: '',
            meal_payout_method_after_threshold: '',
            meal_payout_method_after_threshold_change: '',
            meal_allowed_to_change: 'no',
            meal_coupon_threshold: '',
            meal_update_logs: [],

            update_alert_message: ''
        }
        document.title = "Commission Payout Method -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getPayoutSettings();
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                successAlertShow: false,
                errorAlertShow: false
            });
        }.bind(this), timedata);
    }

    getPayoutSettings = () => {
        AJAX_REQUEST("POST", "distributor/payoutsettings", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                this.setState({
                    loading: false,

                    supplement_payout_method_label: data.supplement_payout_method_label,
                    supplement_payout_method: data.supplement_payout_method,
                    supplement_payout_method_before_threshold: data.supplement_payout_method_before_threshold,
                    supplement_payout_method_before_threshold_change: data.supplement_payout_method_before_threshold_change,
                    supplement_payout_method_after_threshold: data.supplement_payout_method_after_threshold,
                    supplement_payout_method_after_threshold_change: data.supplement_payout_method_after_threshold_change,
                    supplement_allowed_to_change: data.supplement_allowed_to_change,
                    supplement_update_logs: data.supplement_update_logs,
                    supplement_coupon_threshold: data.supplement_coupon_threshold,

                    meal_payout_status: data.meal_payout_status,
                    meal_payout_method_label: data.meal_payout_method_label,
                    meal_payout_method: data.meal_payout_method,
                    meal_payout_method_before_threshold: data.meal_payout_method_before_threshold,
                    meal_payout_method_before_threshold_change: data.meal_payout_method_before_threshold_change,
                    meal_payout_method_after_threshold: data.meal_payout_method_after_threshold,
                    meal_payout_method_after_threshold_change: data.meal_payout_method_after_threshold_change,
                    meal_allowed_to_change: data.meal_allowed_to_change,
                    meal_update_logs: data.meal_update_logs,
                    meal_coupon_threshold: data.meal_coupon_threshold,

                    update_alert_message: data.update_alert_message,
                });
            } else {
                this.setState({
                    loading: false,
                });
            }
        });
    }

    updatePayoutSettings = (e, payoutType) => {
        e.preventDefault();

        if (window.confirm(this.state.update_alert_message)) {
            this.setState({ saving: true });

            let data = {};
            if (payoutType == 'supplement') {
                data = {
                    payout_type: payoutType,
                    payout_method: this.state.supplement_payout_method,
                    payout_method_before_threshold: this.state.supplement_payout_method_before_threshold,
                    payout_method_after_threshold: this.state.supplement_payout_method_after_threshold,
                }
            } else {
                data = {
                    payout_type: payoutType,
                    payout_method: this.state.meal_payout_method,
                    payout_method_before_threshold: this.state.meal_payout_method_before_threshold,
                    payout_method_after_threshold: this.state.meal_payout_method_after_threshold,
                }
            }

            AJAX_REQUEST("POST", "distributor/updatePayoutSettings", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    this.setState({
                        saving: false,
                        errorAlertShow: false,
                        successAlertShow: true,
                        message: results.response.message,
                    });
                    this.getPayoutSettings();
                    this.timeOut(5000);
                } else {
                    this.setState({
                        saving: false,
                        errorAlertShow: true,
                        successAlertShow: false,
                        message: results.response.message,
                    });
                    this.timeOut(5000);
                }
            });
        }

    }

    render() {
        return (
            <Fragment>
                {
                    (this.state.loading) ? <div className="loading"></div> :
                        <Fragment>
                            <div className="woocommerce-MyAccount-content inner_content member_tab_wrapper">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="supplement-tab" data-toggle="tab" href="#supplement" role="tab" aria-controls="supplement" aria-selected="true">SUPPLEMENT</a>
                                    </li>
                                    {(this.state.meal_payout_status === 'active') ?
                                        <li className="nav-item">
                                        <a className="nav-link" id="meals-tab" data-toggle="tab" href="#meals" role="tab" aria-controls="meals" aria-selected="false">MEALS</a>
                                    </li> : '' }
                                </ul>
                                <div className="tab-content commission-payout-method-area" id="myTabContent">
                                    <AlertWrapper errors_data={this.state.message} isFormValid={!this.state.errorAlertShow} />
                                    <AlertWrapperSuccess errors_data={this.state.message} success_alert_wrapper_show={this.state.successAlertShow} />
                                    <div className="tab-pane fade show active" id="supplement" role="tabpanel" aria-labelledby="supplement-tab">
                                        <Fragment>
                                            <div className="woocommerce-MyAccount-content">
                                                <form className="woocommerce-EditAccountForm edit-account" action="" method="post" onSubmit={(e) => this.updatePayoutSettings(e, 'supplement')}>
                                                    <div className="distributor_settings commission-payout-method">
                                                        <label className="label_block" htmlFor="">Current Commission Payout Method : </label> &nbsp;
                                                        <label>{this.state.supplement_payout_method_label}</label> <br />
                                                        {
                                                            (this.state.supplement_payout_method == 'cash_and_coupon') ?
                                                                <Fragment>
                                                                    <label className="label_block" htmlFor="">Current Commission Threshold : </label> &nbsp;
                                                                    <label>{this.state.supplement_coupon_threshold}</label> <br />
                                                                    <label className="label_block" htmlFor="account_first_name">Payout Method Up To Threshold : </label> &nbsp;
                                                                    {
                                                                        (this.state.supplement_payout_method_before_threshold_change == 'yes') ?
                                                                            <Fragment>
                                                                                <label><input type="radio" name="supplement_payout_method_before_threshold" value="cash" checked={this.state.supplement_payout_method_before_threshold == 'cash'} onChange={this.changeHandler} /> Cash </label> &nbsp;
                                                                                <label><input type="radio" name="supplement_payout_method_before_threshold" value="coupon" checked={this.state.supplement_payout_method_before_threshold == 'coupon'} onChange={this.changeHandler} /> Coupon </label> <br />
                                                                            </Fragment>
                                                                            :
                                                                            <label className="toTitleCase">{this.state.supplement_payout_method_before_threshold}</label>
                                                                    }

                                                                    <label className="label_block" htmlFor="account_first_name">Payout Method After Threshold : </label> &nbsp;
                                                                    {
                                                                        (this.state.supplement_payout_method_after_threshold_change == 'yes') ?
                                                                            <Fragment>
                                                                                <label><input type="radio" name="supplement_payout_method_after_threshold" value="cash" checked={this.state.supplement_payout_method_after_threshold == 'cash'} onChange={this.changeHandler} /> Cash </label> &nbsp;
                                                                                <label><input type="radio" name="supplement_payout_method_after_threshold" value="coupon" checked={this.state.supplement_payout_method_after_threshold == 'coupon'} onChange={this.changeHandler} /> Coupon </label> <br />
                                                                            </Fragment>
                                                                            :
                                                                            <label className="toTitleCase">{this.state.supplement_payout_method_after_threshold}</label>

                                                                    }

                                                                    {
                                                                        (this.state.supplement_allowed_to_change == 'yes') ?
                                                                            <button type="submit" disabled={this.state.saving} className="roboto_condensed cus_button" name="save_account_settings" value="Save changes">{(this.state.saving) ? "Saving..." : "Save changes"}</button>
                                                                            : ""
                                                                    }
                                                                </Fragment>
                                                                : ""
                                                        }
                                                    </div>
                                                </form>
                                                <div className="clearfix"></div>
                                                <Fragment>
                                                    {
                                                        (this.state.supplement_update_logs.length <= 0) ? "" :
                                                            <div className="mt-3">
                                                                <h2 className="montserrat page-title mt-3">Updated Logs</h2>
                                                                <table className="my_account_orders shop_table_responsive">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Updated Date</th>
                                                                            <th>Previous Method</th>
                                                                            <th>Updated Method</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            this.state.supplement_update_logs.map(function (log, key) {
                                                                                return (
                                                                                    <tr className="order" key={key}>
                                                                                        <td data-title="Updated Date" className="toTitleCase">{log.update_date}</td>
                                                                                        <td data-title="Previous Method" className="toTitleCase">{log.old_method}</td>
                                                                                        <td data-title="Updated Method" className="toTitleCase">{log.update_method}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                    }
                                                </Fragment>
                                            </div>
                                        </Fragment>
                                    </div>
                                    <div className="tab-pane fade" id="meals" role="tabpanel" aria-labelledby="meals-tab">
                                        <Fragment>
                                            <div className="woocommerce-MyAccount-content">
                                                <form className="woocommerce-EditAccountForm edit-account" action="" method="post" onSubmit={(e) => this.updatePayoutSettings(e, 'meal')}>
                                                    <div className="distributor_settings commission-payout-method">
                                                        <label className="label_block" htmlFor="">Current Commission Payout Method : </label> &nbsp;
                                                        <label>{this.state.meal_payout_method_label}</label> <br />
                                                        {
                                                            (this.state.meal_payout_method == 'cash_and_coupon') ?
                                                                <Fragment>
                                                                    <label className="label_block" htmlFor="">Current Commission Threshold : </label> &nbsp;
                                                                    <label>{this.state.meal_coupon_threshold}</label> <br />
                                                                    <label className="label_block" htmlFor="account_first_name">Payout Method Up To Threshold : </label> &nbsp;
                                                                    {
                                                                        (this.state.meal_payout_method_before_threshold_change == 'yes') ?
                                                                            <Fragment>
                                                                                <label><input type="radio" name="meal_payout_method_before_threshold" value="cash" checked={this.state.meal_payout_method_before_threshold == 'cash'} onChange={this.changeHandler} /> Cash </label> &nbsp;
                                                                                <label><input type="radio" name="meal_payout_method_before_threshold" value="coupon" checked={this.state.meal_payout_method_before_threshold == 'coupon'} onChange={this.changeHandler} /> Coupon </label> <br />
                                                                            </Fragment>
                                                                            :
                                                                            <label className="toTitleCase">{this.state.meal_payout_method_before_threshold}</label>
                                                                    }

                                                                    <label className="label_block" htmlFor="account_first_name">Payout Method After Threshold : </label> &nbsp;
                                                                    {
                                                                        (this.state.meal_payout_method_after_threshold_change == 'yes') ?
                                                                            <Fragment>
                                                                                <label><input type="radio" name="meal_payout_method_after_threshold" value="cash" checked={this.state.meal_payout_method_after_threshold == 'cash'} onChange={this.changeHandler} /> Cash </label> &nbsp;
                                                                                <label><input type="radio" name="meal_payout_method_after_threshold" value="coupon" checked={this.state.meal_payout_method_after_threshold == 'coupon'} onChange={this.changeHandler} /> Coupon </label> <br />
                                                                            </Fragment>
                                                                            :
                                                                            <label className="toTitleCase">{this.state.meal_payout_method_after_threshold}</label>
                                                                    }

                                                                    {
                                                                        (this.state.meal_allowed_to_change == 'yes') ?
                                                                            <button type="submit" disabled={this.state.saving} className="roboto_condensed cus_button" name="save_account_settings" value="Save changes">{(this.state.saving) ? "Saving..." : "Save changes"}</button>
                                                                            : ""
                                                                    }
                                                                </Fragment>
                                                                : ""
                                                        }
                                                    </div>
                                                </form>
                                                <div className="clearfix"></div>
                                                <Fragment>
                                                    {
                                                        (this.state.meal_update_logs.length <= 0) ? "" :
                                                            <div className="mt-3">
                                                                <h2 className="montserrat page-title">Updated Logs</h2>
                                                                <table className="my_account_orders shop_table_responsive">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Updated Date</th>
                                                                            <th>Previous Method</th>
                                                                            <th>Updated Method</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            this.state.meal_update_logs.map(function (log, key) {
                                                                                return (
                                                                                    <tr className="order" key={key}>
                                                                                        <td data-title="Updated Date" className="toTitleCase">{log.update_date}</td>
                                                                                        <td data-title="Previous Method" className="toTitleCase">{log.old_method}</td>
                                                                                        <td data-title="Updated Method" className="toTitleCase">{log.update_method}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                    }
                                                </Fragment>
                                            </div>
                                        </Fragment>
                                    </div>
                                </div>
                            </div>
                        </Fragment >

                }
            </Fragment>
        );
    }
}

export default CommissionPayoutMethod;