import React, { Fragment, PureComponent } from 'react';
import { AJAX_REQUEST, CURRENCY_FORMAT, SET_STORAGE, GET_STORAGE, REMOVE_STORAGE } from "../../Constants/AppConstants";
import { NavLink } from 'react-router-dom';
import $ from "jquery";
import history from "../../history";
import SubscriptionCartProductList from './SubscriptionCartProductList';
import AlertWrapperSuccess from '../Common/AlertWrapperSuccess';

class SubscriptionCart extends PureComponent {
    constructor(props) {
        super(props)
        // Check Tax
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }
        this.state = {
            taxStatus: settings ? settings.tax_status : 0,
            products: [],
            currentItems: [],
            shipping_method: "",
            shipping_charge: 0,
            address_1: "",
            postcode: "",
            city: "",
            state: "",
            country: "",
            loading: true,
            saving: false,
            isLoading: false,
            success_alert_wrapper_show: false,
        }
        document.title = "Subscription Cart-Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getSubscriptionProducts();
    }

    getSubscriptionProducts = () => {
        let cart_items = [];
        let newSubsItems = [];
        let currentSubsItems = [];

        if (GET_STORAGE('subscriptionItem')) {
            newSubsItems = JSON.parse(GET_STORAGE('subscriptionItem'))

            if (newSubsItems.length < 0 || newSubsItems == '') {
                history.push("/subscription-item/" + this.props.match.params.id);
            }

            newSubsItems.forEach(function (item, key) {
                let newItem = {
                    cart_product_id: item.subs_product_id,
                    cart_product_name: item.subs_product_name,
                    cart_image: item.subs_image,
                    cart_variation_id: item.subs_variation_id,
                    cart_variation_name: item.subs_variation_name,
                    cart_sale_price: 0,
                    subscription: "yes",
                    cart_subscription_msg: item.subs_subscription_msg,
                    cart_discount_price: item.subs_discount_price,
                    quantity: item.quantity,
                }
                cart_items.push(newItem);
            });
        }

        // Get existing order details
        const data = { subscription_id: this.props.match.params.id }
        AJAX_REQUEST("POST", "subscription/getDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                currentSubsItems = results.response.data.subscription.items;
                let shipping_address = results.response.data.shipping_address;

                currentSubsItems.forEach(function (item, key) {
                    let newItem = {
                        cart_product_id: item.product_id,
                        cart_product_name: item.name,
                        cart_image: item.product_thumbnail,
                        cart_variation_id: item.variation_id,
                        cart_variation_name: "",
                        cart_sale_price: 0,
                        subscription: "yes",
                        cart_subscription_msg: "",
                        cart_discount_price: item.total_price,
                        quantity: item.quantity,
                    }
                    cart_items.push(newItem);
                });

                this.setState({
                    cart_items: cart_items,
                    products: newSubsItems,
                    currentItems: currentSubsItems,

                    shipping_charge: results.response.data.subscription.shipping_charge,
                    shipping_method: results.response.data.subscription.shipping_method,
                    shipping_cost: results.response.data.subscription.shipping_charge,

                    address_1: shipping_address.street_address,
                    postcode: shipping_address.zip,
                    city: shipping_address.city,
                    state: shipping_address.state,
                    country: shipping_address.country,

                    loading: false
                });
                this.getTax();
            }
        });
    }

    // Get and calculate tax if applicable
    getTax = () => {

        this.setState({
            subscription_tax_amount: 0,
            subscription_tax_info: '',
        })

        if (this.state.taxStatus == 1) {
            let taxData = {
                address_1: this.state.address_1,
                postcode: this.state.postcode,
                city: this.state.city,
                state: this.state.state,
                country: this.state.country,
                shipping_cost: this.state.shipping_cost,
                cart_items: this.state.cart_items
            }
            AJAX_REQUEST("POST", "order/getTax", taxData).then(results => {
                if (parseInt(results.response.code) === 1000 && results.response.data != '') {
                    this.setState({
                        subscription_tax_amount: results.response.data.subscription_tax_amount,
                        subscription_tax_info: results.response.data.subscription_tax_info,
                    });
                }
            });
        }
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this), timedata);
    }

    deleteItem = (e, row_id) => {
        e.preventDefault();
        if (window.confirm("Are you sure want to delete item?")) {
            let subscriptionItem = JSON.parse(GET_STORAGE('subscriptionItem'));
            if (subscriptionItem.splice(row_id, 1)) {
                SET_STORAGE("subscriptionItem", JSON.stringify(subscriptionItem));
                this.getSubscriptionProducts();
                document.querySelector("body").scrollIntoView();
                this.setState({ success_alert_wrapper_show: true });
                this.timeOut(5000);
            }
        }
    }

    onSubmitHandler = (e) => {
        e.preventDefault();

        // Create new items array
        let items = [];
        JSON.parse(GET_STORAGE('subscriptionItem')).forEach(function (item, key) {
            let newItem = {
                product_id: item.subs_product_id,
                variation_id: item.subs_variation_id,
            }
            items.push(newItem);
        });

        let data = {
            subscription_id: this.props.match.params.id,
            subscription_items: items,
            subscription_tax_amount: this.state.subscription_tax_amount,
            subscription_tax_info: this.state.subscription_tax_info,
        }
        this.setState({ isLoading: true, saving: true, });
        AJAX_REQUEST("POST", "subscription/addItem", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                REMOVE_STORAGE("subscriptionItem");
                this.setState({
                    isLoading: false,
                    saving: false,
                });
                history.push("/my-account/subscription-order-view/" + this.props.match.params.id + "?is_subscription_orders_page=1");
            } else {
                this.setState({
                    isLoading: false,
                    saving: false,
                });
            }
        });

    }

    render() {

        let subTotal = 0;

        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading container full_page_loader"></div>
                        :
                        <Fragment>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <AlertWrapperSuccess errors_data="Subscription item removed successfully" success_alert_wrapper_show={this.state.success_alert_wrapper_show} />
                                        <main>
                                            <form onSubmit={this.onSubmitHandler} id="cartForm">
                                                <div className="page-title">NEWLY ADDED ITEM(S)</div>
                                                <div className="cart_wrapper">
                                                    <div className="table-responsive">
                                                        <table className="table cart_table my_account_orders distributor_cart_table shop_table_responsive">
                                                            <colgroup>
                                                                <col width="5%" />
                                                                <col width="65%" />
                                                                <col width="25%" />
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <th>&nbsp;</th>
                                                                    <th>Product</th>
                                                                    <th>Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {/* Start subscription list*/}
                                                                {
                                                                    (this.state.products.length <= 0) ? null :
                                                                        this.state.products.map(function (product, key) {
                                                                            subTotal = Number(subTotal) + Number(product.subs_discount_price);
                                                                            // Added item delete methos
                                                                            product.deleteItem = this.deleteItem;
                                                                            product.row_id = key;

                                                                            return (
                                                                                <SubscriptionCartProductList key={key} product={product} />
                                                                            )
                                                                        }.bind(this))
                                                                }
                                                                {/* End subscription list */}

                                                            </tbody>
                                                        </table>


                                                        <div className="page-title">CURRENT SUBSCRIPTION ITEM(S)</div>
                                                        <table className="table cart_table my_account_orders distributor_cart_table shop_table_responsive">
                                                            <colgroup>
                                                                <col width="5%" />
                                                                <col width="65%" />
                                                                <col width="25%" />
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <th>&nbsp;</th>
                                                                    <th>Product</th>
                                                                    <th>Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {/* Start current subscription list*/}
                                                                {
                                                                    (this.state.currentItems.length <= 0) ? null :
                                                                        this.state.currentItems.map(function (product, key) {

                                                                            subTotal = Number(subTotal) + Number(product.total_price);

                                                                            product.subs_product_name = product.name;
                                                                            product.subs_discount_price = product.total_price;
                                                                            product.subs_image = product.product_thumbnail;

                                                                            return (
                                                                                <SubscriptionCartProductList key={key} deleteItem="false" product={product} />
                                                                            )
                                                                        }.bind(this))
                                                                }
                                                                {/* End current subscription list */}

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="clearfix"></div>

                                                    <div className="cart-collaterals">
                                                        <h2 className="inner_title">SUBSCRIPTION TOTALS</h2>
                                                        <div className="cart_totals">
                                                            <table cellSpacing="0" className="shop_table shop_table_responsive">
                                                                <tbody>
                                                                    <tr className="cart-subtotal">
                                                                        <td className="no_display_mobile">Subtotal</td>
                                                                        <td data-title="Subtotal">
                                                                            <span className="woocommerce-Price-amount amount">
                                                                                <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(subTotal)} </span>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="cart-subtotal">
                                                                        <td className="no_display_mobile">SHIPPING COST</td>
                                                                        <td data-title="SHIPPING COST">
                                                                            <span className="woocommerce-Price-amount amount">
                                                                                <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(this.state.shipping_charge)} <small className="shipped_via">via {this.state.shipping_method}</small></span>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                    {
                                                                        (this.state.taxStatus == 1) ?
                                                                            <Fragment>
                                                                                <tr className="cart-subtotal">
                                                                                    <td className="no_display_mobile">Tax</td>
                                                                                    <td data-title="Tax">
                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                            <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(this.state.subscription_tax_amount)} </span>
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            </Fragment>
                                                                            : null
                                                                    }
                                                                    <tr className="sub-order-total">
                                                                        <td className="no_display_mobile">Total</td>
                                                                        <td data-title="Total" className="sub-order-total-usd">
                                                                            <strong>
                                                                                <span className="woocommerce-Price-amount amount">
                                                                                    <span className="woocommerce-Price-currencySymbol">
                                                                                        {
                                                                                            CURRENCY_FORMAT(Number(subTotal) + Number(this.state.shipping_charge) + Number(this.state.subscription_tax_amount))
                                                                                        }
                                                                                    </span>
                                                                                </span>
                                                                            </strong>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div className="wc-proceed-to-checkout subscription-checkout">
                                                                <button disabled={this.state.isLoading} className="button cus_button">{this.state.saving ? "Please Wait..." : "Confirm and Proceed"}</button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                        </main>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default SubscriptionCart;