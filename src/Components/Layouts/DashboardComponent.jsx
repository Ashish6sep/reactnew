import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { SET_COOKIE, GET_STORAGE } from '../../Constants/AppConstants';


class DashboardComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    componentDidMount() {
        this.setState({
            loading: false
        })
    }

    render() {
        const cur_url = window.location.href;
        let pageTitle = 'My account';
        const { user } = this.props.auth;

        let settings = null;
        if (GET_STORAGE("settings")) {
            settings = JSON.parse(GET_STORAGE("settings"));
        }
        let enable_new_signup = false;
        if(settings && settings.enable_new_signup == "yes"){
            enable_new_signup = true;
        }

        if (cur_url.match(/my-affiliate-account/g)) {
            pageTitle = enable_new_signup?'Master Affiliate Dashboard':'Master Affiliate Panel';
        } else if (cur_url.match(/my-account/g)) {
            if ((user.roles != undefined) && !Object.values(user.roles).includes('distributor')) {
                pageTitle = "Team Member Panel";
            } else {
                pageTitle = enable_new_signup?'Affiliate Dashboard':'Affiliate Panel';
            }
        }

        if (cur_url.match(/my-account/g) || cur_url.match(/my-affiliate-account/g)) {
            return (
                <div className="site-main">
                    <main>
                        <div className="page-content entry-content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 montserrat page-title">{pageTitle}</div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3">
                                        <Sidebar />
                                    </div>


                                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-9">
                                        <MainContent />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            );
        } else {
            return (
                <Fragment>
                    {
                        (this.state.loading) ?
                            <div className="loading"></div>
                            :
                            ''
                    }
                </Fragment>
            )
        }

    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps, null)(DashboardComponent));