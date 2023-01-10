import React, { Component, Fragment } from 'react';
import ReactImageFallback from "react-image-fallback";
import { NavLink } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT, GET_STORAGE } from "../../../Constants/AppConstants";
import history from '../../../history';
import daterangepicker from 'daterangepicker';
import $ from 'jquery';
import RelatedOrders from './RelatedOrders';
import moment from "moment";
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';

class RelatedSubscription extends Component {
    constructor(props) {
        super(props)
        // Check Tax
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }

        const url = new URL(window.location.href);
        const is_subscription_orders_page = url.searchParams.get("is_subscription_orders_page");

        this.state = {
            taxStatus: settings ? settings.tax_status : 0,
            status: '',
            start_date: '',
            last_order_date: '',
            next_payment_date: '',
            end_date: '',
            subscription: [],
            items: [],
            billing_address: [],
            shipping_address: [],
            related_order: [],
            subtotal: 0,
            tax_amount: 0,
            display_subtotal: 0,
            shipping_charge: 0,
            display_shipping_charge: 0,
            shipping_method: '',
            payment_method: '',
            total: 0,
            display_total: 0,
            subscription_type: '',
            duration: '',
            billing_interval: '',
            subscription_id: parseInt(this.props.match.params.subscription_id),
            error_meg: '',
            loading: true,
            is_subscription_orders_page: is_subscription_orders_page,
            subs_item_add_success_msg: '',
            success_alert_wrapper_show: false
        }
        document.title = "Related Subscription -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView() // Scroll to Top
        this.getDetails();
        this.timeOut(5000);
    }

    getDetails = () => {
        let gd_data = {};
        if (parseInt(this.state.is_subscription_orders_page) === 1) {
            gd_data = {
                subscription_id: this.state.subscription_id,
                is_subscription_orders_page: 1
            }
        } else {
            gd_data = {
                subscription_id: this.state.subscription_id
            }
        }
        AJAX_REQUEST("POST", "subscription/getDetails", gd_data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                this.setState({
                    status: data.status,
                    start_date: data.start_date,
                    last_order_date: data.last_order_date,
                    next_payment_date: data.next_payment_date,
                    end_date: data.end_date,
                    subscription: data.subscription,
                    items: data.subscription.items,
                    subtotal: data.subscription.subtotal,
                    tax_amount: data.subscription.tax_amount,
                    display_subtotal: data.subscription.display_subtotal,
                    shipping_charge: data.subscription.shipping_charge,
                    display_shipping_charge: data.subscription.display_shipping_charge,
                    shipping_method: data.subscription.shipping_method,
                    payment_method: data.subscription.payment_method,
                    total: data.subscription.total,
                    display_total: data.subscription.display_total,
                    subscription_type: data.subscription.subscription_type,
                    duration: data.subscription.duration,
                    billing_interval: data.subscription.billing_interval,
                    billing_address: data.billing_address,
                    shipping_address: data.shipping_address,
                    related_order: data.related_order,
                    subscription_id: this.props.match.params.subscription_id,
                    loading: false,
                    is_subscription_orders_page: this.state.is_subscription_orders_page,
                    subs_item_add_success_msg: data.success_message ? data.success_message : '',
                });
            } else if (parseInt(results.response.code) === 4000 || parseInt(results.response.code) === 4004) {
                history.push('/my-account/subscriptions');
            } else {
                this.setState({
                    error_meg: results.response.message,
                    loading: false,
                });
            }
        });
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                is_subscription_orders_page: ''
            });
        }.bind(this), timedata);
    }

    removeSubscriptionItem = (itemId) => {
        if (window.confirm('Are you sure you want remove this item from your subscription?')) {
            document.querySelector("body").scrollIntoView() // Scroll to Top
            let data = {
                subscription_id: this.state.subscription_id,
                subscription_item_id: itemId
            }
            this.setState({
                error_meg: '',
                success_alert_wrapper_show: false
            });
            AJAX_REQUEST("POST", "subscription/removedItem", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    this.setState({
                        error_meg: results.response.message,
                        loading: false,
                        success_alert_wrapper_show: true,
                        is_subscription_orders_page: '',
                    });
                    this.getDetails();
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

    openChangeDate = (e) => {
        $('.subscription_end_date_edit').hide();
        $('.subscription_end_date_edit_calender').show();

        $('.datepicker').daterangepicker({
            autoUpdateInput: false,
            singleDatePicker: true,
            showDropdowns: true,
            startDate: moment(this.state.next_payment_date, "MMMM DD, YYYY").format('YYYY-MM-DD'),
            minDate: moment(),
            locale: {
                format: 'YYYY-MM-DD'
            }
        });

        $('.datepicker').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
        });
      
        $('.datepicker').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val(moment(this.state.next_payment_date, "MMMM DD, YYYY").format('YYYY-MM-DD'));
        });
    }

    closeChangeDate = (e) => {
        $('.subscription_end_date_edit').show();
        $('.subscription_end_date_edit_calender').hide();
        $('.datepicker').val(moment(this.state.next_payment_date, "MMMM DD, YYYY").format('YYYY-MM-DD'));
    }

    saveChange = (e) => {
        e.preventDefault();
        $('.subscription_end_date_edit').show();
        $('.subscription_end_date_edit_calender').hide();

        const next_payment_date = $('#the_date').val();
        const data = { next_payment_date: next_payment_date, subscription_id: this.state.subscription_id }

        AJAX_REQUEST("POST", "subscription/changePaymentDate", data).then(results => {
            const response = results.response;
            if (parseInt(results.response.code) === 1000) {
                const new_dated = results.response.data.next_payment_date;
                this.setState({
                    next_payment_date:new_dated
                })
                $('#show_new_date').text(new_dated);
            }
        });
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    changeAddress = (e) => {
        e.preventDefault();
        history.push(`/my-account/edit-address/shipping/${this.state.subscription_id}`);
    }

    render() {
        const user = this.props.user;
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <div className="MyAccount-content">
                            {
                                parseInt(this.state.is_subscription_orders_page) === 1 ?
                                    <AlertWrapperSuccess errors_data={this.state.subs_item_add_success_msg} success_alert_wrapper_show={true} />
                                    :
                                    null
                            }
                            <AlertWrapperSuccess errors_data={this.state.error_meg} success_alert_wrapper_show={this.state.success_alert_wrapper_show} />
                            <h2 className=" montserrat page-title">Subscription #{this.state.subscription_id}</h2>
                            <table className="shop_table my_account_orders customer_subscriotion_view">
                                <tbody>

                                    <tr>
                                        <td className="td_width">Status</td>
                                        <td className="toTitleCase">{this.state.status}</td>
                                    </tr>
                                    <tr>
                                        <td className="td_width">Start Date</td>
                                        <td>{this.state.start_date}</td>
                                    </tr>
                                    <tr>
                                        <td className="td_width">Last Order Date</td>
                                        <td>{this.state.last_order_date}</td>
                                    </tr>
                                    {
                                        ((this.state.status === "Cancelled") || (this.state.status === "Failed")) ?
                                            <tr>
                                                <td className="td_width">Canceled/End Date</td>
                                                <td>{this.state.end_date}</td>
                                            </tr>
                                            :
                                            <Fragment>
                                                <tr>
                                                    <td className="td_width">Next Payment Date</td>
                                                    <td>
                                                        <span id="show_new_date">{this.state.next_payment_date}</span>
                                                        <div className="subscription_end_date_edit">
                                                            <a onClick={this.openChangeDate} className="roboto_condensed wc-forward edit_toggle">Change Payment Date</a>
                                                        </div>
                                                        <div className="subscription_end_date_edit_calender">
                                                            <input onChange={this.changeHandler} className="cus_field datepicker" id="the_date" type="text" name="" value={moment(this.state.next_payment_date, "MMMM DD, YYYY").format('YYYY-MM-DD')} />
                                                            <a onClick={this.saveChange} className="roboto_condensed wc-forward">Save Change</a>
                                                            <a onClick={this.closeChangeDate} className="roboto_condensed wc-forward subscription_end_date_cancel">Cancel</a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="td_width">Actions</td>
                                                    <td className="order-actions">
                                                        <NavLink className="roboto_condensed wc-forward" to={`/my-account/subscription-cancellation/${this.state.subscription_id}`}>Cancel</NavLink>
                                                        <NavLink className="roboto_condensed wc-forward" to={`/my-account/change-subscription-address/${this.state.subscription_id}`}>Change Address</NavLink>
                                                        {
                                                            (this.state.subscription_type == 'supplement') ?
                                                                <NavLink className="roboto_condensed wc-forward" to={`/subscription-item/${this.state.subscription_id}`}>Add Item</NavLink>
                                                                :
                                                                <NavLink className="roboto_condensed wc-forward" to={`/meals?subscription_id=${this.state.subscription_id}`}>Change Meal Item</NavLink>
                                                        }
                                                    </td>
                                                </tr>
                                            </Fragment>
                                    }
                                </tbody>
                            </table>

                            <section className="woocommerce-order-details">
                                <h2 className=" montserrat page-title">SUBSCRIPTION TOTALS</h2>
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
                                                                <td title="Delete" className="product_name"><a data-item={item.hasOwnProperty('item_id') ? item.item_id : ''} className="remove"><i className="fa fa-times" aria-hidden="true"></i></a> </td>
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
                                                                        (this.state.subscription_type == 'meal') ? '' :
                                                                            <a data-item={item.hasOwnProperty('item_id') ? item.item_id : ''} onClick={() => this.removeSubscriptionItem(item.item_id)} className="remove"><i className="fa fa-times" aria-hidden="true"></i></a>
                                                                    }

                                                                </td>
                                                                <td className="product_name">
                                                                    {item.hasOwnProperty('name') ? item.name : ''}
                                                                    <strong className="product-quantity">&nbsp;× {item.hasOwnProperty('quantity') ? item.quantity : ''}</strong>
                                                                </td>
                                                                <td>
                                                                    <span>{item.hasOwnProperty('total_price') ? CURRENCY_FORMAT(item.total_price) : ''}</span> / {item.billing_interval} {item.duration}
                                                                </td>
                                                            </tr>
                                                        )
                                                    }

                                                }.bind(this))
                                        }
                                        <tr>
                                            <td colSpan="2">Subtotal:</td>
                                            <td><span><strong>{CURRENCY_FORMAT(this.state.display_subtotal)}</strong></span></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Shipping:</td>
                                            <td><span>{CURRENCY_FORMAT(this.state.display_shipping_charge)}</span><small className="shipped_via">&nbsp; {this.state.shipping_method}</small></td>
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
                                            <td><span><strong>{CURRENCY_FORMAT(this.state.display_total)}</strong></span>  / {this.state.billing_interval} {this.state.duration}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            <div className="related_subscription">
                                <div className="woocommerce-order-details">
                                    <h2 className=" montserrat page-title">RELATED ORDERS</h2>
                                    <table className="my_account_orders shop_table_responsive">
                                        <thead>
                                            <tr>
                                                <th className="order-number"><span className="nobr /">Order</span></th>
                                                <th className="order-date"><span className="nobr /">Date</span></th>
                                                <th className="order-status"><span className="nobr /">Status</span></th>
                                                <th className="order-total"><span className="nobr /">Total</span></th>
                                                <th className="order-actions">&nbsp;</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.related_order.length <= 0 ? <tr><td className="text-center" colSpan="5">{this.state.error_meg}</td></tr> :
                                                    this.state.related_order.map(function (order, key) {
                                                        return (
                                                            <RelatedOrders
                                                                key={key}
                                                                order={order}
                                                            />
                                                        )
                                                    }.bind(this))
                                            }
                                        </tbody>
                                    </table>
                                </div>
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
                                            <p><i className="fa fa-envelope-o" aria-hidden="true"></i> {this.state.billing_address.hasOwnProperty('email') ? this.state.billing_address.email : ''}</p>
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

export default RelatedSubscription;