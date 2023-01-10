import React, { PureComponent, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from "jquery";
import { GET_STORAGE } from '../../../Constants/AppConstants';

class DistSideMenuLink extends PureComponent {

    render() {
        const { user } = this.props.auth;

        let settings = null;
        if (GET_STORAGE("settings")) {
            settings = JSON.parse(GET_STORAGE("settings"));
        }

        let meal_menu_active = false;
        if (settings && settings.meal_menu_public == "yes") {
            meal_menu_active = true;
        } else {
            if (this.props) {
                if (this.props.auth) {
                    if (this.props.auth.user) {
                        if (this.props.auth.user.meal_menu_activated) {
                            meal_menu_active = true;
                        }
                    }
                }
            }
        }

        let commission_payout_settings_menu_show = 'no';
        if (settings && settings.hasOwnProperty('commission_payout_settings_menu_show')) {
            commission_payout_settings_menu_show = settings.commission_payout_settings_menu_show;
        }

        return (
            <Fragment>
                <li>
                    <NavLink to="/my-account" activeClassName="active" exact><i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/view-order" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i> Orders</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/subscription-order" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i> Subscription Orders</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/canceled-subscription" activeClassName="active"><i className="fa fa-calendar-times-o" aria-hidden="true"></i>Canceled Subscription</NavLink>
                </li>
                {/* <li>
                    <NavLink to="/my-account/failed-subscription" activeClassName="active"><i className="fa fa-calendar-minus-o" aria-hidden="true"></i>Failed Subscription</NavLink>
                </li> */}
                {/* <li>
                    <NavLink to="/my-account/affiliate-order" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i> Affiliate Orders</NavLink>
                </li> */}
                <li>
                    <NavLink to="/my-account/statistics-reports" activeClassName="active"><i className="fa fa-line-chart" aria-hidden="true"></i>Statistics Reports</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/leaderboard" activeClassName="active"><i className="fa fa-list" aria-hidden="true"></i>Leaderboard</NavLink>

                </li>
                <li>
                    <NavLink to="/my-account/commission-payout" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i> Commission Earned</NavLink>
                </li>
                {
                    meal_menu_active ?
                        <li>
                            <NavLink to="/my-account/commission-coupon" activeClassName="active"><i className="fa fa-gift" aria-hidden="true"></i> Meal Commission Coupon</NavLink>
                        </li>
                        : ''
                }

                <li>
                    <NavLink to="/my-account/product-refer-link" activeClassName="active"><i className="fa fa-link" aria-hidden="true"></i> Refer Link</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/zero-out-commission" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i> Zeroed out Comm.</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/payment-received" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i> Payment Received</NavLink>
                </li>
                {
                    (commission_payout_settings_menu_show == 'yes') ?
                        <li>
                            <NavLink to="/my-account/commission-payout-method" activeClassName="active"><i className="fa fa-credit-card" aria-hidden="true"></i> Commission Payout Method</NavLink>
                        </li>
                        : ""
                }
                {
                    user.sales_agent_feature === "enable" ?
                        <Fragment>
                            <li>
                                <NavLink to="/my-account/manage-representative" activeClassName="active"><i className="fa fa-user" aria-hidden="true"></i> Team Member</NavLink>
                            </li>
                            <li>
                                <NavLink to="/my-account/member-commission" activeClassName="active"><i className="fa fa-credit-card" aria-hidden="true"></i> Member Commission</NavLink>
                            </li>
                        </Fragment>
                        :
                        null
                }
               {/* <li>
                    <NavLink to="/my-account/w-9-form" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i>W-9 Form</NavLink>
                </li>*/}
                <li>
                    <NavLink to="/my-account/w-9-form-information" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i>Tax Form Information</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/paypal-account" activeClassName="active"><i className="fa fa-cc-paypal" aria-hidden="true"></i> PayPal Email</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/edit-account" activeClassName="active"><i className="fa fa-user" aria-hidden="true"></i> Account Details</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/settings" activeClassName="active"><i className="fa fa-cog" aria-hidden="true"></i> Settings</NavLink>
                </li>
            </Fragment>
        );
    }
}

DistSideMenuLink.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps)(DistSideMenuLink));