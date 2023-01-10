import React, { Component } from 'react';
import { SET_COOKIE, ENABLE_MEAL, ENABLE_AFFILIATE_REQUEST, AJAX_PUBLIC_REQUEST } from '../Constants/AppConstants';
import { Route, Switch } from 'react-router-dom';
import requireAuth from '../Utils/requireAuth';
import requireDistAuth from '../Utils/requireDistAuth';
import requireCustAuth from '../Utils/requireCustAuth';
import requireMasterAffAuth from '../Utils/requireMasterAffAuth';
import requireTeamAuth from '../Utils/requireTeamAuth';
import requireDistTeamAuth from '../Utils/requireDistTeamAuth';

import Login from '../Components/Auth/Login';
import LoginNew from '../Components/Auth/LoginNew';
import Registration from '../Components/Auth/Registration';
import ServiceLogin from '../Components/Auth/ServiceLogin';
import PasswordReset from '../Components/Auth/PasswordReset';
import NewPasswordReset from '../Components/Auth/NewPasswordReset';
import GetInTouch from '../Components/Pages/GetInTouch';
import AffiliateCanadianTaxCommissions from '../Components/Pages/AffiliateCanadianTaxCommissions';
import OrderPage from '../Components/Orders/OrderPage';
import Meals from '../Components/Orders/Meals/Meals';
import Reorder from '../Components/Orders/Reorder';
import CartPage from '../Components/Orders/CartPage';
import CheckOut from '../Components/Orders/CheckOut';
import OrderReceived from '../Components/Orders/OrderReceived';
import SubscriptionItem from '../Components/Orders/SubscriptionItem';
import SubscriptionCart from '../Components/Orders/SubscriptionCart';
import W9TaxForm from '../Components/Pages/W9TaxForm';
import W9TaxFormCanadian from '../Components/Pages/W9TaxFormCanadian';
import DistributorAgreement from '../Components/Pages/DistributorAgreement';
import Page from "../Components/Pages/Page";
import CancellationProcess from "../Components/Pages/CancellationProcess";
import PageNotFound from '../Components/Pages/PageNotFound';
import AffiliateRequest from '../Components/Auth/AffiliateRequest';
import Downtime from '../Components/Pages/Downtime';
import ActivateMeal from '../Components/Pages/ActivateMeal';

import Training from '../Components/Training/Training';
import CourseDetails from '../Components/Training/CourseDetails';
import LessonDetails from '../Components/Training/LessonDetails';
import NewAgreement from '../Components/Distributor/Account/NewAgreement';
import NewAgreementForm from '../Components/Pages/NewAgreementForm';

// import TrainingDownload from '../Components/Training/TrainingDownload';
// import TrainingVideo from '../Components/Training/TrainingVideo';
// import TrainingList from '../Components/Training/TrainingList';
import TrainingQuiz from '../Components/Training/TrainingQuiz';


class CommonRoutes extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const cur_url = window.location.href;
        return (
            <Switch>
                {/* <Route path='/login' component={Login} exact strict /> */}
                {/* <Route path='/login-new' component={LoginNew} exact strict /> */}
                <Route path='/login' component={LoginNew} exact strict />
                {/* <Route path='/registration' component={Registration} exact strict /> */}
                <Route path='/serviceLogin' component={ServiceLogin} exact strict />
                <Route path='/password-reset' component={PasswordReset} exact strict />
                <Route path='/password-reset/:code' component={NewPasswordReset} exact strict />
                <Route path='/contact' component={GetInTouch} exact strict />
                <Route path='/affiliate-canadian-tax--commissions' component={AffiliateCanadianTaxCommissions} exact strict />
                <Route path='/' component={requireAuth(OrderPage)} exact />
                <Route path='/meals' component={requireAuth(Meals)} exact />
                {/* {
                    ENABLE_MEAL ?
                        <Route path='/meals' component={requireAuth(Meals)} exact />
                        : ''
                } */}
                {/*<Route path='/w-9-tax-form' component={W9TaxForm} exact strict />
                <Route path='/w-9-tax-form-ca' component={W9TaxFormCanadian} exact strict />*/}
                <Route path='/affiliate-agreement' component={DistributorAgreement} exact strict />
                {
                    ENABLE_AFFILIATE_REQUEST ?
                        <Route path='/affiliate-request' component={requireDistAuth(AffiliateRequest)} exact strict />
                        : ''
                }
                <Route path='/agreement' component={requireDistAuth(NewAgreement)} exact strict />
                <Route path='/agreement-form' component={NewAgreementForm} exact strict />
                <Route path='/cancellation-process' component={CancellationProcess} exact strict />
                <Route path='/reorder/:order_id' component={requireDistTeamAuth(Reorder)} exact strict />
                <Route path='/cart' component={requireDistTeamAuth(CartPage)} exact strict />
                <Route path='/checkout' component={requireDistTeamAuth(CheckOut)} exact strict />
                <Route path='/order-received/:order_id' component={requireDistTeamAuth(OrderReceived)} exact strict />
                <Route path='/subscription-item/:id' component={requireDistTeamAuth(SubscriptionItem)} exact strict />
                <Route path='/subscription-cart/:id' component={requireDistTeamAuth(SubscriptionCart)} exact strict />
                <Route path='/page/:slug' component={Page} exact strict />

                <Route path='/training' component={Training} exact strict />

                {/* <Route path='/training/download' component={TrainingDownload} exact strict />
                <Route path='/training/video' component={TrainingVideo} exact strict />
                <Route path='/training/list' component={TrainingList} exact strict /> */}

                <Route path='/training/quiz/:course_id/:lesson_id/:quiz_id' component={TrainingQuiz} exact strict />

                <Route path='/training/lesson/:course_id/:lesson_id' component={LessonDetails} exact strict />
                <Route path='/training/:course_id' component={CourseDetails} exact strict />

                <Route path='/error' component={Downtime} exact strict />
                <Route path='/activate-meal' component={ActivateMeal} exact strict />

                {
                    (cur_url.match(/my-account/g) || cur_url.match(/my-affiliate-account/g)) ? ""
                        : <Route component={PageNotFound} exact strict />
                }
            </Switch>
        );
    }
}


export default CommonRoutes;