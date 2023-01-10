import React, { Fragment, PureComponent } from "react";
import AddToCartButton from "./AddToCartButton";
import { CURRENCY_FORMAT } from "../../Constants/AppConstants";
import Parser from 'html-react-parser';
import ReactImageFallback from "react-image-fallback";
import $ from "jquery";

class ProductsListWithFlavors extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            subscription: "no",
            modalId: "disclaimerModal" + this.props.product.product_id,
        }
    }

    showHideProductDetails = () => {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    componentDidMount() {
        let product = this.props.product;
        this.firstMonthVariation(product.hasOwnProperty("flavors") ? product.flavors[0].id : null);

        this.setState({
            monthId: (product.hasOwnProperty("months") && product.months.length > 0) ? product.months[0].id : null,
            flavorId: product.hasOwnProperty("flavors") ? product.flavors[0].id : null,
        })

        if (product.months.length > 0) {
            let monthFlabourId = product.months[0].id + "_" + product.flavors[0].id;
            this.variation(monthFlabourId);
        }

    }

    firstMonthVariation = (flavorId) => {
        const product = this.props.product;
        const concateVariationId = product.hasOwnProperty("first_month") ? (product.first_month + "_" + flavorId) : null;
        const variation = product.hasOwnProperty("variations") ? product.variations[concateVariationId] : null;

        let firstRegularPriceDisplay = false;
        let regular_price = 0;
        let sale_price = 0;
        if (parseFloat(variation.sale_price) > 0) {
            firstRegularPriceDisplay = true;
            regular_price = variation.regular_price;
            sale_price = variation.sale_price;
        } else {
            regular_price = variation.regular_price;
            sale_price = variation.regular_price;
        }

        this.setState({
            firstMonthVariationId: variation.hasOwnProperty("variation_id") ? variation.variation_id : null,
            firstRegularPrice: CURRENCY_FORMAT(regular_price),
            firstSalePrice: CURRENCY_FORMAT(sale_price),
            firstRegularPriceDisplay: firstRegularPriceDisplay,
            // AddToCart State for Cart
            itemCount: product.item_count,
            cartProductId: product.product_id,
            cartProductName: product.title,
            cartImage: product.thumb_image,
            cartFirstVariationId: variation.variation_id,
            cartFirstVariationName: variation.variation_name,
            cartFirstSalePrice: sale_price,
            cartFirstQuantity: variation.quantity,
            subscription: this.state.subscription,
            cartSubscriptionMsg: "Every 1 Month(s)",
            cartDiscountPrice: ((sale_price - (sale_price * product.subscription_save_percentage) / 100)),
        });
    }
    changeFirstMonthFlovour = (e) => {
        this.firstMonthVariation(e.target.value);
    }

    variation = (monthFlabourId) => {
        const product = this.props.product;
        const variation = product.hasOwnProperty("variations") ? product.variations[monthFlabourId] : null;

        let regularPriceDisplay = false;
        let regular_price = 0;
        let sale_price = 0;
        if (parseFloat(variation.sale_price) > 0) {
            regularPriceDisplay = true;
            regular_price = variation.regular_price;
            sale_price = variation.sale_price;
        } else {
            regular_price = variation.regular_price;
            sale_price = variation.regular_price;
        }

        this.setState({
            variationId: variation.hasOwnProperty("variation_id") ? variation.variation_id : null,
            regularPrice: CURRENCY_FORMAT(regular_price),
            salePrice: CURRENCY_FORMAT(sale_price),
            regularPriceDisplay: regularPriceDisplay,
            // AddToCart State for Cart
            itemCount: product.item_count,
            cartProductId: product.product_id,
            cartProductName: product.title,
            cartImage: product.thumb_image,
            cartVariationId: variation.variation_id,
            cartVariationName: variation.variation_name,
            cartSalePrice: sale_price,
            cartQuantity: variation.quantity,
        });
    }
    changeMonth = (e) => {
        this.setState({ monthId: e.target.value })
        let monthFlabourId = e.target.value + "_" + this.state.flavorId;
        this.variation(monthFlabourId);
    }
    changeFlavor = (e) => {
        this.setState({ flavorId: e.target.value })
        let monthFlabourId = this.state.monthId + "_" + e.target.value;
        this.variation(monthFlabourId);
    }

    isSubscription = (e) => {

        if (e.target.value == 'yes') {
            this.setState({ subscription: "no" });
        } else {
            $(`#${this.state.modalId}`).modal({
                backdrop: 'static',
                keyboard: false,
            });
        }

        // if (this.state.subscription == "yes") {
        //     this.setState({ subscription: "no" });
        // } else {
        //     this.setState({ subscription: "yes" });
        // }

    }

    render() {

        const product = this.props.product;

        return (
            <Fragment>
                <tr className="items title express_checkout_item">
                    <td>
                        <a onClick={this.showHideProductDetails} href=""  data-target={product.notAvailable?this.state.isToggleOn?"":"#producNotAvailableModal":""} data-toggle="modal" className="cd-popup-trigger express_checkout_item_name">
                            <div className="product_list_img">
                                <ReactImageFallback
                                    src={product.hasOwnProperty('thumb_image') ? product.thumb_image : null}
                                    fallbackImage={require('../../Assets/images/preloader.gif')}
                                    initialImage={require('../../Assets/images/preloader.gif')}
                                    alt={product.hasOwnProperty('title') ? product.title : null}
                                    className="" />
                            </div>
                            <span> {product.hasOwnProperty('title') ? product.title : null} </span>
                        </a>
                    </td>
                    <td className="text-center">
                        <i>From </i>
                        {product.hasOwnProperty('start_price') ? CURRENCY_FORMAT(product.start_price) : null}
                    </td>
                    <td>
                        <input onClick={this.showHideProductDetails} value={this.state.isToggleOn ? "Hide Options" : "Show Options"} name=""  data-target={product.notAvailable?this.state.isToggleOn?"":"#producNotAvailableModal":""} data-toggle="modal" className="product_list_btn" type="submit" />
                    </td>
                </tr>
                {
                    (!this.state.isToggleOn) ? null :
                        <tr className="popup_hide current" id="product_details_5">
                            <td colSpan="3">
                                <table className="cart_showpopUp" id="popup" border="0">
                                    <colgroup>
                                        <col width="30%" />
                                        <col width="20%" />
                                        <col width="20%" />
                                        <col width="15%" />
                                        <col width="15%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Flavors</th>
                                            <th>Months</th>
                                            <th>Price</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        <tr className="variant items">
                                            <td rowSpan={(product.months.length <= 0) ? 1 : 2}>
                                                <div>
                                                    <ReactImageFallback
                                                        src={product.hasOwnProperty('list_image') ? product.list_image : null}
                                                        fallbackImage={require('../../Assets/images/preloader.gif')}
                                                        initialImage={require('../../Assets/images/preloader.gif')}
                                                        alt={product.hasOwnProperty('title') ? product.title : null}
                                                        className="cart_add_product_img" />
                                                </div>
                                                {product.hasOwnProperty('short_description') ? Parser(product.short_description) : null}
                                            </td>
                                            <td>
                                                <select onChange={this.changeFirstMonthFlovour} name="flovour" className="variant-changer">
                                                    {
                                                        (product.flavors.length <= 0) ? null :
                                                            product.flavors.map(function (flavor, key) {
                                                                return (
                                                                    <option key={key} value={flavor.hasOwnProperty('id') ? flavor.id : null}>{flavor.hasOwnProperty('value') ? flavor.value : null}</option>
                                                                )
                                                            }.bind(this))
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                {product.hasOwnProperty('title') ? product.title : null} <br />
                                                {
                                                    (product.subscription == "yes") ?
                                                        <Fragment>
                                                            <div className="form-check distributor-form-check">
                                                                <label className="form-check-label">
                                                                    <input onChange={this.isSubscription} value={this.state.subscription} type="checkbox" name="" checked={(this.state.subscription == 'yes') ? true : false} className="form-check-input" id="" />
                                                                    Subscribe &amp; Save {product.hasOwnProperty('subscription_save_percentage') ? product.subscription_save_percentage : null} % ( {CURRENCY_FORMAT(this.state.cartDiscountPrice)})</label>
                                                            </div>
                                                        </Fragment>
                                                        : null
                                                }
                                            </td>
                                            <td className="text-center">
                                                <div className="">
                                                    {
                                                        (this.state.firstRegularPriceDisplay) ?
                                                            <span className="compared_price">
                                                                {this.state.firstRegularPrice}
                                                            </span>
                                                            : ""
                                                    }
                                                </div>
                                                <div className="">
                                                    <span className="price">
                                                        {this.state.firstSalePrice}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="submit-col">
                                                <AddToCartButton firstMonth="yes" cartState={this.state} updateError={this.props.updateError} />
                                            </td>
                                        </tr>

                                        {
                                            (product.months.length <= 0) ? "" :
                                                <Fragment>
                                                    <tr className="variant items">
                                                        <td>
                                                            <select onChange={this.changeFlavor} name="flovour" className="variant-changer">
                                                                {
                                                                    (product.flavors.length <= 0) ? null :
                                                                        product.flavors.map(function (flavor, key) {
                                                                            return (
                                                                                <option key={key} value={flavor.hasOwnProperty('id') ? flavor.id : null}>{flavor.hasOwnProperty('value') ? flavor.value : null}</option>
                                                                            )
                                                                        }.bind(this))
                                                                }
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select onChange={this.changeMonth} name="month" className="variant-changer">
                                                                {
                                                                    (product.months.length <= 0) ? null :
                                                                        product.months.map(function (month, key) {
                                                                            return (
                                                                                <option key={key} value={month.hasOwnProperty('id') ? month.id : null}>{month.hasOwnProperty('value') ? month.value : null}</option>
                                                                            )
                                                                        }.bind(this))
                                                                }
                                                            </select>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="">
                                                                {
                                                                    (this.state.regularPriceDisplay) ?
                                                                        <span className="compared_price">
                                                                            {this.state.regularPrice}
                                                                        </span>
                                                                        : ""
                                                                }
                                                            </div>
                                                            <div className="">
                                                                <span className="price">
                                                                    {this.state.salePrice}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="submit-col">
                                                            <AddToCartButton cartState={this.state} updateError={this.props.updateError} />
                                                        </td>
                                                    </tr>
                                                </Fragment>
                                        }

                                    </tbody>
                                </table>

                            </td>
                        </tr>
                }

                {/* subscription disclaimer modal start  */}
                <div className="modal fade" id={this.state.modalId} tabIndex="-1" role="dialog" aria-labelledby="disclaimerModal" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header cus-modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body montserrat">
                                <p className="modal-body-content">
                                    By selecting Subscribe and Save I understand that I can cancel within 14 days of my next renewal date by calling customer support at 1-800-470-7560.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button onClick={(e) => this.setState({ subscription: 'yes' })} type="button" className="cus_button" data-dismiss="modal">I Agree</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* subscription disclaimer modal end  */}

            </Fragment>
        );
    }
}

export default ProductsListWithFlavors;