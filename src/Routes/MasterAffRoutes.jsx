import React from 'react';
import { Route, Switch } from 'react-router-dom';
import requireMasterAffAuth from '../Utils/requireMasterAffAuth';

import Dashboard from '../Components/MasterAffiliate/Account/Dashboard';
import DistributorList from '../Components/MasterAffiliate/Account/DistributorList';
import CommissionEarned from '../Components/MasterAffiliate/Account/CommissionEarned';
import CommissionAdjustmentDetails from '../Components/MasterAffiliate/Account/CommissionAdjustmentDetails';
import CommissionEarnedDetails from '../Components/MasterAffiliate/Account/CommissionEarnedDetails';
import CommissionRealTimeEarnings from '../Components/MasterAffiliate/Account/CommissionRealTimeEarnings';
import PaymentReceived from '../Components/MasterAffiliate/Account/PaymentReceived';
import PageNotFound from '../Components/Pages/PageNotFound';
import EditAccount from '../Components/MasterAffiliate/Account/EditAccount';
import W9Form from '../Components/MasterAffiliate/Account/W9form/W9Form';
import PaypalAccount from '../Components/MasterAffiliate/Account/PaypalAccount';

const MasterAffRoutes = () => {
    const cur_url = window.location.href;
    return (
        <Switch>
            <Route path='/my-affiliate-account' component={requireMasterAffAuth(Dashboard)} exact strict />
            <Route path='/my-affiliate-account/affiliate-list' component={requireMasterAffAuth(DistributorList)} exact strict />
            <Route path='/my-affiliate-account/commission-real-time-earnings' component={requireMasterAffAuth(CommissionRealTimeEarnings)} exact strict />
            <Route path='/my-affiliate-account/commission-earned-details/:id' component={requireMasterAffAuth(CommissionEarnedDetails)} exact strict />
            <Route path='/my-affiliate-account/commission-earned' component={requireMasterAffAuth(CommissionEarned)} exact strict />
            <Route path='/my-affiliate-account/commission-earned/adjustment-details/:id' component={requireMasterAffAuth(CommissionAdjustmentDetails)} exact strict />
            <Route path='/my-affiliate-account/payment-received' component={requireMasterAffAuth(PaymentReceived)} exact strict />
            <Route path='/my-affiliate-account/w-9-form' component={requireMasterAffAuth(W9Form)} exact strict />
            <Route path='/my-affiliate-account/paypal-account' component={requireMasterAffAuth(PaypalAccount)} exact strict />
            <Route path='/my-affiliate-account/edit-account' component={requireMasterAffAuth(EditAccount)} exact strict />
            {
                (cur_url.match(/my-affiliate-account/g)) ?
                    <Route component={PageNotFound} exact strict />
                    : ""
            }

        </Switch>
    );
};

export default MasterAffRoutes;