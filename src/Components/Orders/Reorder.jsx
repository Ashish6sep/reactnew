import React, { PureComponent } from 'react';
import { AJAX_REQUEST, SET_STORAGE } from "../../Constants/AppConstants";
import history from '../../history';

class Reorder extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            order_id: this.props.match.params.order_id,
        }
    }

    componentDidMount() {
        let data = {
            order_id: this.state.order_id
        }
        AJAX_REQUEST("POST", "order/getReOrderData", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                if (data.supplement) {
                    SET_STORAGE('cart', JSON.stringify(data.supplement));
                }
                if (data.meals) {
                    SET_STORAGE('meals', JSON.stringify(data.meals));
                }
                history.push('/cart');
            } else {
                history.push('/my-account/view-order');
            }
        });
    }

    render() {
        return (
            <div className="loading container full_page_loader"></div>
        );
    }
}

export default Reorder;