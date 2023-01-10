import React, { Component } from 'react';
import { SET_COOKIE , GET_STORAGE, USER} from '../Constants/AppConstants';
import { connect } from 'react-redux';
import { addFlashMessage } from '../Store/actions/flashMessages';
import history from '../history';
import PropTypes from 'prop-types';
import { logout } from '../Store/actions/loginActions';

export default function (ComposedComponent){
    class Authenticate extends Component {
        componentDidMount(){
            
            // Save master affiliate refered code
            const refCode = this.props.location.search.substring(4);
            if(refCode) {
                SET_COOKIE('af', refCode);
            }

            if(!this.props.isAuthenticated){
                // this.props.addFlashMessage({
                //     type:'error',
                //     text: 'You need to login to access this page'
                // });
                history.push('/login');
            }else{
                if(!Object.values(this.props.user.roles).includes('distributor')){
                    this.props.logout();
                }else{
                    if(this.props.user.sales_agent_feature === 'enable'){}else{
                        history.push('/');
                    }
                }
            }

            this.checkW9FormInformationMissing();
        }

        componentDidUpdate(nextProps){
            if(!nextProps.isAuthenticated){
                history.push('/login');
            }

            this.checkW9FormInformationMissing();
        }


        checkW9FormInformationMissing =()=> {
            const cur_url = window.location.pathname;
            let c_user_data = JSON.parse(GET_STORAGE(USER));
            if(
                c_user_data.w9_form_information_missing=='yes' &&
                c_user_data.roles.includes('distributor') && 
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
        user: PropTypes.object.isRequired,
        addFlashMessage: PropTypes.func.isRequired,
        logout:PropTypes.func.isRequired
    }

    function mapStateToProps(state) {
        return{
            isAuthenticated: state.auth.isAuthenticated,
            user: state.auth.user
        }
    }
    
    return connect(mapStateToProps, { addFlashMessage, logout })(Authenticate);
}
