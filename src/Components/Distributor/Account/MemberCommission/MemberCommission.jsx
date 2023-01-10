import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../../Constants/AppConstants";
import Pagination from '../../../Common/Pagination';

class MemberCommission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            member_commission: [],
            error_meg: '',
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true
        }
        document.title = "Member Commission -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.pagenationHandle(1);
    }

    pagenationHandle = (pageNumber) => {
        this.setState({ loading: true });
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "distributor/getMemberCommission", { pagenum: pagenum }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                this.setState({
                    member_commission: data.member_commission,
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
                    member_commission: []
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
                                <h2 className="montserrat page-title"> TEAM MEMBER COMMISSION PAYOUT <span>(UP TO LAST PAYOUT DATE)</span> <Link className="montserrat pull-right" to="/my-account/member-commission/running-commission">RUNNING COMMISSION</Link></h2>
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
                                            <th className="order-number"><span className="nobr">Total Member</span></th>
                                            <th className="order-date text-right"><span className="nobr">Order Count</span></th>
                                            <th className="order-status text-right"><span className="nobr">Order Amount</span></th>
                                            <th className="order-representative text-right"><span className="nobr">Commission Total</span></th>
                                            <th className="order-total text-right"><span className="nobr">Cancel/Refund Amount</span></th>
                                            <th className="order-actions text-right"><span className="nobr">Payable Commission</span></th>
                                            <th className="order-actions text-right"><span className="nobr">Payout Status</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.member_commission.length <= 0 ? <tr><td className="text-center" colSpan="8">{this.state.error_meg}</td></tr> :
                                                this.state.member_commission.map(function (order, key) {
                                                    return (
                                                        <tr className="order" key={key}>
                                                            <td className="order-number" data-title="Payout Period">
                                                                <Link className=" pull-right mob_left_right_none" to={`/my-account/member-commission/${order.payout_id}`}>{order.payout_period}</Link>
                                                            </td>
                                                            <td className="order-date" data-title="Total Member">
                                                                {order.total_member}
                                                            </td>
                                                            <td className="order-date text-right" data-title="Order Count">
                                                                {order.order_count}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_order_count}</span><span> M: {order.meal_order_count}</span></span>
                                                            </td>
                                                            <td className="order-status text-right" data-title="Order Amount">
                                                                {order.order_amount}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_order_amount}</span><span> M: {order.meal_order_amount}</span></span>
                                                            </td>
                                                            <td className="order-representative text-right" data-title="Commission Total">
                                                                {order.commission_total}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_commission_total}</span><span> M: {order.meal_commission_total}</span></span>
                                                            </td>
                                                            <td className="order-total text-right" data-title="Cancel/Refund Amount">
                                                                {order.cancel_refund_amount}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_cancel_refund_amount}</span><span> M: {order.meal_cancel_refund_amount}</span></span>
                                                            </td>
                                                            <td className="order-total text-right" data-title="Payable Commission">
                                                                {order.payable_commission}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_payable_commission}</span><span> M: {order.meal_payable_commission}</span></span>
                                                            </td>
                                                            <td className="order-actions text-right toTitleCase" data-title="Payout Status">
                                                                {order.payout_status}
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
export default MemberCommission;