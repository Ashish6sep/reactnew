import React, { PureComponent } from 'react';
import { SET_STORAGE, GET_STORAGE} from "../../Constants/AppConstants";
import OutOfStockButton from "./OutOfStockButton";

class SubscriptionAddToCartButton extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            addToCart: "Add to Subscription",
        }
    }

    addToCart = (e) =>{

        let subscriptionItem = []; 
        let data = [];

        if(!GET_STORAGE("subscriptionItem")) {
            SET_STORAGE("subscriptionItem", JSON.stringify(subscriptionItem));
        }  
        subscriptionItem = JSON.parse(GET_STORAGE("subscriptionItem"));

        let newItem = {
            subs_product_id: e.target.getAttribute('subs_product_id'),
            subs_product_name: e.target.getAttribute('subs_product_name'),
            subs_image: e.target.getAttribute('subs_image'),
            subs_variation_id: e.target.getAttribute('subs_variation_id'),
            subs_variation_name: e.target.getAttribute('subs_variation_name'),
            subs_subscription_msg: e.target.getAttribute('subs_subscription_msg'),
            subs_discount_price: e.target.getAttribute('subs_discount_price'),
            quantity: e.target.getAttribute('quantity'),
            in_stock: e.target.getAttribute('in_stock'),            
        }

        if(subscriptionItem.length > 0) {
            subscriptionItem.forEach(function(item, key) {                
                if(item.subs_variation_id==e.target.getAttribute('subs_variation_id')) {
                    if(item.quantity >= e.target.getAttribute('in_stock')) {
                        alert("Out Of Stock") // Check product quantity
                    } else {
                        item.quantity = 1; // Number(item.quantity)+1;
                    } 
                    data.push(item);
                    newItem = null;
                } else {
                    data.push(item);
                }                
            });
            if(newItem != null) {
                data.push(newItem); 
            }
        } else {
            data.push(newItem);       
        }
        
        SET_STORAGE("subscriptionItem", JSON.stringify(data));

        this.props.subsState.itemCount(); // Update subscription item_count method
        this.addToCartLabelChange();
    }
    
    addToCartLabelChange = (e) => {
        this.setState({
            addToCart: "Adding..."
        })

        setTimeout(function() {
            this.setState({
                addToCart: "Thank You"
            })
        }.bind(this), 1000)

        setTimeout(function() {
            this.setState({
                addToCart: "Add More ..."
            })
        }.bind(this), 2000)
    }

    render() { 
        let subs = this.props.subsState;

        if(subs.subsFirstQuantity <= 0) {
            return (
                <OutOfStockButton />
            )
        }

        return ( 
            <input 
                onClick={this.addToCart}
                subs_product_id={subs.subsProductId}
                subs_product_name={subs.subsProductName}
                subs_image={subs.subsImage}
                subs_variation_id={subs.subsFirstVariationId}
                subs_variation_name={subs.subsFirstVariationName}
                subs_subscription_msg={subs.subsSubscriptionMsg}
                subs_discount_price={subs.subsDiscountPrice}
                quantity="1"
                in_stock={subs.inStock}
                value={this.state.addToCart} name="addToCart" className="cart_add_product_btn" type="button" />
         );        
        
    }
}
 
export default SubscriptionAddToCartButton;