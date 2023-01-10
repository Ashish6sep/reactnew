import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../../Constants/AppConstants";
import Pagination from '../../../Common/Pagination';
import serialize from 'form-serialize';
import AlertWrapper from '../../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../../Common/AlertWrapperSuccess';

class MemberCommissionDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: {
                data: {
                    payout_period: "",
                    commission_earn: []
                }
            },
            error_meg: '',
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true,
            success_alert_wrapper_show: false,
            server_message: '',
            saving: false,
            isLoading: false,
            isFormValid: true,
            currentpageno: 1,
        }
        document.title = "Member Commission Details -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.pagenationHandle(1);
    }

    pagenationHandle = (pageNumber) => {
        this.setState({
            loading: true,
            currentpageno: pageNumber
        });
        document.querySelector("body").scrollIntoView();
        let data = {
            pagenum: parseInt(pageNumber),
            payout_id: this.props.match.params.id
        }
        AJAX_REQUEST("POST", "distributor/getMemberCommissionDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                this.setState({
                    response: results.response,
                    total_records: parseInt(data.total_records),
                    total_page: parseInt(data.total_page),
                    per_page: parseInt(data.per_page),
                    pagenum: parseInt(data.pagenum),
                    error_meg: results.response.message,
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                    error_meg: results.response.message,
                    total_records: 0,
                    total_page: 0,
                    per_page: 0,
                    pagenum: 1,
                    response: {
                        data: {
                            payout_period: "",
                            commission_earn: []
                        }
                    }
                });
            }
        });
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this), timedata);
    }

    MarkAsPaid = (e) => {
        e.preventDefault();
        const form = document.querySelector('#membercommissiondetails');
        let data = serialize(form, { hash: true });
        if (Object.entries(data).length === 0) {
            alert('Please select at least a member');
        } else {
            data.payout_id = this.props.match.params.id;
            this.setState({ errors: {}, isLoading: true, saving: true, server_message: '', error_meg: '', isFormValid: true, success_alert_wrapper_show: false, });
            AJAX_REQUEST("POST", "distributor/memberCommissionStatusUpdate",
                data
            ).then(results => {
                const response = results.response;
                if (parseInt(response.code) === 1000) {
                    const pagenum = parseInt(this.state.currentpageno);
                    AJAX_REQUEST("POST", "distributor/getMemberCommissionDetails", {
                        pagenum: pagenum, payout_id: this.props.match.params.id
                    }).then(results => {
                        if (parseInt(results.response.code) === 1000) {
                            this.setState({
                                response: results.response,
                                total_records: parseInt(results.response.data.total_records),
                                total_page: parseInt(results.response.data.total_page),
                                per_page: parseInt(results.response.data.per_page),
                                pagenum: parseInt(results.response.data.pagenum),
                                error_meg: results.response.message,
                                server_message: response.message,
                                success_alert_wrapper_show: true,
                                saving: false,
                                isLoading: false,
                            });
                            this.timeOut(5000);
                        } else {
                            this.setState({
                                server_message: response.message,
                                isLoading: false,
                                isFormValid: false,
                                saving: false,
                                error_meg: response.message,
                                success_alert_wrapper_show: false,
                            });
                        }
                    });
                } else {
                    this.setState({
                        server_message: response.message,
                        isLoading: false,
                        isFormValid: false,
                        saving: false,
                        error_meg: response.message,
                        success_alert_wrapper_show: false,
                    });
                }
            });
        }
    }

    render() {
        const { server_message, success_alert_wrapper_show } = this.state;
        const errors_data = server_message;
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <div className="woocommerce-MyAccount-content inner_content">
                                <form id="membercommissiondetails" method="post">
                                    {/* <input type="hidden" name="payout_id" value={this.props.match.params.id} /> */}
                                    <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                    <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show} />
                                    <h2 className=" montserrat page-title">MEMBER COMMISSION DETAILS: {this.state.response.data.payout_period}</h2>
                                    <div className="table_search order_search">
                                        <button disabled={this.state.isLoading} type="submit" className="roboto_condensed cus_button" onClick={this.MarkAsPaid}>{this.state.saving ? 'PLEASE WAIT...' : 'MARK AS PAID'}</button>
                                    </div>
                                    <table className="my_account_orders shop_table_responsive">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Member</th>
                                                <th className="text-right">Order Count</th>
                                                <th className="text-right">Order Amount</th>
                                                <th className="text-right">Commission</th>
                                                <th className="text-right">Refund/Cancel Amount</th>
                                                <th className="text-right">Commission Total</th>
                                                <th>Payout Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.response.data.commission_earn.length <= 0 ? <tr><td className="text-center" colSpan="8">{this.state.error_meg}</td></tr> :
                                                    this.state.response.data.commission_earn.map(function (order, key) {
                                                        return (
                                                            <tr key={key}>
                                                                {
                                                                    order.payout_status === 'pending' ?
                                                                        <td><input type="checkbox" name="member_ids[]" value={order.member_id} className="member_ids" /></td>
                                                                        :
                                                                        <td></td>
                                                                }
                                                                <td>{order.member_name}</td>
                                                                <td className="text-right">
                                                                    {order.order_count}
                                                                    <span className="count-total-wrap"><span>S: {order.supplement_order_count}</span><span> M: {order.meal_order_count}</span></span>
                                                                </td>
                                                                <td className="text-right">
                                                                    {order.order_amount}
                                                                    <span className="count-total-wrap"><span>S: {order.supplement_order_amount}</span><span> M: {order.meal_order_amount}</span></span>
                                                                </td>
                                                                <td className="text-right">
                                                                    {order.commission_earned}
                                                                    <span className="count-total-wrap"><span>S: {order.supplement_commission_earned}</span><span> M: {order.meal_commission_earned}</span></span>
                                                                </td>
                                                                <td className="text-right">
                                                                    {order.refunded}
                                                                    <span className="count-total-wrap"><span>S: {order.supplement_refunded}</span><span> M: {order.meal_refunded}</span></span>
                                                                </td>
                                                                <td className="text-right">
                                                                    {order.commission_total}
                                                                    <span className="count-total-wrap"><span>S: {order.supplement_commission_total}</span><span> M: {order.meal_commission_total}</span></span>
                                                                </td>
                                                                <td style={{ textTransform: "capitalize" }}>{order.payout_status}</td>
                                                            </tr>
                                                        )
                                                    })
                                            }
                                        </tbody>
                                    </table>
                                </form>

                                <div className="table-note">
                                    <span>*</span><span>S=Supplement</span> <span>M=Meal</span>
                                </div>

                                <Pagination
                                    pagenationHandle={this.pagenationHandle}
                                    total_records={this.state.total_records}
                                    total_page={this.state.total_page}
                                    per_page={this.state.per_page}
                                    pagenum={this.state.pagenum}
                                />

                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default MemberCommissionDetails;