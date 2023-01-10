import React, { PureComponent, Fragment } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import history from '../../history';
import { logout } from '../../Store/actions/loginActions';
import { alertMessageRemoval } from '../../Store/actions/signupActions';
import Parser from 'html-react-parser';

import { ECOM_URL, AJAX_REQUEST, DELETE_COOKIE, PUBLIC_URL, SITE, GET_COOKIE, ENABLE_NEW_LOGIN } from '../../Constants/AppConstants';


class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            title: '',
            disclaimer_text: '',
            content: '',
            button_text: '',
            video_embed: '',
            agreement_text: '',
            registration_link: PUBLIC_URL
        }
        if (this.props.isAuthenticated) {
            AJAX_REQUEST("POST", "user/details", {}).then(results => {
                const response = results.response;
                if (parseInt(response.code) === 1000) {
                    history.push('/');
                } else {
                    this.props.logout();
                }
            });
        }
        document.title = "Login - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();

        if (GET_COOKIE("af") != "") {
            this.setState({
                registration_link: PUBLIC_URL + "affiliate-signup-request?af=" + GET_COOKIE("af") + '&site=' + SITE
            })
        } else {
            this.setState({
                registration_link: PUBLIC_URL + 'affiliate-signup-request?site=' + SITE
            })
        }

        AJAX_REQUEST("POST", "distributor/getSignupSettings", {}).then(results => {
            const response = results.response;
            if (parseInt(response.code) === 1000) {
                this.setState({
                    title: response.data.title,
                    disclaimer_text: response.data.disclaimer_text,
                    content: response.data.content,
                    button_text: response.data.button_text,
                    video_embed: response.data.video_embed,
                    agreement_text: response.data.agreement_text,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        });
    }

    clickRegistration = (e) => {
        e.preventDefault();
        DELETE_COOKIE("af");
        window.location.href = this.state.registration_link;
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading container full_page_loader"></div>
                        :

                        <div className="container user_login_join_video_margin">
                            {
                                ENABLE_NEW_LOGIN ?
                                    <Fragment>
                                        <div className="row">
                                            <div className="col-md-12 text-center">
                                                <div className="user_login_join_video">
                                                    {
                                                        (this.state.video_embed != null) && (this.state.video_embed != '') ?
                                                            <Fragment>
                                                                {Parser(this.state.video_embed)}
                                                            </Fragment>
                                                            : ''
                                                    }

                                                    {/* <div className="wistia_embed wistia_async_rpyx2ikvy4 popover=true popoverAnimateThumbnail=true" style={{display:'inline-block', height:'200px', position:'relative', width:'100%',}}>&nbsp;</div> */}
                                                    {/* <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, </p> */}
                                                    {/* <button href={this.state.registration_link} className="cus_button cus_signup_button" onClick={this.clickRegistration} onClick={this.clickRegistration}> {this.state.button_text}</button> */}
                                                    {/* <button type="submit" className="cus_button cus_signup_button" name="login" value="Login">Sign Up</button> */}
                                                    {
                                                        (this.state.content != null) && (this.state.content != '') ?
                                                            <p className="user_login_join_content">{Parser(this.state.content)}</p>
                                                            : ''
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <main className="">
                                                    <div className="user_login user_login-new">
                                                        <h2 className="montserrat">Login</h2>
                                                        <p className="montserrat-disclaimer-text">&nbsp;</p>
                                                        <LoginForm />
                                                        <div className="clearfix"></div>
                                                        <span className="return_to_main_site"><a href={ECOM_URL}>Return to main site</a></span>
                                                    </div>
                                                </main>
                                            </div>

                                            <div className="col-md-6">
                                                <main className="">
                                                    <div className="user_login user_login_join">
                                                        <h2 className="montserrat">{this.state.title}</h2>
                                                        <p className="montserrat-disclaimer-text">&nbsp; &nbsp; {this.state.disclaimer_text}</p>
                                                        <RegistrationForm agreement_text={this.state.agreement_text} />
                                                        <div className="clearfix"></div>
                                                        {/* <span className="return_to_main_site"><a href={ECOM_URL}>Return to main site</a></span> */}
                                                    </div>
                                                </main>
                                            </div>
                                        </div>
                                    </Fragment>
                                    :
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <main className="">
                                                    <div className="user_login">
                                                        <h2 className="montserrat">Login</h2>
                                                        <LoginForm />
                                                        <div className="clearfix"></div>
                                                        <span className="return_to_main_site"><a href={ECOM_URL}>Return to main site</a></span>
                                                    </div>
                                                </main>
                                            </div>
                                        </div>
                                    </div>
                            }



                        </div>
                }
            </Fragment>
        );
    }
}

Login.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    alertMessageRemoval: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, { logout, alertMessageRemoval })(Login);

// export default Login;