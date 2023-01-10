import React from 'react';
import { Route, Switch } from 'react-router-dom';
import requireTeamAuth from '../Utils/requireTeamAuth';


import MyAccount from '../Components/TeamMember/Account/MyAccount';
import ChangingAddress from '../Components/TeamMember/Account/ChangingAddress';
import ActiveSubscription from '../Components/TeamMember/Account/ActiveSubscription';
import OrderByMe from '../Components/TeamMember/Account/OrderByMe';
import ViewOrder from '../Components/TeamMember/Account/ViewOrder';
import SubscriptionsOrders from '../Components/TeamMember/Account/SubscriptionsOrders';
import CanceledSubscriptions from '../Components/TeamMember/Account/CanceledSubscriptions';
import FailedSubscriptions from '../Components/TeamMember/Account/FailedSubscriptions';
// import AffiliateOrder from '../Components/TeamMember/Account/AffiliateOrder';
import CommissionPayout from '../Components/TeamMember/Account/CommissionPayout';
import CommissionPayoutDetails from '../Components/TeamMember/Account/CommissionPayoutDetails';
import CommissionPayoutEarned from '../Components/TeamMember/Account/CommissionPayoutEarned';
import ProductReferLink from '../Components/TeamMember/Account/ProductReferLink';
import EditAddresses from '../Components/TeamMember/Account/EditAddresses';
import EditBillingAddress from '../Components/TeamMember/Account/EditBillingAddress';
import EditShippingAddress from '../Components/TeamMember/Account/EditShippingAddress';
import EditAccount from '../Components/TeamMember/Account/EditAccount';
import SubscriptionsOrderView from '../Components/TeamMember/Account/SubscriptionsOrderView';
import PageNotFound from '../Components/Pages/PageNotFound';
import W9FormInformationExistingAffiliate from '../Components/Distributor/Account/W9form/W9FormInformationExistingAffiliateTeamMember';

const TeamRoutes = () => {
    const cur_url = window.location.href;
    return (
        <Switch>
            <Route path='/my-account/edit-address/shipping/:subscription_id' component={requireTeamAuth(ChangingAddress)} exact strict />
            <Route path='/my-account/view-order' component={requireTeamAuth(OrderByMe)} exact strict />
            <Route path='/my-account/view-order/:id' component={requireTeamAuth(ViewOrder)} exact strict />
            <Route path='/my-account/subscription-order' component={requireTeamAuth(SubscriptionsOrders)} exact strict />
            <Route path='/my-account/subscription-order/active-subscription' component={requireTeamAuth(ActiveSubscription)} exact strict />
            <Route path='/my-account/subscription-order-view/:subscription_id' component={requireTeamAuth(SubscriptionsOrderView)} exact strict />
            <Route path='/my-account/canceled-subscription' component={requireTeamAuth(CanceledSubscriptions)} exact strict />
            <Route path='/my-account/failed-subscription' component={requireTeamAuth(FailedSubscriptions)} exact strict />
            {/* <Route path='/my-account/affiliate-order' component={requireTeamAuth(AffiliateOrder)} exact strict /> */}
            <Route path='/my-account/commission-payout/all-commission' component={requireTeamAuth(CommissionPayoutEarned)} exact strict />
            <Route path='/my-account/commission-payout/:id' component={requireTeamAuth(CommissionPayoutDetails)} exact strict />
            <Route path='/my-account/commission-payout' component={requireTeamAuth(CommissionPayout)} exact strict />
            <Route path='/my-account/product-refer-link' component={requireTeamAuth(ProductReferLink)} exact strict />
            <Route path='/my-account/edit-account' component={requireTeamAuth(EditAccount)} exact strict />
            <Route path='/my-account' component={requireTeamAuth(MyAccount)} exact strict />
            <Route path='/my-account/w-9-form-information-existing-affiliate' component={requireTeamAuth(W9FormInformationExistingAffiliate)} exact strict />
            {
                (cur_url.match(/my-account/g)) ?
                    <Route component={PageNotFound} exact strict />
                    : ""
            }
        </Switch>
    );
};

export default TeamRoutes;