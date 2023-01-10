
import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import { CURRENCY_FORMAT } from '../../../Constants/AppConstants';

class ActiveSubscriptionList extends Component {
    state = {}
    render() {
        return (<Fragment>
            <tr className="order">
                <td className="order-number" data-title="Subscription ID">
                    <NavLink className="montserrat" to={`/my-account/subscription-order-view/${this.props.subscription.subscription_id}`}>
                        {'#'}{this.props.subscription.hasOwnProperty('subscription_id') ? this.props.subscription.subscription_id : ''}
                    </NavLink>
                </td>
                <td className="order-date text-right" data-title="Subscription Total">
                    {this.props.subscription.hasOwnProperty('subscription_total') ? CURRENCY_FORMAT(this.props.subscription.subscription_total) : ''}
                </td>
                <td className="order-status" data-title="Start Date">
                    {this.props.subscription.hasOwnProperty('start_date') ? this.props.subscription.start_date : ''}
                </td>
                <td className="order-representative" data-title="Next Payment">
                    {this.props.subscription.hasOwnProperty('next_payment') ? this.props.subscription.next_payment : ''}
                </td>
                <td className="order-total" data-title="Customer">{this.props.subscription.hasOwnProperty('customer') ? this.props.subscription.customer : ''}   </td>
            </tr>
        </Fragment>);
    }
}

export default ActiveSubscriptionList;