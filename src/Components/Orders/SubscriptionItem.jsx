import React, { Fragment, PureComponent } from "react";
import {NavLink} from "react-router-dom";
import {AJAX_REQUEST, ITEM_COUNT_SUSBSCRIPTION} from "../../Constants/AppConstants";
import $ from "jquery";

import SubscriptionItemListWithFlavors from "./SubscriptionItemListWithFlavors";
import SubscriptionItemList from "./SubscriptionItemList";

class SubscriptionItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = { 
            products: [],
            products_filtered:[],
            searchName: '',
            cart_count:0,
            loading:true
        }
        document.title = "Subscription Item -Prestige Labs";
    }

    itemCount = (e) =>{
        let count = ITEM_COUNT_SUSBSCRIPTION();
        this.setState({cart_count:count});
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getAllProducts();
        this.itemCount();
    }

    getAllProducts = () => {
		AJAX_REQUEST("POST", "product/getList", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    products: results.response.data,
                    products_filtered: results.response.data,
                    loading:false
                });		
            }         
        });
    }
        
    changeHandler = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    filterProduct = (e) => {
        this.setState({
            searchName : e.target.value,
            products_filtered:this.state.products.filter(function(product){
                if(e.target.value === ''){
                    return product;
                }else{
                    let string = product.title.toUpperCase();
                    let substring = e.target.value.toUpperCase();
                    if(string.includes(substring)){
                        return product;
                    }
                }
            }.bind(this))
        });
    }
    
    render() { 
        return ( 
            <Fragment>
                {
                    this.state.loading ? 
                    <div className="loading container full_page_loader"></div>
                    :
                    <Fragment>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <main>
                                        <div className="product-list-container">
                                            <div className="product-search-container">
                                                <form className="product-search-form">
                                                    <div className="search-input-group">
                                                        <input onChange={this.filterProduct} value={this.state.searchName}
                                                        className="product-search_box" placeholder="Search" name="searchName" id="filter-by" autoComplete="off" type="text" />
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
                                                                (this.state.products_filtered.length <= 0)? <tr><td className="text-center" colSpan="3">Product did not Matched!</td></tr> :
                                                                this.state.products_filtered.map(function(product, key) {

                                                                    if(product.subscription=='yes') {
                                                                        // Added Subscription item_count
                                                                        product.item_count = this.itemCount

                                                                        return (
                                                                            <Fragment key={product.product_id}>
                                                                                {
                                                                                    product.hasOwnProperty('flavors')? 
                                                                                    <SubscriptionItemListWithFlavors product={product} />
                                                                                    :
                                                                                    <SubscriptionItemList product={product} />                                                                        
                                                                                }
                                                                            </Fragment>
                                                                        ) 
                                                                    }
                                                                                       
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
                                        <NavLink to={`/subscription-cart/${this.props.match.params.id}`} title="Shopping cart">
                                            <div className="shopping-cart">
                                                <span id="expressCartItemCount" className="item-count"> {this.state.cart_count} </span> item(s)
                                            </div>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                }
        </Fragment>
        );
    }
}
 
export default SubscriptionItem;