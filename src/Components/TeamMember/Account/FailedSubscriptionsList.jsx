import React, { Component, Fragment } from 'react';
import { NavLink} from "react-router-dom";

class FailedSubscriptionsList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
    }
    render() { 
        return ( 
            <Fragment>
                <tr className="order">
                    <td className="order-number" data-title="Subscription">
                        <NavLink to={`/my-account/subscription-order-view/${this.props.subscription.hasOwnProperty('subscription_id') ? this.props.subscription.subscription_id: ''} `}> {'#'}{this.props.subscription.hasOwnProperty('subscription_id') ? this.props.subscription.subscription_id: ''} </NavLink>
                    </td>
                    <td className="order-date" data-title="Start Date">
                        <time dateTime="2018-12-14T02:41:13+00:00">{this.props.subscription.hasOwnProperty('start_date') ? this.props.subscription.start_date: ''}</time>
                    </td>
                    <td className="order-status" data-title="Cancel Date">
                        <time dateTime="2018-12-14T02:41:13+00:00">{this.props.subscription.hasOwnProperty('failed_date') ? this.props.subscription.failed_date: ''}</time>
                    </td>
                    <td className="order-total" data-title="Reason">
                        <p>
                            {this.props.subscription.hasOwnProperty('reason') ? this.props.subscription.reason: ''}
                        </p>
                    </td>
                </tr>
            </Fragment> 
        );
    }
}
 
export default FailedSubscriptionsList;