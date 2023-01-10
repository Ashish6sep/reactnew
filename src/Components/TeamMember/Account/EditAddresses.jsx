import React, { Fragment, PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import {AJAX_REQUEST, CURRENCY_FORMAT} from "../../../Constants/AppConstants";

class EditAddresses extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            loading: true,
            error_meg:'', 
            billingAddress: "",
            shippingAddress: "",
            billingAddressFound: false,
            shippingAddressFound: false,
            billingAddressMsg: '',
            shippingAddressMsg: '',
        }
        document.title = "Edit Address -Prestige Labs";
    }
    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getBillingAddress();
        this.getShippingAddress();
    }

    getBillingAddress = () => {
        AJAX_REQUEST("POST", "user/billingDetails", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    loading: false,
                    billingAddressFound: true,
                    billingAddressMsg:results.response.message,
                    billingAddress: results.response.data
                });		
            } else {
                this.setState({
                    loading: false,
                    billingAddressFound: false,
                    billingAddressMsg:results.response.message,
                    error_meg:results.response.message,
                })
            }            
        });
    }

    getShippingAddress = () => {
        AJAX_REQUEST("POST", "user/shippingDetails", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    loading: false,
                    shippingAddressFound: true,
                    shippingAddressMsg:results.response.message,
                    shippingAddress: results.response.data
                });		
            } else {
                this.setState({
                    loading: false,
                    shippingAddressFound: false,
                    shippingAddressMsg:results.response.message,
                    error_meg:results.response.message,
                })
            }            
        });
    }

    render() { 
        return ( 
            <Fragment>
                <div className="woocommerce-MyAccount-content inner_content">
                    {
                        (this.state.loading)? 
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <p className="cutomer_address_messages"> The following addresses will be used on the checkout page by default. </p>
                            <div className="">
                                        <div className="MyAccount-content">  
                                            <div className="related_subscription">
                                                <section className="customer_address">
                                                    <div className="pull-left billing_address_container">
                                                        <h2 className="montserrat checkout_title customer_edit_address">Billing Address 
                                                            <NavLink className="pull-right edit customer_address_edit_icon" to="/my-account/edit-addresses/billing"><i className="fa fa-pencil" aria-hidden="true"></i></NavLink>
                                                        </h2>
                                                        {
                                                        (!this.state.billingAddressFound)?
                                                            <address className="shipping-address">
                                                                <p>{this.state.billingAddressMsg}</p>
                                                            </address>
                                                        :
                                                        <Fragment>
                                                        <address className="shipping-address">
                                                            <p>
                                                                { this.state.billingAddress.hasOwnProperty('billing_first_name')? this.state.billingAddress.billing_first_name: "" } { this.state.billingAddress.hasOwnProperty('billing_last_name')? this.state.billingAddress.billing_last_name: "" } <br/>
                                                                { this.state.billingAddress.hasOwnProperty('billing_company_name')? this.state.billingAddress.billing_company_name: "" } &nbsp;
                                                                { this.state.billingAddress.hasOwnProperty('billing_address_1')? this.state.billingAddress.billing_address_1: "" } &nbsp; 
                                                                { this.state.billingAddress.hasOwnProperty('billing_address_2')? this.state.billingAddress.billing_address_2: "" } &nbsp; 
                                                                { this.state.billingAddress.hasOwnProperty('billing_city')? this.state.billingAddress.billing_city: "" } &nbsp; 
                                                                { this.state.billingAddress.hasOwnProperty('billing_state')? this.state.billingAddress.billing_state: "" } &nbsp; 
                                                                { this.state.billingAddress.hasOwnProperty('billing_postcode')? this.state.billingAddress.billing_postcode: "" } &nbsp; 
                                                                { this.state.billingAddress.hasOwnProperty('billing_country')? this.state.billingAddress.billing_country: "" } <br/> 
                                                                { this.state.billingAddress.hasOwnProperty('billing_phone')? this.state.billingAddress.billing_phone: "" } <br/>
                                                                { this.state.billingAddress.hasOwnProperty('billing_email')? this.state.billingAddress.billing_email: "" }
                                                            </p>
                                                        </address>
                                                        </Fragment>
                                                        }
                                                    </div>
                                                    <div className="pull-right billing_address_container">
                                                        <h2 className="montserrat checkout_title customer_edit_address">Shipping Address 
                                                            <NavLink className="pull-right edit customer_address_edit_icon" to="/my-account/edit-addresses/shipping"><i className="fa fa-pencil" aria-hidden="true"></i></NavLink>
                                                        </h2>
                                                        {
                                                        (!this.state.shippingAddressFound)?
                                                            <address className="shipping-address">
                                                                <p>{this.state.shippingAddressMsg}</p>
                                                            </address>
                                                        :
                                                        <Fragment>
                                                        <address className="shipping-address">
                                                            <p>
                                                                { this.state.shippingAddress.hasOwnProperty('shipping_first_name')? this.state.shippingAddress.shipping_first_name: "" } { this.state.shippingAddress.hasOwnProperty('shipping_last_name')? this.state.shippingAddress.shipping_last_name: "" }<br/>
                                                                { this.state.shippingAddress.hasOwnProperty('shipping_company_name')? this.state.shippingAddress.shipping_company_name: "" } &nbsp;
                                                                { this.state.shippingAddress.hasOwnProperty('shipping_address_1')? this.state.shippingAddress.shipping_address_1: "" } &nbsp; 
                                                                { this.state.shippingAddress.hasOwnProperty('shipping_address_2')? this.state.shippingAddress.shipping_address_2: "" } &nbsp; 
                                                                { this.state.shippingAddress.hasOwnProperty('shipping_city')? this.state.shippingAddress.shipping_city: "" } &nbsp; 
                                                                { this.state.shippingAddress.hasOwnProperty('shipping_state')? this.state.shippingAddress.shipping_state: "" } &nbsp; 
                                                                { this.state.shippingAddress.hasOwnProperty('shipping_postcode')? this.state.shippingAddress.shipping_postcode: "" } &nbsp; 
                                                                { this.state.shippingAddress.hasOwnProperty('shipping_country')? this.state.shippingAddress.shipping_country: "" } &nbsp; 
                                                            </p>
                                                        </address>
                                                        </Fragment>
                                                        }
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </section>
                                            </div>   
                                        </div>
                            </div>
                        </Fragment>
                    }
                    <div className="woocommerce-notices-wrapper"></div>
                </div>
            </Fragment>
         );
    }
}
 
export default EditAddresses;