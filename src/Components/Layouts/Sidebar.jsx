import React, { PureComponent, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustSideMenuLink from '../Customer/Layouts/CustSideMenuLink';
import DistSideMenuLink from '../Distributor/Layouts/DistSideMenuLink';
import MasterAffSideMenuLink from '../MasterAffiliate/Layouts/MasterAffSideMenuLink';
import TeamSideMenuLink from '../TeamMember/Layouts/TeamSideMenuLink';
import { logout } from '../../Store/actions/loginActions';
import { AJAX_REQUEST } from '../../Constants/AppConstants';

class Sidebar extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    logout = (e) => {
        e.preventDefault();
        AJAX_REQUEST("POST", "user/logout", {}).then(results => {
            if (parseInt(results.response.code) === 1000) { } else {
                // console.log(results.response.message);
            }
        });
        this.props.logout();
    }

    goToTopOnLogout = () => {
        document.getElementById("nav-for-scroll").scrollIntoView();
    }

    render() {
        const { user } = this.props.auth;
        const cur_url = window.location.href;
        return (
            <Fragment>
                <nav className="left_menu">
                    <ul>
                        {((user.roles != undefined) && Object.values(user.roles).includes('distributor') && cur_url.match(/my-account/g)) &&
                            <DistSideMenuLink />
                        }
                        {((user.roles != undefined) && Object.values(user.roles).includes('customer')) &&
                            <CustSideMenuLink />
                        }
                        {((user.roles != undefined) && Object.values(user.roles).includes('master_affiliate') && cur_url.match(/my-affiliate-account/g)) &&
                            <MasterAffSideMenuLink />
                        }
                        {((user.roles != undefined) && Object.values(user.roles).includes('team_member')) &&
                            <TeamSideMenuLink />
                        }
                        <li className="" onClick={this.goToTopOnLogout}>
                            <a onClick={this.logout} href="#"><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</a>
                        </li>
                    </ul>
                </nav>
            </Fragment>
        );
    }
}

Sidebar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps, { logout })(Sidebar));