import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import Pagination from '../../Common/Pagination';
import OrderLists from './OrderLists';

class OrderByMe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order_id: '',
            is_affiliate_sale: '',
            order_type: '',
            orders: [],
            error_meg: '',
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true,
            filter_loading: false
        }
        document.title = "Orders - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "order/getList", {
            pagenum: 1
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    orders: results.response.data.orders,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    pagenum: parseInt(results.response.data.pagenum),
                    error_meg: results.response.message
                });
            } else {
                this.setState({
                    loading: false,
                    error_meg: results.response.message
                });
            }
        });
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    selectedIsReferrer = (event) => {
        this.setState({
            is_affiliate_sale: event.target.value
        });
    }

    selectedOrderType = (event) => {
        this.setState({
            order_type: event.target.value
        });
    }

    pagenationHandle = (pageNumber) => {
        this.setState({
            loading: true
        });
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "order/getList", {
            pagenum: pagenum,
            is_affiliate_sale: document.getElementById("is_affiliate_sale").value,
            order_type: document.getElementById("order_type").value,
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    pagenum,
                    orders: results.response.data.orders,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    error_meg: results.response.message
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

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.setState({
            loading: true,
            filter_loading: true
        });
        AJAX_REQUEST("POST", "order/getList", {
            order_id: document.getElementById("order_id").value,
            is_affiliate_sale: document.getElementById("is_affiliate_sale").value,
            order_type: document.getElementById("order_type").value,
            pagenum: 1
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    filter_loading: false,
                    pagenum: 1,
                    orders: results.response.data.orders,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    error_meg: results.response.message
                });
            } else {
                this.setState({
                    loading: false,
                    filter_loading: false,
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
            <div className="woocommerce-MyAccount-content inner_content">
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <h2 className=" montserrat page-title">ORDERS</h2>
                            <div className="table_search order_search">
                                <form onSubmit={this.onSubmitHandler} method="post">
                                    <select onChange={this.selectedIsReferrer} id="is_affiliate_sale" className="cus_field" name="is_affiliate_sale" defaultValue={this.state.is_affiliate_sale}>
                                        <option value="">Is Referrer</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                    <select onChange={this.selectedOrderType} id="order_type" className="cus_field" name="order_type" defaultValue={this.state.order_type}>
                                        <option value="">All Types</option>
                                        <option value="supplement">Product</option>
                                        <option value="meal">Meal</option>
                                    </select>
                                    <input className="cus_field" type="text" id="order_id" name="order_id" onChange={this.changeHandler} placeholder="Order ID" value={this.state.order_id} />
                                    <input className="roboto_condensed cus_button" type="submit" name="action" value={this.state.filter_loading ? "Searching..." : "Search"} />
                                </form>
                            </div>

                            <table className="my_account_orders shop_table_responsive">
                                <colgroup>
                                    <col width="5%" />
                                    <col width="20%" />
                                    <col width="20%" />
                                    <col width="20%" />
                                    <col width="12%" />
                                    <col width="20%" />
                                    <col width="5%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th className="order-number"><span className="nobr">Order</span></th>
                                        <th className="order-date"><span className="nobr">Date</span></th>
                                        <th className="order-status"><span className="nobr">Status</span></th>
                                        <th className="order-type"><span className="nobr">Order Type</span></th>
                                        <th className="order-type"><span className="nobr">Is Referrer</span></th>
                                        <th className="order-total"><span className="nobr">Total</span></th>
                                        <th className="order-actions"><span className="nobr">&nbsp;</span></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        this.state.orders.length <= 0 ? <tr><td className="text-center" colSpan="7">{this.state.error_meg}</td></tr> :
                                            this.state.orders.map(function (order, key) {
                                                return (
                                                    <OrderLists
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

                            <div className="woocommerce-notices-wrapper"></div>
                        </Fragment>
                }
            </div>
        );
    }
}

export default OrderByMe;