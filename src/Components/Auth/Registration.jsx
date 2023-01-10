import React, { PureComponent, Fragment } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { userSignupRequest } from '../../Store/actions/signupActions';
import { logout } from '../../Store/actions/loginActions';
import RegistrationForm from './RegistrationForm';
import history from '../../history';
import { AJAX_REQUEST } from '../../Constants/AppConstants';

class Registration extends PureComponent {
    constructor(props) {
        super(props);
        document.title = "Registration - Prestige Labs";
        if(this.props.isAuthenticated){
            AJAX_REQUEST("POST","user/details",{}).then(results => {
                const response = results.response;
                if(parseInt(response.code)===1000){
                    history.push('/');
                }else{
                    this.props.logout();
                }
            });
        }
        this.state = {
            loading:true
        }
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        this.setState({
            loading:false
        });
    }

    render() { 
        const { userSignupRequest } = this.props;
        return (
            <Fragment>
                {
                        this.state.loading ? 
                        <div className="loading container full_page_loader"></div>
                        :
                    <React.Fragment>
                        <div className="container">
                            <div className="rows">
                                <main className="site-content">
                                    <div className="page-content entry-content user_registration">
                                        <div className="page-title">Registration</div>
                                        <RegistrationForm  userSignupRequest={userSignupRequest} />
                                    </div>
                                </main>
                            </div>
                        </div>
                    </React.Fragment>
                }
            </Fragment>
        );
    }
}


Registration.propTypes = {
    userSignupRequest:PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    logout:PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return{
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, { userSignupRequest, logout })(Registration);