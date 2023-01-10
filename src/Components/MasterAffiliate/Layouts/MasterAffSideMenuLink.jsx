import React, { PureComponent, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import $ from "jquery";

class MasterAffSideMenuLink extends PureComponent {

    render() {
        return (
            <Fragment>
                <li>
                    <NavLink to="/my-affiliate-account" activeClassName="active" exact><i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/my-affiliate-account/affiliate-list" activeClassName="active"><i className="fa fa-user" aria-hidden="true"></i> Affiliate List</NavLink>
                </li>
                <li>
                    <NavLink to="/my-affiliate-account/commission-earned" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i> Commission Earned</NavLink>
                </li>
                <li>
                    <NavLink to="/my-affiliate-account/payment-received" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i> Payment Received</NavLink>
                </li>
                {/*<li>
                    <NavLink to="/my-affiliate-account/w-9-form" activeClassName="active"><i className="fa fa-calendar-check-o" aria-hidden="true"></i>W-9 Form</NavLink>
                </li>*/}
                <li>
                    <NavLink to="/my-affiliate-account/paypal-account" activeClassName="active"><i className="fa fa-cc-paypal" aria-hidden="true"></i> PayPal Email</NavLink>
                </li>
                <li>
                    <NavLink to="/my-affiliate-account/edit-account" activeClassName="active"><i className="fa fa-user" aria-hidden="true"></i> Account Details</NavLink>
                </li>
            </Fragment>
        );
    }
}

export default withRouter(MasterAffSideMenuLink);