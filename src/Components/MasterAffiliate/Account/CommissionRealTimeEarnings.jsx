import React, { Component, Fragment } from 'react';
import Pagination from "../../Common/Pagination";
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Parser from 'html-react-parser';

class CommissionRealTimeEarnings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            realTimeEarnings: [],
            message: '',
            loading: true,
            // Pagination Config
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
        }
        document.title = "Real-Time Earnings - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getRealTimeEarnings(this.state.pagenum);
    }

    pagenationHandle = (pageNumber) => {
        this.setState({ loading: true });
        this.getRealTimeEarnings(pageNumber);
    }

    getRealTimeEarnings = (pageNumber) => {
        let data = { pagenum: parseInt(pageNumber) }
        AJAX_REQUEST("POST", "master_affiliate/getRealTimeEarnings", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    realTimeEarnings: results.response.data.real_time_earnings,
                    message: results.response.message,

                    loading: false,
                    // Pagination Config
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    pagenum: parseInt(results.response.data.pagenum),
                });
            }
            else {
                this.setState({
                    message: results.response.message,
                    loading: false,
                    // Pagination Config
                    total_records: 0,
                    total_page: 0,
                    per_page: 0,
                    pagenum: 1,
                })
            }
        });
    }

    render() {
        return (
            <Fragment>
                {
                    (this.state.loading) ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <div className="woocommerce-MyAccount-content inner_content">
                                <h2 className=" montserrat page-title">REAL-TIME EARNINGS</h2>

                                <table className="my_account_orders shop_table_responsive">
                                    <thead>
                                        <tr>
                                            <th>Affiliate Name</th>
                                            <th className="text-center">Total Orders</th>
                                            <th className="text-right">Affiliate Earnings</th>
                                            <th className="text-right">My Earned Commissions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.realTimeEarnings.length <= 0 ? <tr><td className="text-center" colSpan="4">{Parser(this.state.message)}</td></tr> :
                                                this.state.realTimeEarnings.map(function (realEarnings, key) {
                                                    return (
                                                        <Fragment key={key}>
                                                            <tr key={key}>
                                                                <td data-title="Affiliate Name">{realEarnings.hasOwnProperty('distributor_name') ? realEarnings.distributor_name : ''}</td>
                                                                <td data-title="Total Order" className="text-center">{realEarnings.hasOwnProperty('total_order') ? realEarnings.total_order : ''}</td>
                                                                <td className="text-right" data-title="Affiliate Earnings">{realEarnings.hasOwnProperty('distributor_earnings') ? CURRENCY_FORMAT(realEarnings.distributor_earnings) : ''}</td>
                                                                <td className="text-right" data-title="Earne Commission">{realEarnings.hasOwnProperty('earn_commission') ? CURRENCY_FORMAT(realEarnings.earn_commission) : ''}</td>
                                                            </tr>
                                                        </Fragment>
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

export default CommissionRealTimeEarnings;