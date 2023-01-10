import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import AffiliateOrdersList from './AffiliateOrdersList';
import Pagination from '../../Common/Pagination';

class AffiliateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            error_meg: '',
            orders: [],
            loading: true
        }
        document.title = "Affiliate Orders -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "order/getAffiliateOrders", { pagenum: 1 }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    total_records: results.response.data.total_records,
                    total_page: results.response.data.total_page,
                    per_page: results.response.data.per_page,
                    pagenum: results.response.data.pagenum,
                    orders: results.response.data.orders,
                    loading: false,
                    error_meg: results.response.message,
                });
            } else {
                this.setState({
                    error_meg: results.response.message,
                    loading: false,
                });
            }
        });
    }

    pagenationHandle = (pageNumber) => {
        this.setState({
            loading: true
        });
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "order/getAffiliateOrders", {
            pagenum: pagenum
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    pagenum,
                    orders: results.response.data.orders,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    error_meg: results.response.message,
                });
            } else {
                this.setState({
                    loading: false,
                    error_meg: results.response.message,
                    total_records: 0,
                    total_page: 0,
                    per_page: 0,
                    pagenum: 1,
                    orders: []
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
                                <h2 className=" montserrat page-title">AFFILIATE ORDERS</h2>
                                <table className="my_account_orders shop_table_responsive">
                                    <thead>
                                        <tr>
                                            <th className="order-number"><span className="nobr">Order</span></th>
                                            <th className="order-date"><span className="nobr">Date</span></th>
                                            <th className="order-status text-center"><span className="nobr">Status</span></th>
                                            <th className="order-status text-center"><span className="nobr">Order Type</span></th>
                                            <th className="order-representative text-right"><span className="nobr">Order Total</span></th>
                                            <th className="order-total  text-right"><span className="nobr">Commission Earned</span></th>
                                            <th className="order-actions"><span className="nobr">&nbsp;</span></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            this.state.orders.length <= 0 ? <tr><td className="text-center" colSpan="6">{this.state.error_meg}</td></tr> :
                                                this.state.orders.map(function (order, key) {
                                                    return (
                                                        <AffiliateOrdersList
                                                            key={key}
                                                            order={order}
                                                        />
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

export default AffiliateOrder;