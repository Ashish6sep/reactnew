import React, { PureComponent, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import $ from "jquery";

class TeamSideMenuLink extends PureComponent {

    render() {
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
                    <NavLink to="/my-account/commission-payout" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i> Commission Earned</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/product-refer-link" activeClassName="active"><i className="fa fa-link" aria-hidden="true"></i> Refer Link</NavLink>
                </li>
                <li>
                    <NavLink to="/my-account/edit-account" activeClassName="active"><i className="fa fa-user" aria-hidden="true"></i> Account Details</NavLink>
                </li>
            </Fragment>
        );
    }
}

export default withRouter(TeamSideMenuLink);