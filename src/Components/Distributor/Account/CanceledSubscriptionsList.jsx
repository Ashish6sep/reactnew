import React, { Component, Fragment } from 'react';
import { NavLink} from "react-router-dom";

class CanceledSubscriptionsList extends Component {
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
                    <span className="subscription_order_id"><NavLink to={`/my-account/subscription-order-view/${this.props.subscription.hasOwnProperty('subscription_id') ? this.props.subscription.subscription_id: ''} `}> {'#'}{this.props.subscription.hasOwnProperty('subscription_id') ? this.props.subscription.subscription_id: ''} </NavLink></span>
                    </td>
                    <td className="order-date" data-title="Start Date">
                        <time dateTime="2018-12-14T02:41:13+00:00">{this.props.subscription.hasOwnProperty('start_date') ? this.props.subscription.start_date: ''}</time>
                    </td>
                    <td className="order-status" data-title="Cancel Date">
                        <time dateTime="2018-12-14T02:41:13+00:00">{this.props.subscription.hasOwnProperty('cancel_date') ? this.props.subscription.cancel_date: ''}</time>
                    </td>
                    <td className="order-representative" data-title="Team Member">
                        {this.props.subscription.hasOwnProperty('team_member') ? this.props.subscription.team_member: ''}
                    </td>
                    <td className="order-total" data-title="Reason">                       
                        {this.props.subscription.hasOwnProperty('canceled_by') ? this.props.subscription.canceled_by: ''}                        
                    </td>
                </tr>
            </Fragment> 
        );
    }
}
 
export default CanceledSubscriptionsList;