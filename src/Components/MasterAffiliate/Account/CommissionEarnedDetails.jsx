import React, { Component, Fragment } from 'react';
import Pagination from "../../Common/Pagination";
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Parser from 'html-react-parser';

class CommissionEarnedDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commissionEarnedDetails: [],
            loading: true,
            message: '',
            // Pagination Config
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,

            payout_id: this.props.match.params.id,
        }
        document.title = "Commission Earned Details - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getCommissionEarnDetails(this.state.pagenum);
    }

    getCommissionEarnDetails = (pageNumber) => {
        const data = {
            payout_id: this.state.payout_id,
            pagenum: parseInt(pageNumber)
        }
        AJAX_REQUEST("POST", "master_affiliate/getCommissionEarnDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    commissionEarnedDetails: results.response.data.commission_earnings,
                    message: results.response.message,

                    details_date: results.response.data.details_date,

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
                                <h2 className=" montserrat page-title">COMMISSION EARNED DETAILS: {this.state.details_date}</h2>

                                <table className="my_account_orders shop_table_responsive">
                                    <thead>
                                        <tr>
                                            <th>Affiliate Name</th>
                                            <th>Total Order</th>
                                            <th className="text-right">Affiliate Earnings</th>
                                            <th>Set Commission</th>
                                            <th className="text-right">Earn Commission</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.commissionEarnedDetails.length <= 0 ? <tr><td className="text-center" colSpan="5">{Parser(this.state.message)}</td></tr> :
                                                this.state.commissionEarnedDetails.map(function (earnedDetails, key) {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{earnedDetails.hasOwnProperty('distributor_name') ? earnedDetails.distributor_name : ''}</td>
                                                            <td>{earnedDetails.hasOwnProperty('total_order') ? earnedDetails.total_order : ''}</td>
                                                            <td className="text-right">{earnedDetails.hasOwnProperty('distributor_earnings') ? CURRENCY_FORMAT(earnedDetails.distributor_earnings) : ''}</td>
                                                            <td>{earnedDetails.hasOwnProperty('set_commission') ? earnedDetails.set_commission : ''}</td>
                                                            <td className="text-right">{earnedDetails.hasOwnProperty('earn_commission') ? CURRENCY_FORMAT(earnedDetails.earn_commission) : ''}</td>
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

export default CommissionEarnedDetails;