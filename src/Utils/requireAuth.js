import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFlashMessage } from '../Store/actions/flashMessages';
import history from '../history';
import PropTypes from 'prop-types';
import { GET_STORAGE, USER } from "../Constants/AppConstants";

export default function (ComposedComponent){
    class Authenticate extends Component {
        componentDidMount(){
            if(!this.props.isAuthenticated){
                let currentTime = new Date().getTime();
                history.push('/login?t='+currentTime);
            }
            this.checkW9FormInformationMissing();
        }

        componentDidUpdate(nextProps){
            if(!nextProps.isAuthenticated){
                let currentTime = new Date().getTime();
                history.push('/login?t='+currentTime);
            }
            this.checkW9FormInformationMissing();
        }

        checkW9FormInformationMissing =()=> {
            const cur_url = window.location.pathname;
            let c_user_data = JSON.parse(GET_STORAGE(USER));
            if(c_user_data &&
                c_user_data.w9_form_information_missing=='yes' &&
                (c_user_data.roles.includes('distributor') || c_user_data.roles.includes('team_member')) && 
                cur_url != '/my-account/w-9-form-information-existing-affiliate'
            ) {   
                const urlParams = new URLSearchParams(window.location.search);
                const w9updated = urlParams.get('w9updated');
                if(w9updated == undefined || w9updated !='yes') {
                    history.push('/my-account/w-9-form-information-existing-affiliate');
                }                
            }     
        }

        render() { 
            return (
                <ComposedComponent {...this.props} />
            );
        }
    }

    Authenticate.propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        addFlashMessage: PropTypes.func.isRequired
    }

    function mapStateToProps(state) {
        return{
            isAuthenticated: state.auth.isAuthenticated,
            user: state.auth.user,
        }
    }
    
    return connect(mapStateToProps, { addFlashMessage })(Authenticate);
}
