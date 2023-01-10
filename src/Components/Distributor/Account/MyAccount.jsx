import React, { PureComponent, Fragment } from 'react';
import $ from "jquery";
import { NavLink } from "react-router-dom";
import { AJAX_REQUEST, ENABLE_NEW_LOGIN, MEAL_MENU_PUBLIC, GET_STORAGE } from "../../../Constants/AppConstants";
import Parser from 'html-react-parser';

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
            affiliate_panel_video_embed: '',
            loading: true,
            meal_menu_public: settings && settings.meal_menu_public == "yes" ? true : false
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
        AJAX_REQUEST("POST", "distributor/dashboard", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    userInfo: results.response.data,
                    affiliate_panel_video_embed: results.response.data.affiliate_panel_video_embed,
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
        // const { user } = this.props.auth;
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            {
                                ENABLE_NEW_LOGIN && this.state.affiliate_panel_video_embed !== '' ?
                                    <div className="d_embeed_video user_login_join_video" style={{ overflow: 'hidden', width: '100%', marginBottom: '25px' }}>
                                        {
                                            (this.state.affiliate_panel_video_embed != null) && (this.state.affiliate_panel_video_embed != '') ?
                                                <div className="d_embeed_video" style={{ overflow: 'hidden', width: '100%', marginBottom: '10px' }}>
                                                    {Parser(this.state.affiliate_panel_video_embed)}
                                                    {/* <div className="wistia_embed wistia_async_rpyx2ikvy4 popover=true popoverAnimateThumbnail=true" style={{display:'inline-block', height:'400px', position:'relative', width:'100%',}}>&nbsp;</div> */}
                                                </div>
                                                : ''
                                        }
                                    </div>
                                    : ''
                            }
                            {
                                ENABLE_NEW_LOGIN && this.state.userInfo.affiliate_panel_content !== '' ?
                                    <div className="d_embeed_video user_login_join_video" style={{ overflow: 'hidden', width: '100%', marginBottom: '25px' }}>

                                        {
                                            (this.state.userInfo.affiliate_panel_content != null) && (this.state.userInfo.affiliate_panel_content != '') ?
                                                <Fragment>
                                                    {Parser(this.state.userInfo.affiliate_panel_content)}
                                                </Fragment>
                                                : ''
                                        }
                                    </div>
                                    : ''
                            }

                            <div className="clearfix"></div>
                            <div className="pull-left order_aside">
                                <h3>Order</h3>
                                <ul>
                                    <li>Today's Order: <NavLink to="/my-account/view-order">{this.state.userInfo.hasOwnProperty('todays_order') ? this.state.userInfo.todays_order : ''}</NavLink></li>
                                    {/* <li>Lifetime Order: <NavLink to="/my-account/view-order">{this.state.userInfo.hasOwnProperty('lifetime_order') ? this.state.userInfo.lifetime_order : ''}</NavLink></li> */}
                                    <li>Lifetime Success Order: <NavLink to="/my-account/view-order">{this.state.userInfo.hasOwnProperty('lifetime_success_order') ? this.state.userInfo.lifetime_success_order : ''}</NavLink></li>
                                </ul>

                                {
                                    this.state.userInfo.affiliate_url !== '' ?
                                        <div className="affiliate_url">
                                            <strong style={{width:'250px',textAlign:'left'}}>Supplement Referral Link:</strong><br/>
                                            <input type="text" value={this.state.userInfo.hasOwnProperty('affiliate_url') ? this.state.userInfo.affiliate_url : ''} id="affiliateURL" readOnly />
                                            <i onClick={this.copyAffiliateURL} style={{ cursor: 'pointer' }} className="fa fa-copy" title="Copy to Clipboard!"></i>
                                            <span id="copyMsg" style={{ color: 'green', display: 'none' }}>Copied!</span>
                                        </div>
                                        : ''
                                }

                            </div>
                            <div className="pull-right commission_aside">
                                <h3>Commission (Since Last Payout)</h3>
                                <ul>
                                    <li>Total Earned: <NavLink to="my-account/commission-payout"> {this.state.userInfo.hasOwnProperty('total_earned') ? this.state.userInfo.total_earned : ''}</NavLink></li>
                                    <li>Total Received: <NavLink to="my-account/payment-received">{this.state.userInfo.hasOwnProperty('total_received') ? this.state.userInfo.total_received : ''}</NavLink></li>
                                    <li>Total Refund/Chargeback: <NavLink to="my-account/commission-payout">{this.state.userInfo.hasOwnProperty('total_cancel_refund') ? this.state.userInfo.total_cancel_refund : ''}</NavLink></li>
                                    <li>Total Adjustment: <NavLink to="my-account/commission-payout">{this.state.userInfo.hasOwnProperty('total_adjustment') ? this.state.userInfo.total_adjustment : ''}</NavLink></li>
                                    <li>Zero Out: <NavLink to="my-account/zero-out-commission">{this.state.userInfo.hasOwnProperty('zero_out') ? this.state.userInfo.zero_out : ''}</NavLink></li>
                                    <li>Current Balance: <NavLink to="my-account/commission-payout">{this.state.userInfo.hasOwnProperty('current_balance') ? this.state.userInfo.current_balance : ''}</NavLink></li>
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

export default MyAccount;

// function mapStateToProps(state) {
//     return {
//         auth: state.auth
//     };
// }

// export default connect(mapStateToProps,null)(MyAccount);