import React, { Component, Fragment } from 'react';
import { CURRENCY_FORMAT } from '../../../Constants/AppConstants';
import ReactImageFallback from "react-image-fallback";

class OrderedProductsList extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        let product = this.props.product;
        return (
            <Fragment>
                <tr>
                    <td className="product_name">
                        <span>
                            <ReactImageFallback
                                src={(product.product_thumbnail) ? product.product_thumbnail : ""}
                                fallbackImage={require('../../../Assets/images/preloader.gif')}
                                initialImage={require('../../../Assets/images/preloader.gif')}
                                alt=''
                                className="cart_add_product_img" />
                            <span> &nbsp;{product.name_with_variants}</span> <strong className="product-quantity">&nbsp;× {product.quantity}</strong><br />
                        </span>
                    </td>
                    <td><span>{CURRENCY_FORMAT(product.total_price)}</span></td>
                </tr>
            </Fragment>
        );
    }
}

export default OrderedProductsList;