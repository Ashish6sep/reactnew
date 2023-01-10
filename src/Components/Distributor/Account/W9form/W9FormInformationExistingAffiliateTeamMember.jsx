import React, { Component, Fragment } from 'react';
import { API_KEY, AJAX_REQUEST, GET_COOKIE, DISTRIBUTOR_URL, GET_STORAGE, USER, SET_STORAGE} from "../../../../Constants/AppConstants";
import AlertWrapper from '../../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../../Common/AlertWrapperSuccess';
import $ from 'jquery';
import history from "../../../../history";
import SignatureCanvas from 'react-signature-canvas';
import Modal, {closeStyle} from 'simple-react-modal';
import validateW9FormExisingAffiliate from '../../../../Validations/validateW9FormExisingAffiliate';
import classnames from 'classnames';
import Parser from 'html-react-parser';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setCurrentUser } from '../../../../Store/actions/loginActions';

class W9FormInformationExistingAffiliateTeamMember extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            w9_form_information_missing: 'yes',
            w9_form_information_missing_msg: 'abc',
        }
        document.title = "Tax Form Information -Prestige Labs";
    }

    componentDidMount() {
        this.setState({
            loading: false,
            w9_form_information_missing: this.props.auth.user.w9_form_information_missing,
            w9_form_information_missing_msg: this.props.auth.user.w9_form_information_missing_msg
        });

        if(this.props.auth.user.w9_form_information_missing=='no') {
            history.push('/my-account')
        }
    }

    
    render() {
        return (
            <Fragment>
                {
                    this.state.loading ? 
                    <div className="loading"></div>
                    :
                    <Fragment>
                        <div className="woocommerce-MyAccount-content inner_content w9_form">
                            <h2 className="montserrat page-title">
                                Tax Form Information
                            </h2>
                            <Fragment>
                                <div className="registration-form">

                                    {
                                        (this.state.w9_form_information_missing=='yes') ?
                                            <div className="alert-wrapper alert-error">
                                                <ul className="alert-error">
                                                    <li className='text-danger'><i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{Parser(this.state.w9_form_information_missing_msg)}</li>
                                                </ul>
                                            </div>
                                        :""
                                    }   
                                </div>
                            </Fragment>
                        </div>
                    </Fragment>
                }
            </Fragment>
        );
    }
}


W9FormInformationExistingAffiliateTeamMember.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps)(W9FormInformationExistingAffiliateTeamMember);