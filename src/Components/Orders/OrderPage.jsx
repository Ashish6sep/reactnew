import React, { Fragment, PureComponent } from "react";
import { NavLink } from "react-router-dom";
import { AJAX_REQUEST, ITEM_COUNT, MEAL_COUNT, GET_STORAGE } from "../../Constants/AppConstants";
import PropTypes from "prop-types";
import history from '../../history';
import { connect } from 'react-redux';
import $ from "jquery";
import Parser from 'html-react-parser';

import ProductsListWithFlavors from "./ProductsListWithFlavors";
import ProductsList from "./ProductsList";
import SingleProductNotAvailableModal from "./SingleProductNotAvailableModal";

class OrderPage extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: '',
            products: [],
            products_filtered: [],
            searchName: '',
            cart_count: 0,
            // productNotAvailable:["Bulletproof Vitality For Her","Women's Ultimate","Women's Immune Booster"],
            productNotAvailable:[],
        }
        document.title = "Order -Prestige Labs";
    }

    itemCount = (e) => {
        const count = Number(ITEM_COUNT()) + Number(MEAL_COUNT());
        this.setState({ cart_count: count });
    }

    updateError = (error) => {
        // document.querySelector("body").scrollIntoView();
        // this.setState({
        //     error
        // })
        // setTimeout(function () {
        //     this.setState({
        //         error: ''
        //     })
        // }.bind(this), 5000)
    }

    componentDidMount() {
        if (this.props.user) {
            if (this.props.user.new_agreement_required == "yes") {
                history.push('/agreement');
            }
        }
        if ((this.props.user.roles != undefined) && !Object.values(this.props.user.roles).includes('distributor') && Object.values(this.props.user.roles).includes('master_affiliate')) {
            history.push('/my-account');
        }
        document.querySelector("body").scrollIntoView();
        this.getAllProducts();
        this.itemCount();
    }

    getAllProducts = () => {
        AJAX_REQUEST("POST", "product/getList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    products: results.response.data,
                    products_filtered: results.response.data,
                    loading: false,
                });
            } else {
                this.setState({
                    error: results.response.message,
                    loading: false,
                })
            }
        });
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    filterProduct = (e) => {
        this.setState({
            searchName: e.target.value,
            products_filtered: this.state.products.filter(function (product) {
                if (e.target.value === '') {
                    return product;
                } else {
                    let string = product.title.toUpperCase();
                    let substring = e.target.value.toUpperCase();
                    if (string.includes(substring)) {
                        return product;
                    }
                }
            }.bind(this))
        });
    }

    render() {

        const notAvailablePopup=this.notAvailablePopup;
        // Added ads banner
        let offer_banner_showing_status = false;
        let offer_banner_image = require('../../Assets/images/slideshow_3.jpg');
        let settings = GET_STORAGE('settings');
        if (settings) {
            settings = JSON.parse(settings);
            if (settings) {
                if (settings.offer_banner_showing_status && settings.offer_banner_showing_status == "yes") {
                    offer_banner_showing_status = true;
                    offer_banner_image = settings.offer_banner_image;
                }
            }
        }

        return (
            <Fragment>
                {
                    (this.state.loading) ?
                        <div className="loading container full_page_loader"></div>
                        :
                        <Fragment>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <main>

                                            <Fragment>
                                                {
                                                    (offer_banner_showing_status) ?
                                                        <div className="affiliate-banner">
                                                            <img className="" src={offer_banner_image} alt="Banner Image" />
                                                        </div>
                                                        : ''
                                                }
                                            </Fragment>

                                            <div className="product-list-container">
                                                {
                                                    this.state.error != '' ?
                                                        <div className="alert-wrapper alert-error">
                                                            <ul className="alert-error">
                                                                <li><i className="fa fa-times-circle" aria-hidden="true"></i> <strong>Error:</strong> {Parser(this.state.error)}</li>
                                                            </ul>
                                                        </div>
                                                        :
                                                        ''
                                                }
                                                <div className="product-search-container">
                                                    <form className="product-search-form">
                                                        <div className="search-input-group">
                                                            <input onChange={this.filterProduct} value={this.state.searchName}
                                                                className="product-search_box" placeholder="Search" name="searchName" id="filter-by" type="text" />
                                                        </div>
                                                    </form>
                                                    <div className="product-paging">
                                                        <div className="product-btn-group">
                                                            <button type="button" id="prev" className="prev spof-btn spof-btn-default" disabled="">&lt;&lt;</button>
                                                            <button type="button" id="pageNum" className="pageNum spof-btn spof-btn-default">1</button>
                                                            <button type="button" id="next" className="next spof-btn spof-btn-default" disabled="">&gt;&gt;</button>
                                                        </div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </div>

                                                <div className="products_list">
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <colgroup>
                                                                <col width="30%" />
                                                                <col width="30%" />
                                                                <col width="40%" />
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <th className="">Product Name
                                                                    <div className="prdname arrow-up arrowshow"></div>
                                                                    </th>
                                                                    <th className=""> Price </th>
                                                                    <th className=""> </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    (this.state.products_filtered.length <= 0) ?
                                                                        <tr><td className="text-center" colSpan="3">No Product Matched!</td></tr>
                                                                        :
                                                                        this.state.products_filtered.map(function (product, key) {
                                                                            product.notAvailable = this.state.productNotAvailable.includes(product.title)?true:false;
                                                                            // Added cart item_count
                                                                            product.item_count = this.itemCount;

                                                                            return (
                                                                                <Fragment key={key}>
                                                                                    {
                                                                                        product.hasOwnProperty('flavors') ?
                                                                                            <ProductsListWithFlavors key={product.product_id} product={product} updateError={this.updateError} />
                                                                                            :
                                                                                            <ProductsList key={product.product_id} product={product} updateError={this.updateError} />
                                                                                    }
                                                                                </Fragment>
                                                                            )
                                                                        }.bind(this))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div className="product-search-container product-search-container-bottom">
                                                    <div className="product-paging">
                                                        <div className="product-btn-group">
                                                            <button type="button" id="prev" className="prev spof-btn spof-btn-default" disabled="">&lt;&lt;</button>
                                                            <button type="button" id="pageNum" className="pageNum spof-btn spof-btn-default">1</button>
                                                            <button type="button" id="next" className="next spof-btn spof-btn-default" disabled="">&gt;&gt;</button>
                                                        </div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </div>
                                            </div>
                                        </main>

                                        <div className="shopping-cart-wrapper">
                                            <NavLink to="/cart" title="Shopping cart">
                                                <div className="shopping-cart">
                                                    <span id="expressCartItemCount" className="item-count"> {this.state.cart_count} </span> item(s)
                                            </div>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <SingleProductNotAvailableModal />
                        </Fragment>
                }
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(OrderPage);