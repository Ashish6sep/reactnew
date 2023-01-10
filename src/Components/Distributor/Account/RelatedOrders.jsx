import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { CURRENCY_FORMAT } from "../../../Constants/AppConstants";

class RelatedOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <Fragment>
                <tr className="order">
                    <td data-title="Order"><NavLink to={`/my-account/view-order/${this.props.order.hasOwnProperty('order_id') ? this.props.order.order_id : ''} `}> {'#'}{this.props.order.hasOwnProperty('order_id') ? this.props.order.order_id : ''}</NavLink> </td>
                    <td data-title="Date"><span className="note">{this.props.order.hasOwnProperty('order_date') ? this.props.order.order_date : ''}</span></td>
                    <td data-title="Status"> <span className="note toTitleCase">{this.props.order.hasOwnProperty('status') ? this.props.order.status : ''}</span> </td>
                    <td data-title="Total"><span>{this.props.order.hasOwnProperty('display_total') ? CURRENCY_FORMAT(this.props.order.display_total) : ''} {this.props.order.hasOwnProperty('item') ? this.props.order.item : ''}</span></td>
                    <td >
                        <NavLink className="roboto_condensed wc-forward" to={`/my-account/view-order/${this.props.order.hasOwnProperty('order_id') ? this.props.order.order_id : ''} `}>View</NavLink>
                    </td>
                </tr>
            </Fragment>
        );
    }
}

export default RelatedOrders;