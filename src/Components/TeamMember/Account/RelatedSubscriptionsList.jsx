import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { CURRENCY_FORMAT } from '../../../Constants/AppConstants';

class RelatedSubscriptionsList extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <Fragment>
                <tr className="order">
                    <td data-title="Subscription"><NavLink to={`/my-account/subscription-order-view/${this.props.subscription.hasOwnProperty('subscription_id') ? this.props.subscription.subscription_id : ''} `}>{'#'}{this.props.subscription.hasOwnProperty('subscription_id') ? this.props.subscription.subscription_id : ''}</NavLink> </td>
                    <td data-title="Status"> <span className="note toTitleCase">{this.props.subscription.hasOwnProperty('status') ? this.props.subscription.status : ''}</span> </td>
                    <td data-title="Next Payment"><span className="note">{this.props.subscription.hasOwnProperty('next_payment_date') ? this.props.subscription.next_payment_date : ''}</span></td>
                    <td data-title="Total"><span className="note">{this.props.subscription.hasOwnProperty('total') ? CURRENCY_FORMAT(this.props.subscription.total) : ''} / {this.props.subscription.hasOwnProperty('duration') ? this.props.subscription.duration : ''}</span> </td>
                    <td data-title="">
                        <NavLink className="wc-forward" to={`/my-account/subscription-order-view/${this.props.subscription.hasOwnProperty('subscription_id') ? this.props.subscription.subscription_id : ''} `}>View</NavLink>
                    </td>
                </tr>
            </Fragment>
        );
    }
}

export default RelatedSubscriptionsList;