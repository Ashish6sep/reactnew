import React, { Fragment, PureComponent } from 'react';
import { NavLink } from "react-router-dom";
import { AJAX_REQUEST, CURRENCY_FORMAT, ENABLE_NEW_LOGIN } from "../../../Constants/AppConstants";
import $ from "jquery";
import Parser from 'html-react-parser';

class Dashboard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: [],
            loading: true,
            errorMeg: '',
        }
        document.title = "My Account -Prestige Labs";
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
        AJAX_REQUEST("POST", "master_affiliate/dashboard", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    userInfo: results.response.data,
                    loading: false,
                });
            } else {
                this.setState({
                    errorMeg: results.response.message,
                    loading: false,
                })
            }
        });
    }

    render() {
        return (
            <Fragment>
                {
                    (this.state.loading) ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            {
                                ENABLE_NEW_LOGIN && this.state.userInfo.video_embed !== '' ?
                                    <div className="d_embeed_video user_login_join_video" style={{ overflow: 'hidden', width: '100%', marginBottom: '25px' }}>
                                        {
                                            (this.state.userInfo.video_embed != null) && (this.state.userInfo.video_embed != '') ?
                                                <div className="d_embeed_video" style={{ overflow: 'hidden', width: '100%', marginBottom: '10px' }}>
                                                    {Parser(this.state.userInfo.video_embed)}
                                                    {/* <div className="wistia_embed wistia_async_rpyx2ikvy4 popover=true popoverAnimateThumbnail=true" style={{display:'inline-block', height:'150px', position:'relative', width:'300px',}}>&nbsp;</div> */}
                                                </div>
                                                : ''
                                        }
                                    </div>
                                    : ''
                            }

                            {
                                ENABLE_NEW_LOGIN && this.state.userInfo.content !== '' ?
                                    <div className="d_embeed_video user_login_join_video" style={{ overflow: 'hidden', width: '100%', marginBottom: '25px' }}>
                                        {
                                            (this.state.userInfo.content != null) && (this.state.userInfo.content != '') ?
                                                <Fragment>
                                                    {Parser(this.state.userInfo.content)}

                                                </Fragment>
                                                : ''
                                        }
                                    </div>
                                    : ''
                            }

                            <div className="clearfix"></div>
                            <div className="pull-left order_aside">
                                <h3>Summary</h3>
                                <ul>
                                    <li>Today's Earnings: <NavLink to="/my-affiliate-account/commission-earned">{this.state.userInfo.hasOwnProperty('todays_earn') ? this.state.userInfo.todays_earn : ''}</NavLink></li>
                                    <li>Lifetime Earnings: <NavLink to="/my-affiliate-account/commission-earned">{this.state.userInfo.hasOwnProperty('lifetime_earn') ? this.state.userInfo.lifetime_earn : ''}</NavLink></li>
                                    <li>Total Affiliate: <NavLink to="/my-affiliate-account/affiliate-list">{this.state.userInfo.hasOwnProperty('total_distributor') ? this.state.userInfo.total_distributor : ''}</NavLink></li>
                                </ul>

                                {
                                    this.state.userInfo.affiliate_url && (this.state.userInfo.affiliate_url != '') ?
                                        <div className="affiliate_url">
                                            <strong>Master Affiliate Referral Link: </strong>
                                            <input type="text" value={this.state.userInfo.hasOwnProperty('affiliate_url') ? this.state.userInfo.affiliate_url : ''} id="affiliateURL" readOnly />
                                            <i onClick={this.copyAffiliateURL} className="fa fa-copy" title="Copy to Clipboard!"></i>
                                            &nbsp; <span id="copyMsg" style={{ color: 'green', display: 'none' }}>Copied!</span>
                                        </div>
                                        : ''
                                }
                            </div>
                            <div className="pull-right commission_aside">
                                <h3>Commission (Since Last Payout)</h3>
                                <ul>
                                    <li>Total Earned by Affiliates: <NavLink to="/my-affiliate-account/commission-earned"> {this.state.userInfo.hasOwnProperty('todays_distributor_earn') ? CURRENCY_FORMAT(this.state.userInfo.todays_distributor_earn) : ''}</NavLink></li>
                                    <li>Total I've Earned: <NavLink to="/my-affiliate-account/commission-earned">{this.state.userInfo.hasOwnProperty('total_earn') ? CURRENCY_FORMAT(this.state.userInfo.total_earn) : ''}</NavLink></li>
                                    <li>Total Received: <NavLink to="/my-affiliate-account/payment-received">{this.state.userInfo.hasOwnProperty('total_received') ? CURRENCY_FORMAT(this.state.userInfo.total_received) : ''}</NavLink></li>
                                    <li>Total Refund/Chargeback: <NavLink to="/my-affiliate-account/commission-earned">{this.state.userInfo.hasOwnProperty('total_cancel_refund') ? CURRENCY_FORMAT(this.state.userInfo.total_cancel_refund) : ''}</NavLink></li>
                                    <li>Total Adjustment: <NavLink to="/my-affiliate-account/commission-earned">{this.state.userInfo.hasOwnProperty('total_adjustment') ? CURRENCY_FORMAT(this.state.userInfo.total_adjustment) : ''}</NavLink></li>
                                    <li>Current Balance: <NavLink to="/my-affiliate-account/commission-earned">{this.state.userInfo.hasOwnProperty('current_balance') ? CURRENCY_FORMAT(this.state.userInfo.current_balance) : ''}</NavLink></li>
                                </ul>
                            </div>
                            <div className="clearfix"></div>
                            <div className="woocommerce-notices-wrapper"></div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default Dashboard;