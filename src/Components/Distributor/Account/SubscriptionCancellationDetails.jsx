import React, { Component, Fragment } from 'react';
import ReactImageFallback from "react-image-fallback";
import { NavLink } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT, GET_STORAGE } from "../../../Constants/AppConstants";
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';

class SubscriptionCancellationDetails extends Component {
    constructor(props) {
        super(props)
        // Check Tax
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }
        this.state = {
            loading: true,
            taxStatus: settings ? settings.tax_status : 0,
            subscription_id: parseInt(this.props.match.params.subscription_id),
            items: [],
            subtotal: 0,
            shipping_charge: 0,
            tax_amount: 0,
            shipping_method: "",
            payment_method: "",
            subscription_type: "",
            duration: "",
            total: 0,
            error_meg: '',
            success_alert_wrapper_show: false
        }
        document.title = "Subscription Item Details -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView() // Scroll to Top
        // document.getElementById("pageTitle").innerHTML = "SUBSCRIPTION #" + this.state.subscription_id;
        this.getSubscriptionDetails();
    }

    getSubscriptionDetails = () => {
        let data = {
            subscription_id: this.state.subscription_id
        }
        AJAX_REQUEST("POST", "subscription/getDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let subs = results.response.data.subscription
                this.setState({
                    items: subs.items,
                    subtotal: subs.subtotal,
                    shipping_charge: subs.shipping_charge,
                    tax_amount: subs.tax_amount,
                    shipping_method: subs.shipping_method,
                    payment_method: subs.payment_method,
                    subscription_type: subs.subscription_type,
                    duration: subs.duration,
                    total: subs.total,
                    loading: false,
                });
            } else {
                this.setState({
                    error_meg: results.response.message,
                    loading: false,
                });
            }
        });
    }

    removeSubscriptionItem = (itemId) => {
        if (window.confirm('Are you sure you want remove this item from your subscription?')) {
            document.querySelector("body").scrollIntoView() // Scroll to Top
            this.setState({
                loading: true,
                error_meg: '',
                success_alert_wrapper_show: false
            });

            let data = {
                subscription_id: this.state.subscription_id,
                subscription_item_id: itemId
            }
            AJAX_REQUEST("POST", "subscription/removedItem", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    this.setState({
                        error_meg: results.response.message,
                        loading: false,
                        success_alert_wrapper_show: true
                    });
                    this.getSubscriptionDetails();
                    setTimeout(function () {
                        this.setState({
                            success_alert_wrapper_show: false
                        });
                    }.bind(this), 3000);
                } else {
                    this.setState({
                        error_meg: results.response.message,
                        loading: false,
                        success_alert_wrapper_show: false
                    });
                }
            });
        }
    }

    render() {

        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <div className="MyAccount-content">
                            <AlertWrapperSuccess errors_data={this.state.error_meg} success_alert_wrapper_show={this.state.success_alert_wrapper_show} />
                            <section className="woocommerce-order-details">
                                <h2 className=" montserrat page-title">SUBSCRIPTION ITEM DETAILS
                                    {
                                        (this.state.subscription_type == 'supplement') ?
                                            <NavLink to={`/subscription-item/${this.state.subscription_id}`} className="pull-right roboto_condensed wc-forward">Add New Item</NavLink>
                                            :
                                            <NavLink to={`/meals?subscription_id=${this.state.subscription_id}`} className="pull-right roboto_condensed wc-forward">Change Meal Item</NavLink>
                                    }
                                </h2>
                                <table className="my_account_orders my_account_orders_view ">
                                    <colgroup>
                                        <col width="5%" />
                                        <col width="" />
                                        <col width="40%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th className="text-center"><b>{(this.state.subscription_type == 'supplement') ? "Product" : "Meal Item"}</b></th>
                                            <th className="text-center"><b>Total</b></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.items.length <= 0 ? <tr><td className="text-center" colSpan="3">No Item Found!</td></tr> :
                                                this.state.items.map(function (item, key) {
                                                    if ((this.state.status === "Cancelled") || (this.state.status === "Failed")) {
                                                        return (
                                                            <tr key={key}>
                                                                <td className="product_name"><a data-item={item.hasOwnProperty('item_id') ? item.item_id : ''} className="remove"><i className="fa fa-times" aria-hidden="true"></i></a> </td>
                                                                <td className="product_name">
                                                                    {item.hasOwnProperty('name') ? item.name : ''}
                                                                    <strong className="product-quantity">&nbsp;× {item.hasOwnProperty('quantity') ? item.quantity : ''}</strong>
                                                                </td>
                                                                <td>
                                                                    <span>{item.hasOwnProperty('total_price') ? CURRENCY_FORMAT(item.total_price) : ''}</span> / {item.duration}
                                                                </td>
                                                            </tr>
                                                        )
                                                    } else {
                                                        return (
                                                            <tr key={key}>
                                                                <td className="product_name">
                                                                    {
                                                                        (this.state.subscription_type == 'supplement') ?
                                                                            <a data-item={item.hasOwnProperty('item_id') ? item.item_id : ''} onClick={() => this.removeSubscriptionItem(item.item_id)} className="remove"><i className="fa fa-times" aria-hidden="true"></i></a>
                                                                            : ""
                                                                    }
                                                                </td>
                                                                <td className="product_name">
                                                                    {item.hasOwnProperty('name') ? item.name : ''}
                                                                    <strong className="product-quantity">&nbsp;× {item.hasOwnProperty('quantity') ? item.quantity : ''}</strong>
                                                                </td>
                                                                <td>
                                                                    <span>{item.hasOwnProperty('total_price') ? CURRENCY_FORMAT(item.total_price) : ''}</span> / {item.duration}
                                                                </td>
                                                            </tr>
                                                        )
                                                    }

                                                }.bind(this))
                                        }
                                        <tr>
                                            <td colSpan="2">Subtotal:</td>
                                            <td><span><strong>{CURRENCY_FORMAT(this.state.subtotal)}</strong></span></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Shipping:</td>
                                            <td><span>{CURRENCY_FORMAT(this.state.shipping_charge)}</span><small className="shipped_via">&nbsp; via  {this.state.shipping_method}</small></td>
                                        </tr>
                                        {
                                            (this.state.taxStatus == 1) ?
                                                <Fragment>
                                                    <tr>
                                                        <td colSpan="2">Tax:</td>
                                                        <td><span>{CURRENCY_FORMAT(this.state.tax_amount)}</span></td>
                                                    </tr>
                                                </Fragment>
                                                : null
                                        }
                                        <tr>
                                            <td colSpan="2">Payment method:</td>
                                            <td><span>{this.state.payment_method}</span></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Total:</td>
                                            <td><span><strong>{CURRENCY_FORMAT(this.state.total)}</strong></span> / {this.state.duration} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                        </div>
                }
            </Fragment>
        );
    }
}

export default SubscriptionCancellationDetails;