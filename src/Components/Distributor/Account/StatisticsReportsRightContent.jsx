import React, { Component, Fragment } from 'react';
import { CURRENCY_FORMAT } from '../../../Constants/AppConstants';

class StatisticsReportsRightContent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <Fragment>
                {
                    this.props.reportLoading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <div className="tab-pane fade show active" id="tab_data" role="tabpanel" aria-labelledby="today-tab">
                                <div className="analytics_wrapper">
                                    <table className="sTable3 with-velocity-decline">
                                        <colgroup>
                                            <col width="40%" />
                                            <col width="40%" />
                                            <col width="20%" />
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="analytics_list analytics_listtwo">
                                                        <span className="analytics_number">{this.props.report_data.success_order_amount}</span>
                                                        <p>Success Order Amount</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="analytics_list analytics_listfour">
                                                        <span className="analytics_number">{this.props.report_data.number_of_success_order}</span>
                                                        <p>Number of Success Order</p>
                                                    </div>
                                                </td>
                                                <td colSpan="2">
                                                    <div className="analytics_list analytics_listfour">
                                                        <span className="analytics_number">{this.props.report_data.success_order_ratio}</span>
                                                        <p>Success Order Ratio</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="analytics_list analytics_listone">
                                                        <span className="analytics_number">{this.props.report_data.refund_amount}</span>
                                                        <p>Refund Amount</p>
                                                    </div>
                                                </td>
                                                <td colSpan="2">
                                                    <div className="analytics_list analytics_listtwo">
                                                        <span className="analytics_number"> {this.props.report_data.refund_ratio} </span>
                                                        <p>Refund Ratio</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="analytics_list analytics_listthree">
                                                        <span className="analytics_number">{this.props.report_data.canceled_amount}</span>
                                                        <p>Canceled Amount</p>
                                                    </div>
                                                </td>
                                                <td colSpan="2">
                                                    <div className="analytics_list analytics_listfour">
                                                        <span className="analytics_number"> {this.props.report_data.canceled_ratio} </span>
                                                        <p>Canceled Ratio</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3">
                                                    <div className="analytics_list analytics_listone">
                                                        <span className="analytics_number">{this.props.report_data.commission_earned}</span>
                                                        <p>Commission Earned</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default StatisticsReportsRightContent;