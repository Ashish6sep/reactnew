import React, { Component, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT, GET_STORAGE } from "../../../Constants/AppConstants";
import Pagination from '../../Common/Pagination';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class CommissionPayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commission_earned: [],
            cancel_refund_order: [],
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
        document.title = "Commission Earned -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "distributor/getCommissionEarnList", { pagenum: 1 }).then(results => {
            const response = results.response;
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    commission_earned: results.response.data.commission_earned.commission_earned_list,
                    cancel_refund_order: results.response.data.cancel_refund_order,
                    total_earned: results.response.data.total_earned,
                    payment_received: results.response.data.payment_received,
                    adjustment: results.response.data.adjustment,
                    zero_out: results.response.data.zero_out,
                    balance: results.response.data.balance,
                    total_records: parseInt(results.response.data.commission_earned.total_records),
                    total_page: parseInt(results.response.data.commission_earned.total_page),
                    per_page: parseInt(results.response.data.commission_earned.per_page),
                    pagenum: parseInt(results.response.data.commission_earned.pagenum),
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
    }

    pagenationHandle = (pageNumber) => {
        this.setState({
            loading: true
        });
        document.querySelector("body").scrollIntoView();
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "distributor/getCommissionEarnList", {
            pagenum: pagenum
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    commission_earned: results.response.data.commission_earned.commission_earned_list,
                    cancel_refund_order: results.response.data.cancel_refund_order,
                    total_earned: results.response.data.total_earned,
                    payment_received: results.response.data.payment_received,
                    adjustment: results.response.data.adjustment,
                    zero_out: results.response.data.zero_out,
                    balance: results.response.data.balance,
                    total_records: parseInt(results.response.data.commission_earned.total_records),
                    total_page: parseInt(results.response.data.commission_earned.total_page),
                    per_page: parseInt(results.response.data.commission_earned.per_page),
                    pagenum: parseInt(results.response.data.commission_earned.pagenum),
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
                    cancel_refund_order: [],
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

        let settings = null;
        if (GET_STORAGE("settings")) {
            settings = JSON.parse(GET_STORAGE("settings"));
        }

        let meal_menu_active = false;
        if (settings && settings.meal_menu_public == "yes") {
            meal_menu_active = true;
        } else {
            if (this.props) {
                if (this.props.auth) {
                    if (this.props.auth.user) {
                        if (this.props.auth.user.meal_menu_activated) {
                            meal_menu_active = true;
                        }
                    }
                }
            }
        }

        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <div className="woocommerce-MyAccount-content inner_content">
                                <h2 className="montserrat page-title">
                                    COMMISSION EARNED <span>(SINCE LAST PAYOUT)</span>
                                    {/* <NavLink className="montserrat pull-right" to="/my-account/commission-payout/all-commission">REAL-TIME EARNINGS</NavLink> */}
                                </h2>

                                <div className="total_summery">
                                    <p>Total Earned: <b>{CURRENCY_FORMAT(this.state.total_earned)}</b>, Payment Received: <b>{CURRENCY_FORMAT(this.state.payment_received)}</b>, Adjustment: <b>{CURRENCY_FORMAT(this.state.adjustment)}</b>, Zero Out: <b>{CURRENCY_FORMAT(this.state.zero_out)}</b>,  Balance: <b>{CURRENCY_FORMAT(this.state.balance)}</b></p>
                                </div>

                                <table className="my_account_orders shop_table_responsive">
                                    <colgroup>
                                        <col width="13%" />
                                        <col width="11%" />
                                        <col width="12%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="order-number text-center"><span className="nobr">Payout Period</span></th>
                                            <th className="order-date text-center"><span className="nobr">Order Count</span></th>
                                            <th className="order-status text-center"><span className="nobr">Order Amount</span></th>
                                            <th className="order-representative text-center"><span className="nobr">Order Commission</span></th>
                                            <th className="order-total text-center"><span className="nobr">Cancel / Refund</span></th>
                                            <th className="order-actions text-center"><span className="nobr">Carried Forward</span></th>
                                            <th className="order-actions text-center"><span className="nobr">Commission Adjustment</span></th>
                                            <th className="order-actions text-center"><span className="nobr">Commission Total</span></th>
                                            <th className="order-actions text-center"><span className="nobr">Commission Received</span></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            this.state.commission_earned.length <= 0 ? <tr><td className="text-center" colSpan="9">No Data Available</td></tr> :
                                                this.state.commission_earned.map(function (order, key) {
                                                    return (
                                                        <tr className="order" key={key}>
                                                            <td className="order-number" data-title="Payout Period">
                                                                <NavLink className=" pull-right mob_left_right_none" to={`/my-account/commission-payout/${order.payout_id}`}>{order.payout_period}</NavLink>
                                                            </td>
                                                            <td className="order-date text-right" data-title="Order Count">
                                                                {order.order_count}
                                                                {
                                                                    meal_menu_active ?
                                                                        <span className="count-total-wrap"><span>S: {order.supplement_order_count}</span><span> M: {order.meal_order_count}</span></span>
                                                                        : ''
                                                                }

                                                            </td>
                                                            <td className="order-status text-right" data-title="Order Amount">
                                                                {order.order_amount}
                                                                {
                                                                    meal_menu_active ?
                                                                        <span className="count-total-wrap"><span>S: {order.supplement_order_amount}</span><span> M: {order.meal_order_amount}</span></span>
                                                                        : ''
                                                                }

                                                            </td>
                                                            <td className="order-representative  text-right" data-title="Order Commission">
                                                                {order.order_commission}
                                                                {
                                                                    meal_menu_active ?
                                                                        <span className="count-total-wrap"><span>S: {order.supplement_order_commission}</span><span> M: {order.meal_order_commission}</span></span>
                                                                        : ''
                                                                }

                                                            </td>
                                                            <td className="order-total  text-right" data-title="Cancel/Refund">
                                                                {order.cancel_refund}
                                                                {
                                                                    meal_menu_active ?
                                                                        <span className="count-total-wrap"><span>S: {order.supplement_cancel_refund}</span><span> M: {order.meal_cancel_refund}</span></span>
                                                                        : ''
                                                                }

                                                            </td>
                                                            <td className="order-total  text-right" data-title="Carried Forward">
                                                                {order.carried_forward}
                                                                {
                                                                    meal_menu_active ?
                                                                        <span className="count-total-wrap"><span>S: {order.supplement_carried_forward}</span><span> M: {order.meal_carried_forward}</span></span>
                                                                        : ''
                                                                }
                                                            </td>
                                                            {
                                                                Number(order.commission_adjustment) > 0 ?
                                                                    <td className="order-actions  text-right" data-title="Commission Adjustment">
                                                                        <NavLink to={`/my-account/commission-payout/adjustment-details/${order.payout_id}`}>
                                                                            {order.commission_adjustment}
                                                                            {
                                                                                meal_menu_active ?
                                                                                    <span className="count-total-wrap"><span>S: {order.supplement_commission_adjustment}</span><span> M: {order.meal_commission_adjustment}</span></span>
                                                                                    : ''
                                                                            }
                                                                        </NavLink>
                                                                    </td>
                                                                    :
                                                                    <td className="order-actions  text-right" data-title="Commission Adjustment">
                                                                        {order.commission_adjustment}
                                                                        {
                                                                            meal_menu_active ?
                                                                                <span className="count-total-wrap"><span>S: {order.supplement_commission_adjustment}</span><span> M: {order.meal_commission_adjustment}</span></span>
                                                                                : ''
                                                                        }
                                                                    </td>
                                                            }
                                                            <td className="order-actions  text-right" data-title="Commission Total">
                                                                {order.commission_total}
                                                                {
                                                                    meal_menu_active ?
                                                                        <span className="count-total-wrap"><span>S: {order.supplement_commission_total}</span><span>M: {order.meal_commission_total}</span> </span>
                                                                        : ''
                                                                }

                                                            </td>
                                                            <td className="order-actions  text-right" data-title="Commission Received">
                                                                {order.commission_received}
                                                                {
                                                                    meal_menu_active ?
                                                                        <span className="count-total-wrap"><span> Cash: {order.cash_payment}</span> <span> Coup. {order.coupon_payment}</span> </span>
                                                                        : ''
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                        }
                                    </tbody>
                                </table>

                                <div className="table-note">
                                    {
                                        meal_menu_active ?
                                            <Fragment>
                                                <span>*</span><span>S=Supplement</span> <span>M=Meal</span><span>Coup=Coupon</span>
                                            </Fragment>
                                            : ''
                                    }
                                </div>

                                <Pagination
                                    pagenationHandle={this.pagenationHandle}
                                    total_records={this.state.total_records}
                                    total_page={this.state.total_page}
                                    per_page={this.state.per_page}
                                    pagenum={this.state.pagenum}
                                />



                                <h2 className=" montserrat page-title">REFUND/CHARGEBACK ORDER</h2>
                                <table className="my_account_orders shop_table_responsive">
                                    <thead>
                                        <tr>
                                            <th>Date Time</th>
                                            <th>Order#</th>
                                            <th className="text-right">Order Amount</th>
                                            <th className="text-right">Refund/Chargeback Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.cancel_refund_order.length <= 0 ? <tr><td className="text-center" colSpan="4">No Data Available</td></tr> :
                                                this.state.cancel_refund_order.map(function (order, key) {
                                                    return (
                                                        <tr className="order" key={key}>
                                                            <td data-title="Date Time">{order.date_time}</td>
                                                            <td data-title="Order"><NavLink to={`/my-account/view-order/${order.order_id}`}>#{order.order_id}</NavLink></td>
                                                            <td data-title="Order Amount" className="text-right"><span>{CURRENCY_FORMAT(order.order_amount)}</span></td>
                                                            <td data-title="Cancel/Refund Amount" className="text-right"><span>{CURRENCY_FORMAT(order.cancel_refund_amount)}</span></td>
                                                        </tr>
                                                    )
                                                })
                                        }
                                    </tbody>
                                </table>

                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}


// export default CommissionPayout;
CommissionPayout.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps)(CommissionPayout));