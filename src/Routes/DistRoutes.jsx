import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { GET_STORAGE } from '../Constants/AppConstants';
import requireDistAuth from '../Utils/requireDistAuth';
import requireDistAuthAgent from '../Utils/requireDistAuthAgent';

import MyAccount from '../Components/Distributor/Account/MyAccount';
import ChangingAddress from '../Components/Distributor/Account/ChangingAddress';
import ActiveSubscription from '../Components/Distributor/Account/ActiveSubscription';
import OrderByMe from '../Components/Distributor/Account/OrderByMe';
import ViewOrder from '../Components/Distributor/Account/ViewOrder';
import SubscriptionsOrders from '../Components/Distributor/Account/SubscriptionsOrders';
import CanceledSubscriptions from '../Components/Distributor/Account/CanceledSubscriptions';
import FailedSubscriptions from '../Components/Distributor/Account/FailedSubscriptions';
// import AffiliateOrder from '../Components/Distributor/Account/_AffiliateOrder-24.06.2019';
import StatisticsReports from '../Components/Distributor/Account/StatisticsReports';
import Leaderboard from '../Components/Distributor/Account/Leaderboard';
import CommissionPayout from '../Components/Distributor/Account/CommissionPayout';
import CommissionAdjustmentDetails from '../Components/Distributor/Account/CommissionAdjustmentDetails';
import CommissionPayoutDetails from '../Components/Distributor/Account/CommissionPayoutDetails';
import CommissionCoupon from '../Components/Distributor/Account/CommissionCoupon';
import CommissionCouponDetails from '../Components/Distributor/Account/CommissionCouponDetails';
// import CommissionPayoutEarned from '../Components/Distributor/Account/CommissionPayoutEarned';
import ProductReferLink from '../Components/Distributor/Account/ProductReferLink';
import ZeroOutCommission from '../Components/Distributor/Account/ZeroOutCommission';
import PaymentReceived from '../Components/Distributor/Account/PaymentReceived';
import ManageRepresentative from '../Components/Distributor/Account/Member/ManageRepresentative';
import ManageRepresentativeAdd from '../Components/Distributor/Account/Member/ManageRepresentativeAdd';
import ManageRepresentativeEdit from '../Components/Distributor/Account/Member/ManageRepresentativeEdit';
import ManageRepresentativeHandover from '../Components/Distributor/Account/Member/ManageRepresentativeHandover';
import RepresentativeDetails from '../Components/Distributor/Account/Member/RepresentativeDetails'
import MemberCommission from '../Components/Distributor/Account/MemberCommission/MemberCommission';
import MemberCommissionDetails from '../Components/Distributor/Account/MemberCommission/MemberCommissionDetails';
import TeamMemberRunningCommission from '../Components/Distributor/Account/MemberCommission/TeamMemberRunningCommission';
import W9Form from '../Components/Distributor/Account/W9form/W9Form';
import EditAccount from '../Components/Distributor/Account/EditAccount';
import Settings from '../Components/Distributor/Account/Settings';
import SubscriptionsOrderView from '../Components/Distributor/Account/SubscriptionsOrderView';
import PaypalAccount from '../Components/Distributor/Account/PaypalAccount';
import PageNotFound from '../Components/Pages/PageNotFound';
import CommissionPayoutMethod from '../Components/Distributor/Account/CommissionPayoutMethod';
import SubscriptionCancellation from '../Components/Distributor/Account/SubscriptionCancellation';
import SubscriptionCancellationDetails from '../Components/Distributor/Account/SubscriptionCancellationDetails';
import SubscriptionCancellationBillingUpdate from '../Components/Distributor/Account/SubscriptionCancellationBillingUpdate';
import SubscriptionCancellationConfirm from '../Components/Distributor/Account/SubscriptionCancellationConfirm';
import ChangeSubscriptionAddress from '../Components/Distributor/Account/ChangeSubscriptionAddress';
import MyCards from '../Components/Distributor/Account/MyCards';
import W9FormInformation from '../Components/Distributor/Account/W9form/W9FormInformation';
import W9FormInformationExistingAffiliate from '../Components/Distributor/Account/W9form/W9FormInformationExistingAffiliate';

