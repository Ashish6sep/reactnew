import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Pagination from '../../Common/Pagination';
import Parser from 'html-react-parser';

class CommissionCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commission_coupon_list: [],
            // cancel_refund_order: [],
            total_earned: "0.00",
            payment_received: "0.00",
            adjustment: "0.00",
            zero_out: "0.00",
            balance: "0.00",
            error_meg: '',
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true
        }
        document.title = "Commission Coupon -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "distributor/getMealCommissionCoupon", { pagenum: 1 }).then(results => {
            const response = results.response;
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    commission_coupon_list: results.response.data.commission_coupon_list,
                    // cancel_refund_order: results.response.data.cancel_refund_order,
                    total_earned: results.response.data.total_earned,
                    payment_received: results.response.data.payment_received,
                    adjustment: results.response.data.adjustment,
                    zero_out: results.response.data.zero_out,
                    balance: results.response.data.balance,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    pagenum: parseInt(results.response.data.pagenum),
                    error_meg: results.response.message,
                    loading: false,
                });
            } else {
                this.setState({
                    error_meg: results.response.message,
                    loading: false
                });
            }
        });
        // AJAX_REQUEST("POST", "distributor/getCommissionEarnList", { pagenum: 1 }).then(results => {
        //     const response = results.response;
        //     if (parseInt(results.response.code) === 1000) {
        //         this.setState({
        //             commission_coupon_list: results.response.data.commission_coupon_list.commission_coupon_list_list,
        //             cancel_refund_order: results.response.data.cancel_refund_order,
        //             total_earned: results.response.data.total_earned,
        //             payment_received: results.response.data.payment_received,
        //             adjustment: results.response.data.adjustment,
        //             zero_out: results.response.data.zero_out,
        //             balance: results.response.data.balance,
        //             total_records: parseInt(results.response.data.commission_coupon_list.total_records),
        //             total_page: parseInt(results.response.data.commission_coupon_list.total_page),
        //             per_page: parseInt(results.response.data.commission_coupon_list.per_page),
        //             pagenum: parseInt(results.response.data.commission_coupon_list.pagenum),
        //             error_meg: results.response.message,
        //             loading: false,
        //         });
        //     } else {
        //         this.setState({
        //             error_meg: results.response.message,
        //             loading: false
        //         });
        //     }
        // });
    }

    pagenationHandle = (pageNumber) => {
        this.setState({
            loading: true
        });
        document.querySelector("body").scrollIntoView();
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "distributor/getMealCommissionCoupon", {
            pagenum: pagenum
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    commission_coupon_list: results.response.data.commission_coupon_list,
                    // cancel_refund_order: results.response.data.cancel_refund_order,
                    total_earned: results.response.data.total_earned,
                    payment_received: results.response.data.payment_received,
                    adjustment: results.response.data.adjustment,
                    zero_out: results.response.data.zero_out,
                    balance: results.response.data.balance,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    pagenum: parseInt(results.response.data.pagenum),
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
                    commission_coupon_list: [],
                    // cancel_refund_order: [],
                    total_earned: "0.00",
                    payment_received: "0.00",
                    adjustment: "0.00",
                    zero_out: "0.00",
                    balance: "0.00"
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
                        <Fragment>
                            <div className="woocommerce-MyAccount-content inner_content">
                                <h2 className="montserrat page-title">
                                    Meal Commission Coupon
                                    {/* <span>(SINCE LAST PAYOUT)</span> */}
                                    {/* <NavLink className="montserrat pull-right" to="/my-account/commission-coupon/all-commission">REAL-TIME EARNINGS</NavLink> */}
                                </h2>

                                {/* <div className="total_summery">
                                    <p>Total Earned: <b>{CURRENCY_FORMAT(this.state.total_earned)}</b>, Payment Received: <b>{CURRENCY_FORMAT(this.state.payment_received)}</b>, Adjustment: <b>{CURRENCY_FORMAT(this.state.adjustment)}</b>, Zero Out: <b>{CURRENCY_FORMAT(this.state.zero_out)}</b>,  Balance: <b>{CURRENCY_FORMAT(this.state.balance)}</b></p>
                                </div> */}

                                <table className="my_account_orders shop_table_responsive commission-coupon-table-wrapper">
                                    <colgroup>
                                        <col width="13%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="order-number  text-center"><span className="nobr">Batch Date</span></th>
                                            <th className="order-actions  text-center"><span className="nobr">Carried Forward</span></th>
                                            <th className="order-status text-center"><span className="nobr">Batch Sales Amount</span></th>
                                            <th className="order-representative text-center"><span className="nobr">Coupon Amount Earned</span></th>
                                            <th className="order-total text-center"><span className="nobr">Amount To Be Redeemed</span></th>
                                            <th className="order-actions text-center"><span className="nobr">Amount Redeemed</span></th>
                                            {/* <th className="order-actions text-right"><span className="nobr">Expired</span></th>
                                            <th className="order-actions"><span className="nobr">Status</span></th> */}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            this.state.commission_coupon_list.length <= 0 ? <tr><td className="text-center" colSpan="6" style={{ textAlign: 'center !important' }}>No Data Available</td></tr> :
                                                this.state.commission_coupon_list.map(function (order, key) {
                                                    return (
                                                        <tr className="order" key={key}>
                                                            <td className="order-number" data-title="Batch Date">
                                                                <NavLink className=" pull-right mob_left_right_none" to={`/my-account/commission-coupon/${order.payout_id}`}>{order.batch_date}</NavLink>
                                                            </td>
                                                            <td className="order-total  text-right" data-title="Carried Forward">
                                                                {order.carried_forward}
                                                            </td>
                                                            <td className="order-status text-right" data-title="Batch Sales Amount">
                                                                {order.batch_sales_amount}
                                                            </td>
                                                            <td className="order-representative  text-right" data-title="Coupon Amount Earned">
                                                                <NavLink className=" pull-right mob_left_right_none" to={`/my-account/commission-coupon/${order.payout_id}`}>{order.coupon_amount_earned}</NavLink>
                                                            </td>
                                                            <td className="order-total  text-right" data-title="Amount To Be Redeemed">
                                                                {order.amount_to_be_redeemed}
                                                            </td>
                                                            <td className="order-total  text-right" data-title="Amount Redeemed">
                                                                {order.amount_redeemed}
                                                            </td>
                                                            {/* <td className="order-actions text-right" data-title="Expired">{order.expired_date}</td>
                                                            <td className={`order-actions toTitleCase ${order.status == 'redeemable' ? 'text-success' : 'text-danger'}`} data-title="Status">
                                                                {order.status}
                                                            </td> */}
                                                        </tr>
                                                    )
                                                })
                                        }
                                    </tbody>
                                </table>

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


export default CommissionCoupon;