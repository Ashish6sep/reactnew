import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import history from '../../history';
import DistRoutes from '../../Routes/DistRoutes';
import CustomerRoutes from '../../Routes/CustomerRoutes';
import MasterAffRoutes from '../../Routes/MasterAffRoutes';
import TeamRoutes from '../../Routes/TeamRoutes';


class MainContent extends PureComponent {
    componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            history.push('/login');
        }
    }

    render() {
        const { user } = this.props.auth;
        if ((user.roles != undefined) && Object.values(user.roles).includes('distributor') && Object.values(user.roles).includes('master_affiliate')) {
            return (
                <Fragment>
                    <DistRoutes />
                    <MasterAffRoutes />
                </Fragment>
            );
        } else if ((user.roles != undefined) && Object.values(user.roles).includes('distributor')) {
            return (
                <DistRoutes />
            );
        } else if ((user.roles != undefined) && Object.values(user.roles).includes('master_affiliate')) {
            
            return (
                <MasterAffRoutes />
            );
        } else if ((user.roles != undefined) && Object.values(user.roles).includes('team_member')) {
            return (
                <TeamRoutes />
            );
        } else if ((user.roles != undefined) && Object.values(user.roles).includes('customer')) {
            return (
                <CustomerRoutes />
            );
        } else{
            return null
        }
    }
}


MainContent.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps)(MainContent));