import React, { PureComponent, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { API_KEY, GET_COOKIE, GET_STORAGE, DELETE_COOKIE, AJAX_PUBLIC_REQUEST, AJAX_REQUEST_WITH_FILE, SET_STORAGE, USER, CUSTOMER_URL } from '../../Constants/AppConstants';

import { connect } from 'react-redux';
import PropTypes from "prop-types";
import Parser from 'html-react-parser';

import { affiliateSignupRequest } from '../../Store/actions/signupActions';
import AlertWrapper from '../Common/AlertWrapper';
import AlertWrapperSuccess from '../Common/AlertWrapperSuccess';
import history from '../../history';

class AffiliateRequest extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            page: '',
            isLoading: false,
            isFormValid: true,
            success_alert_wrapper_show: false,
            server_message: ''
        }
        document.title = "Refer Friends to Join Prestige Labs - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        // this.getPageContent();
        this.setState({
            loading: false
        });
    }

    // getPageContent = (e) => {
    //     this.setState({ loading:true });
    //     document.querySelector("body").scrollIntoView();
    //     AJAX_PUBLIC_REQUEST("POST", "page/getContents", {page_slug:this.props.match.params.slug}).then(results => {
    //         if(parseInt(results.response.code)===1000) {
    //             this.setState({
    //                 page: results.response.data,
    //                 loading:false,
    //             });
    //         } else {
    //             this.setState({ 
    //                 error: Parser("<p className='text-danger'>"+results.response.message+"</p>"),
    //                 loading:false,
    //             })
    //         }            
    //     });
    // }

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                success_alert_wrapper_show: false
            });
            history.push('/my-affiliate-account');
        }.bind(this),timedata);
    }


    applyNow = (e) => {
        e.preventDefault();
        this.setState({
            server_message: '',
            isLoading: true,
            isFormValid: true,
            success_alert_wrapper_show: false
        });
        let data = new FormData();
        data.append('api_key', API_KEY);

        this.props.affiliateSignupRequest(data).then(results => {
            if (results.response.code === 1000) {
                this.setState({
                    server_message: results.response.message,
                    isLoading: false,
                    isFormValid: true,
                    success_alert_wrapper_show: true
                });
                this.timeOut(5000);
            } else if (results.response.code === 4001) {
                this.setState({
                    server_message: results.response.message,
                    isLoading: false,
                    isFormValid: false,
                    success_alert_wrapper_show: false
                });
                setTimeout(function () {
                    history.push('login');
                }.bind(this), 5000)
            } else {
                this.setState({
                    server_message: results.response.message,
                    isLoading: false,
                    isFormValid: false,
                    success_alert_wrapper_show: false
                });
            }
            document.querySelector("body").scrollIntoView();
        });
    }

    render() {
        const { server_message } = this.state;

        const errors_data = server_message;
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
                                        <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                        <AlertWrapperSuccess errors_data={server_message} success_alert_wrapper_show={this.state.success_alert_wrapper_show} />
                                        {/* <div className="page-content entry-content">
                                        <div className="montserrat page-title">{ this.state.page.hasOwnProperty('title')? Parser(this.state.page.title) : this.state.error }</div>
                                        { this.state.page.hasOwnProperty('contents')? Parser(this.state.page.contents) : this.state.error }
                                    </div> */}
                                        <div className="page-content entry-content">
                                            <div className="text-center montserrat page-title">Ready To Rule The Jungle</div>
                                            <div className="montserrat ruleTheJungle">
                                                <p>
                                                    Ever wish you could earn even MORE money from Prestige Labs WITHOUT doing more group selling, one-on-one selling, answering all the questions about the products, or increasing the number of people in your facility?
                                                </p>
                                                <p>Now you can.</p>
                                                <p> Here’s how:</p>
                                                <p>
                                                    We’re now going to give you the ability to build your OWN Den of Prestige Labs Lions.  Instead of you doing all of the heavy lifting, you can now recruit people you know would be a great fit to sell Prestige Labs.
                                                </p>
                                                <p>
                                                    Why is this a big deal?
                                                </p>
                                                <p>
                                                    There’s an old saying that goes something like this…
                                                </p>
                                                <p className="text-center">
                                                    <strong>“I’d rather earn 1% of 100 people’s efforts than 100% of my own”</strong>
                                                </p>
                                                <p className="">
                                                    That’s true leverage. And instead of just offering you 1% of others’ efforts, we want to offer you  <strong>5%!</strong>
                                                </p>
                                                <p className="">
                                                    Your lions will have access to the exact same systems and processes that you’ve got to sell Prestige Labs products.  All you’ve got to do is coach them on best practices and help them earn more money.
                                                </p>
                                                <p className=""> A true win win.</p>
                                                <p className=""> Here are the guidelines: </p>
                                                <div className="">
                                                    <ol>
                                                        <li><span><strong>These sales won’t appear on the leaderboards with other standard Affiliates.</strong>  Only your own personal sales will appear. You’ll already have an unfair advantage and we’d like to continue to create an environment of success.</span></li>
                                                        <li><span><strong>Master Affiliate earnings won’t be eligible for sales contests unless specifically stated.</strong></span></li>
                                                        <li><span><strong>Activity will appear on a secondary dashboard</strong> so you can track income earned separately from your own business’s earnings. All under 1 login. You can even set up a separate W9 and PayPal account if needed! Easier to track, easier to identify where to put your effort, and easier to allocate money and resources.</span></li>
                                                        <li><span><strong>5% override calculation</strong> - does not cut into the referred party's commission, just ours</span></li>
                                                        <li><span><strong>No paid advertising with your Referral Link!</strong></span></li>
                                                        <li><span><strong>Share the link and start earning!</strong> All referrals subject to application approval by the Prestige Labs team</span></li>
                                                        <li><span><strong>Encourage/help your referrals to sell</strong> so you can leverage your time and help others earn as well</span></li>
                                                        <li><span><strong>This is NOT an MLM structure.</strong> There are *not* multiple levels of referral income.  You get paid only from your direct referrals</span></li>
                                                    </ol>
                                                </div>
                                                <div className="text-center">
                                                    <button onClick={this.applyNow} className="roboto_condensed cus_button signup-form">{this.state.isLoading ? "Please Wait..." : "Get Started"}</button>
                                                </div>
                                            </div>
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

// export default AffiliateRequest;
AffiliateRequest.propTypes = {
    affiliateSignupRequest: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, { affiliateSignupRequest })(AffiliateRequest);