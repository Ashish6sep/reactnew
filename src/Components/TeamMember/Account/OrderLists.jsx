import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";

class OrderLists extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {

        return (
            <Fragment>
                <tr className="order">
                    <td className="order-number" data-title="Order">
                        <NavLink to={`/my-account/view-order/${this.props.order.hasOwnProperty('order_id') ? this.props.order.order_id : ''} `}> {'#'}
                            {this.props.order.hasOwnProperty('order_id') ? this.props.order.order_id : ''}
                        </NavLink>
                    </td>
                    <td className="order-date" data-title="Date">
                        <time dateTime="2018-12-14T02:41:13+00:00">
                            {this.props.order.hasOwnProperty('date') ? this.props.order.date : ''}
                        </time>
                    </td>
                    <td className="order-status toTitleCase" data-title="Status">
                        {this.props.order.hasOwnProperty('status') ? this.props.order.status : ''}
                    </td>
                    <td className="order-status toTitleCase" data-title="Order Type">
                        {(this.props.order.order_type == 'supplement') ? "Product" : "Meal"}
                    </td>
                    <td className="order-status toTitleCase text-center" data-title="Order Type">
                        {this.props.order.is_affiliate_sale}
                    </td>
                    <td className="order-total" data-title="Total">
                        <span>
                            {this.props.order.hasOwnProperty('total') ? CURRENCY_FORMAT(this.props.order.total) : ''} &nbsp;
                        </span>
                        {this.props.order.hasOwnProperty('items') ? this.props.order.items : ''}                                                  </td>
                    <td className="order-actions" data-title="&nbsp;">
                        <NavLink className="roboto_condensed wc-forward" to={`/my-account/view-order/${this.props.order.hasOwnProperty('order_id') ? this.props.order.order_id : ''} `}>View</NavLink>
                    </td>
                </tr>
            </Fragment>
        );
    }
}

export default OrderLists;