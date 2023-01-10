import React, { Component } from "react";
import classnames from "classnames";
import Parser from "html-react-parser";
import { SET_STORAGE, GET_STORAGE, USER } from '../../Constants/AppConstants';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { alertMessageRemoval } from '../../Store/actions/signupActions';

class AlertWrapperWarningClose extends Component {
  constructor(props) {
    super(props);
  }

  onClickEvent = () => {
    let user_storage_update = JSON.parse(GET_STORAGE(USER));
    if (user_storage_update) {
      user_storage_update.alert_message = "";
      SET_STORAGE(USER, JSON.stringify(user_storage_update));
      this.props.alertMessageRemoval();
    }
  };

  render() {
    if (this.props.auth) {
        if(this.props.auth.showAlertMessage){
            return (
                <div className="container">
                <div
                    className={classnames(
                    "warning_c_alert_wrapper alert alert-danger",
                    { warning_wrapper_show: this.props.auth.showAlertMessage }
                    )}
                >
                    <span>
                    <i className="fa fa-info-circle" /> &nbsp;
                    {Parser(this.props.auth.user.alert_message)}
                    </span>
                    <button
                    onClick={this.onClickEvent}
                    className="close warning_c_alert_close"
                    id="globalMessageBtn"
                    >
                    <span>&times;</span>
                    </button>
                </div>
                </div>
            );
        }else{
            return <React.Fragment />;
        }
    } else {
      return <React.Fragment />;
    }
  }
}

// export default AlertWrapperWarningClose;

AlertWrapperWarningClose.propTypes = {
    auth: PropTypes.object.isRequired,
    alertMessageRemoval:PropTypes.func.isRequired,
}
  
function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps, { alertMessageRemoval })(AlertWrapperWarningClose);