const DistRoutes = () => {
    const cur_url = window.location.href;

    let settings = null;
    if (GET_STORAGE("settings")) {
        settings = JSON.parse(GET_STORAGE("settings"));
    }
    let commission_payout_settings_menu_show = 'no';
    if (settings && settings.hasOwnProperty('commission_payout_settings_menu_show')) {
        commission_payout_settings_menu_show = settings.commission_payout_settings_menu_show;
    }

    return (
        <Switch>
            <Route path='/my-account/edit-address/shipping/:subscription_id' component={requireDistAuth(ChangingAddress)} exact strict />
            <Route path='/my-account/view-order' component={requireDistAuth(OrderByMe)} exact strict />
            <Route path='/my-account/view-order/:id' component={requireDistAuth(ViewOrder)} exact strict />
            <Route path='/my-account/subscription-order' component={requireDistAuth(SubscriptionsOrders)} exact strict />
            <Route path='/my-account/subscription-order/active-subscription' component={requireDistAuth(ActiveSubscription)} exact strict />
            <Route path='/my-account/subscription-order-view/:subscription_id' component={requireDistAuth(SubscriptionsOrderView)} exact strict />
            <Route path='/my-account/canceled-subscription' component={requireDistAuth(CanceledSubscriptions)} exact strict />
            <Route path='/my-account/failed-subscription' component={requireDistAuth(FailedSubscriptions)} exact strict />
            {/* <Route path='/my-account/affiliate-order' component={requireDistAuth(AffiliateOrder)} exact strict /> */}
            <Route path='/my-account/statistics-reports' component={requireDistAuth(StatisticsReports)} exact strict />
            <Route path='/my-account/leaderboard' component={requireDistAuth(Leaderboard)} exact strict />
            {/* <Route path='/my-account/commission-payout/all-commission' component={requireDistAuth(CommissionPayoutEarned)} exact strict /> */}
            <Route path='/my-account/commission-payout/adjustment-details/:id' component={requireDistAuth(CommissionAdjustmentDetails)} exact strict />
            <Route path='/my-account/commission-payout/:id' component={requireDistAuth(CommissionPayoutDetails)} exact strict />
            <Route path='/my-account/commission-payout' component={requireDistAuth(CommissionPayout)} exact strict />
            <Route path='/my-account/commission-coupon/:id' component={requireDistAuth(CommissionCouponDetails)} exact strict />
            <Route path='/my-account/commission-coupon' component={requireDistAuth(CommissionCoupon)} exact strict />
            <Route path='/my-account/product-refer-link' component={requireDistAuth(ProductReferLink)} exact strict />
            <Route path='/my-account/zero-out-commission' component={requireDistAuth(ZeroOutCommission)} exact strict />
            <Route path='/my-account/payment-received' component={requireDistAuth(PaymentReceived)} exact strict />
            <Route path='/my-account/manage-representative' component={requireDistAuthAgent(ManageRepresentative)} exact strict />
            <Route path='/my-account/manage-representative/action/add' component={requireDistAuthAgent(ManageRepresentativeAdd)} exact strict />
            <Route path='/my-account/manage-representative/action/edit/:id' component={requireDistAuthAgent(ManageRepresentativeEdit)} exact strict />
            <Route path='/my-account/manage-representative/action/customer_handover/:id' component={requireDistAuthAgent(ManageRepresentativeHandover)} exact strict />
            <Route path='/my-account/manage-representative/:id' component={requireDistAuthAgent(RepresentativeDetails)} exact strict />
            <Route path='/my-account/member-commission' component={requireDistAuthAgent(MemberCommission)} exact strict />
            <Route path='/my-account/member-commission/running-commission' component={requireDistAuthAgent(TeamMemberRunningCommission)} exact strict />
            <Route path='/my-account/member-commission/:id' component={requireDistAuthAgent(MemberCommissionDetails)} exact strict />
            <Route path='/my-account/w-9-form' component={requireDistAuth(W9Form)} exact strict />
            <Route path='/my-account/paypal-account' component={requireDistAuth(PaypalAccount)} exact strict />
            <Route path='/my-account/edit-account' component={requireDistAuth(EditAccount)} exact strict />
            <Route path='/my-account/settings' component={requireDistAuth(Settings)} exact strict />

            <Route path='/my-account/subscription-cancellation/:subscription_id' component={requireDistAuthAgent(SubscriptionCancellation)} exact strict />
            <Route path='/my-account/subscription-cancellation/:subscription_id/details' component={requireDistAuthAgent(SubscriptionCancellationDetails)} exact strict />
            <Route path='/my-account/subscription-cancellation/:subscription_id/billing-update' component={requireDistAuthAgent(SubscriptionCancellationBillingUpdate)} exact strict />
            <Route path='/my-account/subscription-cancellation/:subscription_id/cancellation' component={requireDistAuthAgent(SubscriptionCancellationConfirm)} exact strict />
            <Route path='/my-account/change-subscription-address/:subscription_id' component={requireDistAuthAgent(ChangeSubscriptionAddress)} exact strict />
            <Route path='/my-account/my-cards' component={requireDistAuthAgent(MyCards)} exact strict />
            <Route path='/my-account/w-9-form-information' component={requireDistAuth(W9FormInformation)} exact strict />
            <Route path='/my-account/w-9-form-information-existing-affiliate' component={requireDistAuth(W9FormInformationExistingAffiliate)} exact strict />

            <Route path='/my-account' component={requireDistAuth(MyAccount)} exact strict />
            {
                (commission_payout_settings_menu_show == 'yes') ?
                    <Route path='/my-account/commission-payout-method' component={requireDistAuth(CommissionPayoutMethod)} exact strict />
                    : ""
            }
            {
                (cur_url.match(/my-account/g)) ?
                    <Route component={PageNotFound} exact strict />
                    : ""
            }
        </Switch>
    );
};

export default DistRoutes;