import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Pagination from '../../Common/Pagination';

class CommissionPayoutEarned extends Component {
    constructor(props) {
        super(props);
        this.state = {
            realtime_data: [],
            error_meg: '',
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true
        }
        document.title = "Real-Time Earnings -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.pagenationHandle(1);
    }

    pagenationHandle = (pageNumber) => {
        this.setState({ loading: true });
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "team_member/getRealTimeEarning", { pagenum: pagenum }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                this.setState({
                    realtime_data: data.realtime_data,
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
                    realtime_data: []
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
                                <h2 className=" montserrat page-title">REAL-TIME EARNINGS</h2>
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
                                            this.state.realtime_data.length <= 0 ? <tr><td className="text-center" colSpan="5">{this.state.error_meg}</td></tr> :
                                                this.state.realtime_data.map(function (order, key) {
                                                    return (
                                                        <tr key={key}>
                                                            <td data-title="Order">#{order.order}</td>
                                                            <td data-title="Date">{order.date}</td>
                                                            <td className="toTitleCase" data-title="Order Type">{order.order_type}</td>
                                                            <td data-title="Total" className="text-right"><span>{CURRENCY_FORMAT(order.total)}</span></td>
                                                            <td data-title="Commission Earned" className="text-right"><span>{CURRENCY_FORMAT(order.commission_earned)}</span></td>
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

export default CommissionPayoutEarned;