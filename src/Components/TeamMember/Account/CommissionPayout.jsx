import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Pagination from '../../Common/Pagination';

class CommissionPayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commission_earned: [],
            total_earned: 0,
            payment_received: 0,
            balance: 0,
            error_meg: '',
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true
        }
        document.title = "Commission Earned -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.pagenationHandle(1);
    }

    pagenationHandle = (pageNumber) => {
        this.setState({ loading: true });
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "team_member/getCommissionEarnList", { pagenum: pagenum }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                this.setState({
                    commission_earned: data.commission_earned.commission_earned_list,
                    total_earned: data.total_earned,
                    payment_received: data.payment_received,
                    balance: data.balance,
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
                    commission_earned: [],
                    total_earned: 0,
                    payment_received: 0,
                    balance: 0
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
                                <h2 className="montserrat page-title">COMMISSION EARNED <span>(SINCE LAST PAYOUT)</span> <NavLink className="montserrat pull-right" to="/my-account/commission-payout/all-commission">REAL-TIME EARNINGS</NavLink></h2>
                                <div className="total_summery">
                                    <p>Total Earned: <b>{CURRENCY_FORMAT(this.state.total_earned)}</b>, Payment Received: <b>{CURRENCY_FORMAT(this.state.payment_received)}</b>, Balance: <b>{CURRENCY_FORMAT(this.state.balance)}</b></p>
                                </div>
                                <table className="my_account_orders shop_table_responsive">
                                    <colgroup>
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="order-number"><span className="nobr">Payout Period</span></th>
                                            <th className="order-date text-right"><span className="nobr">Order Count</span></th>
                                            <th className="order-status text-right"><span className="nobr">Order Amount</span></th>
                                            <th className="order-representative text-right"><span className="nobr">Order Commission</span></th>
                                            <th className="order-total text-right"><span className="nobr">Cancel/Refund</span></th>
                                            <th className="order-actions text-right"><span className="nobr">Carried Forward</span></th>
                                            <th className="order-actions text-right"><span className="nobr">Commission Total</span></th>
                                            <th className="order-actions text-right"><span className="nobr">Commission Received</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.commission_earned.length <= 0 ? <tr><td className="text-center" colSpan="9">No Data Available</td></tr> :
                                                this.state.commission_earned.map(function (order, key) {
                                                    return (
                                                        <tr className="order" key={key}>
                                                            <td className="order-number" data-title="Payout Period">
                                                                <NavLink className="pull-right mob_left_right_none" to={`/my-account/commission-payout/${order.payout_id}`}>{order.payout_period}</NavLink>
                                                            </td>
                                                            <td className="order-date text-right" data-title="Order Count">
                                                                {order.order_count}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_order_count}</span><span> M: {order.meal_order_count}</span></span>
                                                            </td>
                                                            <td className="order-status text-right" data-title="Order Amount">
                                                                {order.order_amount}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_order_amount}</span><span> M: {order.meal_order_amount}</span></span>
                                                            </td>
                                                            <td className="order-representative text-right" data-title="Order Commission">
                                                                {order.order_commission}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_order_commission}</span><span> M: {order.meal_order_commission}</span></span>
                                                            </td>
                                                            <td className="order-total  text-right" data-title="Cancel/Refund">
                                                                {order.cancel_refund}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_cancel_refund}</span><span> M: {order.meal_cancel_refund}</span></span>
                                                            </td>
                                                            <td className="order-total  text-right" data-title="Carried Forward">
                                                                {order.carried_forward}
                                                            </td>
                                                            <td className="order-actions  text-right" data-title="Commission Total">
                                                                {order.commission_total}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_commission_total}</span><span>M: {order.meal_commission_total}</span> </span>
                                                            </td>
                                                            <td className="order-actions  text-right" data-title="Commission Received">
                                                                {order.commission_received}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                        }
                                    </tbody>
                                </table>

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

export default CommissionPayout;