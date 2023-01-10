import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Pagination from '../../Common/Pagination';

class CommissionPayoutDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payout_period: "",
            commission_earn: [],
            error_meg: '',
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true
        }
        document.title = "Commission Earn Details -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.pagenationHandle(1);
    }

    pagenationHandle = (pageNumber) => {
        this.setState({ loading: true });
        let data = {
            pagenum: parseInt(pageNumber),
            payout_id: this.props.match.params.id
        }
        AJAX_REQUEST("POST", "team_member/getCommissionEarnDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                this.setState({
                    payout_period: data.payout_period,
                    commission_earn: data.commission_earn,
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
                    payout_period: "",
                    commission_earn: [],
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
                                <h2 className=" montserrat page-title">COMMISSION EARNED DETAILS: {this.state.payout_period}</h2>
                                <table className="my_account_orders shop_table_responsive">
                                    <thead>
                                        <tr>
                                            <th>Order</th>
                                            <th>Date</th>
                                            <th>Order Type</th>
                                            <th className="text-right">Total</th>
                                            <th className="text-right">Commission Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            (this.state.commission_earn.length <= 0) ? <tr><td className="text-center" colSpan="5">{this.state.error_meg}</td></tr> :
                                                this.state.commission_earn.map(function (order, key) {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{order.order}</td>
                                                            <td>{order.date}</td>
                                                            <td className="toTitleCase">{order.order_type}</td>
                                                            <td className="text-right"><span>{CURRENCY_FORMAT(order.total)}</span></td>
                                                            <td className="text-right"><span>{CURRENCY_FORMAT(order.commission_earned)}</span></td>
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

export default CommissionPayoutDetails;