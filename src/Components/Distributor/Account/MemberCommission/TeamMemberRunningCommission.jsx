import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../../Constants/AppConstants";
import Pagination from '../../../Common/Pagination';

class TeamMemberRunningCommission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commission: [],
            error_meg: '',
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true
        }
        document.title = "Team Member Running Commission -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.pagenationHandle(1);
    }

    pagenationHandle = (pageNumber) => {
        this.setState({ loading: true });
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "distributor/getTeamMemberRunningCommission", { pagenum: pagenum }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    commission: results.response.data.commission,
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
                    commission: []
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
                                <h2 className="montserrat page-title"> TEAM MEMBER RUNNING COMMISSION </h2>
                                <table className="my_account_orders shop_table_responsive">
                                    <colgroup>
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                        <col width="11.11%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="order-number"><span className="nobr">Team Member</span></th>
                                            <th className="order-number text-right"><span className="nobr">Order Count</span></th>
                                            <th className="order-date text-right"><span className="nobr">Order Amount</span></th>
                                            <th className="order-status text-right"><span className="nobr">Commission Earn</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.commission.length <= 0 ? <tr><td className="text-center" colSpan="4">{this.state.error_meg}</td></tr> :
                                                this.state.commission.map(function (order, key) {
                                                    return (
                                                        <tr className="order" key={key}>
                                                            <td className="order-number" data-title="Team Member">
                                                                <Link className="montserrat mob_left_right_none" to={`/my-account/manage-representative/${order.team_member_id}`}>{order.team_member}</Link>
                                                            </td>
                                                            <td className="order-date text-right" data-title="Order Count">
                                                                {order.order_count}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_order_count}</span><span> M: {order.meal_order_count}</span></span>
                                                            </td>
                                                            <td className="order-date text-right" data-title="Order Amount">
                                                                {order.order_amount}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_order_amount}</span><span> M: {order.meal_order_amount}</span></span>
                                                            </td>
                                                            <td className="order-status text-right" data-title="Commission Earn">
                                                                {order.commission_earn}
                                                                <span className="count-total-wrap"><span>S: {order.supplement_commission_earn}</span><span> M: {order.meal_commission_earn}</span></span>
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

export default TeamMemberRunningCommission;