import React from 'react';

const OutOfStockButton = () => {
    return (
        <input name="addToCart" value="Out Of Stock" className="cart_add_product_btn stockout-btn disable" type="button" />
    );
}

export default OutOfStockButton;