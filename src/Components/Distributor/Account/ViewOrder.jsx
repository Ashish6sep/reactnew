import React, { Component, Fragment } from 'react';
import ReactImageFallback from "react-image-fallback";
import { NavLink } from "react-router-dom";
import { AJAX_REQUEST, CURRENCY_FORMAT, GET_STORAGE } from "../../../Constants/AppConstants";
import OrderedProductsList from './OrderedProductsList';
import RelatedSubscriptionsList from './RelatedSubscriptionsList';
import history from '../../../history';

class ViewOrder extends Component {
    constructor(props) {
        super(props)
        // Check Tax
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }
        this.state = {
            re_order_status: 'yes',
            taxStatus: settings ? settings.tax_status : 0,
            error_meg: '',
            products: [],
            order_id: this.props.match.params.id,
            order_note: '',
            created_at: '',
            status: '',
            shipping_cost: 0,
            tax_amount: 0,
            shipping: '',
            payment_method: '',
            order_type: '',
            total: 0,
            billing_address: [],
            shipping_address: [],
            related_subscription: [],
            discounts: [],
            loading: true
        }
        document.title = "Order Details -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.gettheOrderDetails();
    }

    gettheOrderDetails = () => {
        let data = {
            order_id: this.state.order_id
        }
        AJAX_REQUEST("POST", "order/getDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                this.setState({
                    re_order_status: data.re_order_status,
                    products: data.products,
                    total: data.total,
                    order_note: data.order_note,
                    payment_method: data.payment_method,
                    order_type: data.order_type,
                    shipping: data.shipping,
                    shipping_cost: data.shipping_cost,
                    tax_amount: data.tax_amount,
                    subtotal: data.subtotal,
                    status: data.status,
                    created_at: data.created_at,
                    billing_address: data.billing_address,
                    shipping_address: data.shipping_address,
                    related_subscription: data.related_subscription,
                    discounts: data.discounts,
                    loading: false
                });
            } else if (parseInt(results.response.code) === 4000) {
                history.push('/');
            } else {
                this.setState({
                    error_meg: results.response.message,
                    loading: false
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
                        <div className="MyAccount-content">
                            <h2 className=" montserrat page-title">Order #{this.state.order_id}</h2>
                            <p className="order_short_summery">Order #<mark className="order-number">{this.state.order_id}</mark> was placed on <mark className="order-date">{this.state.created_at}</mark> and is currently <mark className="order-status toTitleCase">{this.state.status}</mark>.</p>
                            <h2 className=" montserrat page-title">Order details
                                {
                                    (this.state.re_order_status === 'yes') ? <NavLink className="montserrat pull-right wc-forward" to={`/reorder/${this.state.order_id}`} > ORDER AGAIN</NavLink> : ''
                                }
                            </h2>
                            <section className="woocommerce-order-details">

                                <table className="my_account_orders my_account_orders_view">
                                    <colgroup>
                                        <col width="60%" />
                                        <col width="40%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="text-center"><b>{(this.state.order_type == 'supplement') ? "Product" : "Meal Item"}</b></th>
                                            <th className="text-center"><b>Total</b></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.products.length <= 0 ? <tr><td className="text-center" colSpan="2">{this.state.error_meg}</td></tr> :
                                                this.state.products.map(function (product, key) {
                                                    return (
                                                        <OrderedProductsList key={`op${key}`} product={product} order_type={this.state.order_type} />
                                                    )
                                                }.bind(this))
                                        }
                                        <tr>
                                            <td>Subtotal:</td>
                                            <td><span><strong>{CURRENCY_FORMAT(this.state.subtotal)}</strong></span></td>
                                        </tr>
                                        {
                                            (this.state.discounts && this.state.discounts.length > 0) ?
                                                this.state.discounts.map(function (discount, key) {
                                                    return (
                                                        <Fragment key={key}>
                                                            <tr>
                                                                <td>{discount.label}</td>
                                                                <td>{CURRENCY_FORMAT(discount.amount)}</td>
                                                            </tr>
                                                        </Fragment>
                                                    )
                                                }.bind(this))
                                                : null
                                        }
                                        <tr>
                                            <td>Shipping:</td>
                                            <td><span>{CURRENCY_FORMAT(this.state.shipping_cost)}</span><small className="shipped_via">&nbsp;{this.state.shipping}</small></td>
                                        </tr>
                                        {
                                            (this.state.taxStatus == 1) ?
                                                <Fragment>
                                                    <tr>
                                                        <td>Tax:</td>
                                                        <td>
                                                            {CURRENCY_FORMAT(this.state.tax_amount)}
                                                        </td>
                                                    </tr>
                                                </Fragment>
                                                : null
                                        }
                                        <tr>
                                            <td>Payment Method:</td>
                                            <td>{this.state.payment_method}</td>
                                        </tr>
                                        <tr>
                                            <td>Total:</td>
                                            <td><span><strong>{CURRENCY_FORMAT(this.state.total)}</strong></span></td>
                                        </tr>
                                        <tr>
                                            <td>Note:</td>
                                            <td>{this.state.order_note}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            <div className="related_subscription">

                                {
                                    this.state.related_subscription.length <= 0 ? null :
                                        <div className="woocommerce-order-details">
                                            <h2 className=" montserrat page-title">Related Subscriptions</h2>
                                            <table className="my_account_orders shop_table_responsive">
                                                <thead>
                                                    <tr>
                                                        <th className="order-number"><span className="nobr /">Subscription</span></th>
                                                        <th className="order-date"><span className="nobr /">Status</span></th>
                                                        <th className="order-status"><span className="nobr /">Next Payment</span></th>
                                                        <th className="order-total"><span className="nobr /">Total</span></th>
                                                        <th className="order-actions">&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.related_subscription.length <= 0 ? <tr><td className="text-center" colSpan="5">{this.state.error_meg}</td></tr> :
                                                            this.state.related_subscription.map(function (subscription, key) {
                                                                return (
                                                                    <RelatedSubscriptionsList
                                                                        key={key}
                                                                        subscription={subscription}
                                                                    />
                                                                )
                                                            })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                }

                                <section className="woocommerce-customer-details">
                                    <div className="pull-left billing_address_container">
                                        <h2 className="montserrat checkout_title">Billing address</h2>
                                        <address className="shipping-address">
                                            {this.state.billing_address.hasOwnProperty('name') ? this.state.billing_address.name : ''}<br />
                                            {this.state.billing_address.hasOwnProperty('street_address') ? this.state.billing_address.street_address : ''}<br />
                                            {this.state.billing_address.hasOwnProperty('city') ? this.state.billing_address.city : ''}<br />
                                            {this.state.billing_address.hasOwnProperty('state') ? this.state.billing_address.state : ''}<br />
                                            {this.state.billing_address.hasOwnProperty('zip') ? this.state.billing_address.zip : ''}
                                            <p><i className="fa fa-phone" aria-hidden="true"></i> {this.state.billing_address.hasOwnProperty('phone') ? this.state.billing_address.phone : ''}</p>
                                            <p><i className="fa fa-envelope-o" aria-hidden="true"></i>{this.state.billing_address.hasOwnProperty('email') ? this.state.billing_address.email : ''}</p>
                                        </address>
                                    </div>
                                    <div className="pull-right billing_address_container">
                                        <h2 className="montserrat checkout_title">Shipping address</h2>
                                        <address className="shipping-address">
                                            {this.state.shipping_address.hasOwnProperty('name') ? this.state.shipping_address.name : ''}<br />
                                            {this.state.shipping_address.hasOwnProperty('street_address') ? this.state.shipping_address.street_address : ''}<br />
                                            {this.state.shipping_address.hasOwnProperty('city') ? this.state.shipping_address.city : ''}<br />
                                            {this.state.shipping_address.hasOwnProperty('state') ? this.state.shipping_address.state : ''}<br />
                                            {this.state.shipping_address.hasOwnProperty('zip') ? this.state.shipping_address.zip : ''}
                                        </address>
                                    </div>
                                    <div className="clearfix"></div>
                                </section>
                            </div>
                        </div>
                }
            </Fragment>

        );
    }
}

export default ViewOrder;