import React, { PureComponent, Fragment } from 'react';
import $ from "jquery";
import { NavLink } from "react-router-dom";
import { AJAX_REQUEST, CURRENCY_FORMAT, GET_STORAGE } from "../../../Constants/AppConstants";

class MyAccount extends PureComponent {
    constructor(props) {
        super(props)

        let settings = null;
        if (GET_STORAGE("settings")) {
            settings = JSON.parse(GET_STORAGE("settings"));
        }

        this.state = {
            userInfo: [],
            errorMeg: '',
            loading: true,
            meal_menu_public: settings && settings.meal_menu_public == "yes" ? true : false
        }
        document.title = "My account - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getUserInfo();
    }

    copyAffiliateURL = (e) => {
        var copyText = document.getElementById("affiliateURL");
        copyText.select();
        document.execCommand("copy");
        $("#copyMsg").show();
        $("#copyMsg").hide(1000);
    }

    copyMealAffiliateURL = (e) => {
        var copyText = document.getElementById("mealAffiliateURL");
        copyText.select();
        document.execCommand("copy");
        $("#copyMealMsg").show();
        $("#copyMealMsg").hide(1000);
    }

    getUserInfo = () => {
        AJAX_REQUEST("POST", "team_member/dashboard", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    userInfo: results.response.data,
                    loading: false
                });
            } else {
                this.setState({
                    errorMeg: results.response.message,
                    loading: false
                })
            }
        });
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <div className="pull-left order_aside">
                                <h3>Order</h3>
                                <ul>
                                    <li>Today's Order: <NavLink to="/my-account/view-order">{this.state.userInfo.hasOwnProperty('todays_order') ? this.state.userInfo.todays_order : ''}</NavLink></li>
                                    <li>Lifetime Order: <NavLink to="/my-account/view-order">{this.state.userInfo.hasOwnProperty('lifetime_order') ? this.state.userInfo.lifetime_order : ''}</NavLink></li>
                                    <li>Lifetime Success Order: <NavLink to="/my-account/view-order">{this.state.userInfo.hasOwnProperty('lifetime_success_order') ? this.state.userInfo.lifetime_success_order : ''}</NavLink></li>
                                </ul>
                            </div>
                            <div className="pull-right commission_aside">
                                <h3>Commission (Since Last Payout)</h3>
                                <ul>
                                    <li>Total Earned: <NavLink to="my-account/commission-payout"> {this.state.userInfo.hasOwnProperty('total_earned') ? CURRENCY_FORMAT(this.state.userInfo.total_earned) : ''}</NavLink></li>
                                    <li>Total Cancel/Refund: <NavLink to="my-account/commission-payout">{this.state.userInfo.hasOwnProperty('total_cancel_refund') ? CURRENCY_FORMAT(this.state.userInfo.total_cancel_refund) : ''}</NavLink></li>
                                    <li>Current Balance: <NavLink to="my-account/commission-payout">{this.state.userInfo.hasOwnProperty('current_balance') ? CURRENCY_FORMAT(this.state.userInfo.current_balance) : ''}</NavLink></li>
                                </ul>
                            </div>
                            <div className="clearfix"></div>
                            <div className="url-wrapper">
                                {
                                    this.state.userInfo.affiliate_url !== '' ?
                                        <div className="affiliate_url">
                                            <strong>Supplement URL: </strong>
                                            <input type="text" value={this.state.userInfo.hasOwnProperty('affiliate_url') ? this.state.userInfo.affiliate_url : ''} id="affiliateURL" readOnly />
                                            <i onClick={this.copyAffiliateURL} className="fa fa-copy" title="Copy to Clipboard!"></i>
                                            <span id="copyMsg" style={{ color: 'green', display: 'none' }}>Copied!</span>
                                        </div>
                                        :
                                        <Fragment></Fragment>
                                }
                                {
                                    this.state.userInfo.meal_refer_url && this.state.userInfo.meal_refer_url !== '' ?
                                        <div className="meal_refer_url">
                                            <strong>Meals URL: </strong>
                                            <input type="text" value={this.state.userInfo.hasOwnProperty('meal_refer_url') ? this.state.userInfo.meal_refer_url : ''} id="mealAffiliateURL" readOnly />
                                            <i onClick={this.copyMealAffiliateURL} style={{ cursor: 'pointer' }} className="fa fa-copy" title="Copy to Clipboard!"></i>
                                            <span id="copyMealMsg" style={{ color: 'green', display: 'none' }}>Copied!</span>
                                        </div>
                                        :
                                        <Fragment></Fragment>
                                }
                            </div>
                            <div className="woocommerce-notices-wrapper"></div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default MyAccount;