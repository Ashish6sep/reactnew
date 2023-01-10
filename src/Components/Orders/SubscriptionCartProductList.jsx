import React, { Fragment, PureComponent } from 'react';
import {CURRENCY_FORMAT} from "../../Constants/AppConstants";
import ReactImageFallback from "react-image-fallback";

class SubscriptionCartProductList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
        
        let product = this.props.product;

        return ( 
            <Fragment>
                <tr key={product.row_id} className="cart_page_data_list">
                    <td  data-title="Remove" className="cart_product_remove">
                        { 
                            (this.props.deleteItem=="false")? null :
                            <a onClick={(e) => product.deleteItem(e, product.row_id)} href="#" className="remove"><i className="fa fa-times" aria-hidden="true"></i></a>
                        }
                        
                    </td>
                    <td  data-title="Product" className="product-thumbnail">
                        <div className="cart_page_product_img distributor_cart_product">
                            <a href="#">
                            <ReactImageFallback
                                src={product.subs_image}
                                fallbackImage={require('../../Assets/images/preloader.gif')}
                                initialImage={require('../../Assets/images/preloader.gif')}
                                alt=''
                                className="cart_product_img" />
                            </a>   
                        </div>
                        <div className="cart_product_details distributor_cart_details mob_left_right_none">
                            <a href="#">
                                {product.subs_product_name} x {product.quantity}
                            </a>
                        </div>
                    </td>
                    <td  data-title="Price" className="cart_product_price">
                        <span className="Price-currencySymbol">
                            {CURRENCY_FORMAT(product.subs_discount_price)}
                        </span>    
                    </td>
                </tr>                
            </Fragment>
         );
    }
}
 
export default SubscriptionCartProductList;