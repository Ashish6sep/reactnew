import React, { PureComponent } from 'react';
import { SET_STORAGE, GET_STORAGE, NEXT_MONTH, AJAX_REQUEST } from "../../Constants/AppConstants";
import OutOfStockButton from "./OutOfStockButton";

class AddToCartButton extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            addToCart: "Add to Cart",
        }
    }

    addToCart = (e) => {

        let cart = [];
        let data = [];

        if (!GET_STORAGE("cart")) {
            SET_STORAGE("cart", JSON.stringify(cart));
        }
        cart = JSON.parse(GET_STORAGE("cart"));

        let newItem = {
            cart_product_id: e.target.getAttribute('cart_product_id'),
            cart_product_name: e.target.getAttribute('cart_product_name'),
            cart_image: e.target.getAttribute('cart_image'),
            cart_variation_id: e.target.getAttribute('cart_variation_id'),
            cart_variation_name: e.target.getAttribute('cart_variation_name'),
            cart_sale_price: e.target.getAttribute('cart_sale_price'),
            subscription: e.target.getAttribute('subscription'),
            cart_subscription_msg: e.target.getAttribute('cart_subscription_msg'),
            cart_discount_price: e.target.getAttribute('cart_discount_price'),
            quantity: parseInt(e.target.getAttribute('quantity')),
            in_stock: parseInt(e.target.getAttribute('cart_quantity')),
        }

        const addToCartDb = this.addToCartDb;

        if (cart.length > 0) {
            cart.forEach(function (item, key) {
                if ((item.cart_variation_id == e.target.getAttribute('cart_variation_id')) && (item.subscription.toLowerCase() == e.target.getAttribute('subscription').toLowerCase())) {
                    if (parseInt(item.quantity) >= parseInt(e.target.getAttribute('cart_quantity'))) {
                        alert("Out Of Stock") // Check product quantity
                    } else {
                        item.quantity = Number(Number(item.quantity) + 1);
                    }
                    data.push(item);
                    addToCartDb(item); // Cart add to db  
                    newItem = null;
                } else {
                    data.push(item);
                }
            });
            if (newItem != null) {
                data.push(newItem);
                addToCartDb(newItem); // Cart add to db
            }
        } else {
            data.push(newItem);
            addToCartDb(newItem); // Cart add to db
        }

        SET_STORAGE("cart", JSON.stringify(data));
        this.props.cartState.itemCount(); // Update cart item_count method
        this.addToCartLabelChange();
    }

    addToCartDb = (data) => {
        AJAX_REQUEST("POST", "cart/saveItem", data).then(results => {
            if (parseInt(results.response.code) !== 1000) {
                this.setState({ error: results.response.message });
                this.props.updateError(results.response.message);
            }
        });
    }

    addToCartLabelChange = (e) => {
        this.setState({
            addToCart: "Adding..."
        })

        setTimeout(function () {
            this.setState({
                addToCart: "Thank You"
            })
        }.bind(this), 1000)

        setTimeout(function () {
            this.setState({
                addToCart: "Add More ..."
            })
        }.bind(this), 2000)
    }

    render() {
        let cart = this.props.cartState;

        if (this.props.firstMonth) {

            if (cart.cartFirstQuantity <= 0) {
                return (
                    <OutOfStockButton />
                )
            }

            return (
                <input
                    onClick={this.addToCart}
                    cart_product_id={cart.cartProductId}
                    cart_product_name={cart.cartProductName}
                    cart_image={cart.cartImage}
                    cart_variation_id={cart.cartFirstVariationId}
                    cart_variation_name={cart.cartFirstVariationName}
                    cart_sale_price={cart.cartFirstSalePrice}
                    subscription={cart.subscription}
                    cart_subscription_msg={cart.cartSubscriptionMsg}
                    cart_discount_price={cart.cartDiscountPrice}
                    cart_quantity={cart.cartFirstQuantity}
                    quantity={1}
                    value={this.state.addToCart} name="addToCart" className="cart_add_product_btn" type="button" />
            );
        } else {

            if (cart.cartQuantity <= 0) {
                return (
                    <OutOfStockButton />
                )
            }

            return (
                <input
                    onClick={this.addToCart}
                    cart_product_id={cart.cartProductId}
                    cart_product_name={cart.cartProductName}
                    cart_image={cart.cartImage}
                    cart_variation_id={cart.cartVariationId}
                    cart_variation_name={cart.cartVariationName}
                    cart_sale_price={cart.cartSalePrice}
                    subscription="no"
                    cart_subscription_msg=""
                    cart_discount_price="0.00"
                    cart_quantity={cart.cartQuantity}
                    quantity={1}
                    value={this.state.addToCart} name="addToCart" className="cart_add_product_btn" type="button" />
            );
        }

    }
}

export default AddToCartButton;