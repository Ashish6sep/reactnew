import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT, GET_STORAGE } from "../../../Constants/AppConstants";
import history from '../../../history';
import daterangepicker from 'daterangepicker';
import $ from 'jquery';
import RelatedOrders from './RelatedOrders';
import moment from "moment";
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';

class SubscriptionCancellation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            subscription_id: parseInt(this.props.match.params.subscription_id),
            showCancellation: false,
        }
        document.title = "Subscription Cancellation -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView() // Scroll to Top
        // document.getElementById("pageTitle").innerHTML = "SUBSCRIPTION #" + this.state.subscription_id;
        this.setState({ loading: false })
    }

    showCancellation = (e) => {
        this.setState({ showCancellation: true });
    }

    render() {

        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <div className="MyAccount-content">
                            <section className="woocommerce-order-details">
                                <h2 className=" montserrat page-title">SUBSCRIPTION CANCELLATION</h2>
                                {
                                    (this.state.showCancellation) ?
                                        <Fragment>
                                            <p>
                                                Do you want to change your shipping address, push out your next delivery, or change your billing information?
                                                We can help with that by clicking the corresponding button below.
                                            </p>
                                            <div className="subscription_sub_cancellation">
                                                <NavLink to={`/my-account/change-subscription-address/${this.state.subscription_id}`} className="roboto_condensed wc-forward">UPDATE SHIPPING ADDRESS</NavLink>
                                                <NavLink to={`/my-account/subscription-cancellation/${this.state.subscription_id}/billing-update`} className="roboto_condensed wc-forward">CHANGE PAYMENT DATE</NavLink>
                                                <NavLink to={`/my-account/my-cards`} className="roboto_condensed wc-forward">UPDATE PAYMENT INFORMATION</NavLink>
                                                <NavLink to={`/my-account/subscription-cancellation/${this.state.subscription_id}/cancellation`} className="roboto_condensed wc-forward">CONTINUE TO CANCEL</NavLink>
                                            </div>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <p>
                                                Would you like to change the products you are receiving (the flavors and/or adding/subtracting items)?
                                                We can help with that by clicking either button below.
                                            </p>
                                            <div className="subscription_sub_cancellation">
                                                <NavLink to={`/my-account/subscription-cancellation/${this.state.subscription_id}/details`} className="roboto_condensed wc-forward">Change Product</NavLink>
                                                <button onClick={() => this.showCancellation()} className="roboto_condensed cus_button">CONTINUE TO CANCEL</button>
                                            </div>
                                        </Fragment>
                                }
                            </section>
                        </div>
                }
            </Fragment>
        );
    }
}

export default SubscriptionCancellation;