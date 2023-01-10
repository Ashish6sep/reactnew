import React, { Component, Fragment } from 'react';
import { CURRENCY_FORMAT } from "../../../Constants/AppConstants";

class Subscriptions extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    removeSubscription = (event) => {
        if (this.props.removeSubscItem !== '') {
            const theItemId = event.currentTarget.dataset.item;
            if (window.confirm('Are you sure you want remove this item from your subscription?')) this.props.removeSubscItem(theItemId);
        }
    }

    render() {
        return (

            <Fragment>
                <tr>
                    <td className="product_name">
                        {
                            (this.props.subscriptionType == 'meal') ? '' :
                                <a title="Delete" data-item={this.props.item.hasOwnProperty('item_id') ? this.props.item.item_id : ''} onClick={this.removeSubscription} className="remove"><i className="fa fa-times" aria-hidden="true"></i></a>
                        }
                    </td>
                    <td className="product_name">
                        {this.props.item.hasOwnProperty('name') ? this.props.item.name : ''}
                        <strong className="product-quantity">&nbsp;× {this.props.item.hasOwnProperty('quantity') ? this.props.item.quantity : ''}</strong>
                    </td>
                    <td>
                        <span>{this.props.item.hasOwnProperty('total_price') ? CURRENCY_FORMAT(this.props.item.total_price) : ''}</span> / {this.props.item.billing_interval} {this.props.item.duration}
                    </td>
                </tr>
            </Fragment>
        );
    }
}

export default Subscriptions;