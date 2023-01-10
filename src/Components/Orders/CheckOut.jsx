import React, { Fragment, PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import $ from "jquery";
import { connect } from 'react-redux';
import {
    CRYPTO_ENCRYPTION,
    AJAX_REQUEST,
    AJAX_ACCOUNT_KIT_REQUEST,
    CURRENCY_FORMAT,
    CART_TOTAL_CURRENCY_FORMAT,
    COUNT_SUBSCRIPTION,
    SET_STORAGE,
    GET_STORAGE,
    REMOVE_STORAGE,
    CHECK_STORAGE,
    DESTROY_CART,
    NEXT_MONTH,
    NEXT_WEEK,
    MEAL_SUB_TOTAL,
    MEAL_TOTAL,
    CART_SUB_TOTAL,
    RECURRING_CART_SUB_TOTAL,
    COUPON_TOTAL,
    ITEM_COUNT,
    MEAL_COUNT,
    CanadaRestrictedProduct,
    AJAX_PUBLIC_REQUEST
} from "../../Constants/AppConstants";
import PropTypes from "prop-types";
import classnames from 'classnames';
import history from "../../history";
import Parser from 'html-react-parser';

import AccountKit from 'react-facebook-account-kit';

import { checkoutRequest } from '../../Store/actions/checkoutActions';
import checkoutValidate from '../../Validations/CheckoutValidate';
import AlertWrapper from '../Common/AlertWrapper';
import AlertWrapperSuccess from '../Common/AlertWrapperSuccess';
import CartMonths from '../Common/CartMonths';
import CartYears from '../Common/CartYears';
import PreventCheckoutModal from './PreventCheckoutModal';
// import ShippingSchedule from './Meals/ShippingSchedule';

class CheckOut extends PureComponent {
    constructor(props) {
        super(props);

        // Check Tax
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }
        const { user } = this.props.auth;

        this.state = {
            loading: true,
            error: '',
            affiliateErrorMessage: '',
            stockoutErrorMessage: '',
            subscriptionProductErrorMessage: '',
            terms_of_use: settings ? settings.internal_pages.terms_of_use : "/",
            privacy_policy: settings ? settings.internal_pages.privacy_policy : "/",
            // Facebook mobile verification
            phone_verification_on_checkout: user ? user.sms_verification_on_checkout : '',
            facebook_app_id: settings ? settings.facebook_app_id : '',
            account_kit_app_secret: settings ? settings.account_kit_app_secret : '',
            account_kit_api_version: settings ? settings.account_kit_api_version : '',
            // Check team member
            sales_agent_feature: user ? user.sales_agent_feature : '',

            // Check existing customer
            haveExistsUser: 1,
            password_check: 0,
            password: '',
            confirm_password: '',

            cartShippingCost: 0,
            recurringCartShippingCost: 0,
            cartTotal: 0,
            mealShippingCostStatus: true,

            taxStatus: settings ? settings.tax_status : 0,
            tax_amount: 0,
            tax_info: '',
            subscription_tax_amount: 0,
            subscription_tax_info: '',
            meal_tax_amount: 0,
            meal_tax_info: '',
            subscription_meal_tax_amount: 0,
            subscription_meal_tax_info: '',

            items: [],
            meals: [],
            coupons: [],
            shippingMethods: [],
            countryList: [],
            billingStateList: [],
            shippingStateList: [],
            teamMemberList: [],
            freeShipping: 0,
            taxFree: 0,
            show_coupon: false,
            coupon_code_button_loading: false,
            coupon_code: "",
            success_alert_wrapper_show: false,
            place_order_loading: false,

            // Billing Details
            billing_first_name: '',
            billing_last_name: '',
            billing_company: '',
            billing_country: '',
            billing_address_1: '',
            billing_address_2: '',
            billing_city: '',
            billing_state: '',
            billing_postcode: '',
            billing_phone: '',
            billing_email: '',

            // Address verify
            addressVerifyCode: false,
            continue_without_verify: 0,
            agree_to_receive_text: 'yes',
            send_promotion_update: 'no',
            team_member_id: '',

            // Different Shipping Address
            shippingAreaVisible: false,
            ship_to_different_address: 'no',

            shipping_first_name: '',
            shipping_last_name: '',
            shipping_company: '',
            shipping_country: '',
            shipping_address_1: '',
            shipping_address_2: '',
            shipping_city: '',
            shipping_state: '',
            shipping_postcode: '',

            order_note: '',
            session_id: '',
            force_order: 0,

            // Payment Method
            payment_method: (settings.payment_method) ? settings.payment_method : '',
            name_on_card: '',
            card_number: '',
            expire_month: '',
            expire_year: '',
            cvv: '',
            agreeTermsPolicy: false,

            // Validation
            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            server_message: '',

            //warning state
            productWarnings: [],
            warningProductCartKeys: [],
        }
        document.title = "CheckOut-Prestige Labs";

    }

    changeHandler = (e) => {
        if (e.target.name === 'name_on_card') {
            const name_on_card = e.target.value;
            this.setState({
                [e.target.name]: name_on_card.toUpperCase()
            })
        } else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    changeHandlerWithCallTax = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.getTax(this.state.ship_to_different_address);

        if(this.state.ship_to_different_address === 'checked'){
            if(e.target.name === 'shipping_state'){
                this.warningModalHandel(this.state.shipping_country, e.target.value);
            }
        }else if(e.target.name === 'billing_state'){
            this.warningModalHandel(this.state.billing_country,e.target.value);
        }
    }

    warningModalCancelHandel = (e) => {
        //console.log('warningModalCancelHandel click: ', this.state.warningProductCartKeys);
        const productKeys = (this.state.warningProductCartKeys) ? this.state.warningProductCartKeys : [];
        if(productKeys.length > 0){
            let cartItems = JSON.parse(GET_STORAGE("cart"));

            let newCart = [];
            if(cartItems.length > 0){
                cartItems.map(function (item, productKey) {
                    if(productKeys.includes(productKey)){
                        //console.log('cart item found: ', item);
                    }else{
                        newCart.push(item);
                    }
                })
            }

            //console.log('warningModalCancelHandel newCart: ', newCart);


            SET_STORAGE("cart", JSON.stringify(newCart));

            setTimeout(() => {
                $('#warningModal').modal('hide');
                //redirect to card page
                history.push("/cart");
            }, 100);

        }
    }
    warningModalHandel = (country, state) => {
        AJAX_PUBLIC_REQUEST("POST", "user/getWarnings", {}).then(results => {
            // console.log('cartItems results: ', results);

            if (parseInt(results.response.code) === 1000) {
                const warnings = (results.response.data) ? results.response.data : [];

                if(warnings.length > 0){
                    let warningContents = '';
                    let warningProductKeys = [];
                    const cartItems = JSON.parse(GET_STORAGE("cart"));

                    if(cartItems.length > 0){
                        cartItems.map(function (item, productKey) {
                            //console.log('cartItems item: ', item);
                            let productWarnings = '';
                            let cartProductId = item.cart_product_id;
                            let cartVariationId = item.cart_variation_id;
                            warnings.map(function (warning, key) {
                                //console.log('warning: ', warning);
                                //console.log('warning locations: ', warning.locations);
                                if(warning.status === 'active'){
                                    //check location
                                    if(warning.targeted_location === 'yes'){
                                        const locations = warning.locations;
                                        const locationStates = locations[country] ? locations[country] : [];
                                        if(locationStates.length > 0){
                                            if(locationStates.includes(state)){
                                                if(warning.targeted_location_type === 'show'){
                                                    //console.log('state found: ', state);
                                                    //check product
                                                    if(warning.targeted_product_type === 'all'){
                                                        if(productWarnings.length === 0){
                                                            warningProductKeys.push(productKey);
                                                            productWarnings += '<div class="d-flex align-items-start justify-content-center warning-block-border"><div class="d-flex flex-column align-items-center justify-content-center" style="width: 120px;padding-top: 12px;border: 1px solid #ddd"><img src="'+item.cart_image+'" width="90%" /> <p style="padding: 5px;font-size: 11px;line-height: 1.2;text-align: center;margin-bottom: 0!important;">'+item.cart_product_name+' - '+item.cart_variation_name+'</p></div><div class="d-flex flex-column w-100">';
                                                        }
                                                        productWarnings += '<div class="py-3 px-3 d-flex ml-2 border warning-message-text" style="background-color: '+warning.design.background+'"><div class="mr-3 d-flex align-items-center"><img src="'+warning.design.icon+'" width="50px"></div><div class="d-flex align-items-center"><div class="text-left warning-messages-block">'+warning.messages+'</div></div></div>';
                                                    }else if(warning.targeted_product_type === 'product'){//variation wise check
                                                        const productsIds = warning.products_ids;
                                                        if(productsIds.length > 0){
                                                            if(productsIds.includes(parseInt(cartProductId))){
                                                                if(productWarnings.length === 0){
                                                                    warningProductKeys.push(productKey);
                                                                    productWarnings += '<div class="d-flex align-items-start justify-content-center warning-block-border"><div class="d-flex flex-column align-items-center justify-content-center" style="width: 120px;padding-top: 12px;border: 1px solid #ddd"><img src="'+item.cart_image+'" width="90%" /> <p style="padding: 5px;font-size: 11px;line-height: 1.2;text-align: center;margin-bottom: 0!important;">'+item.cart_product_name+' - '+item.cart_variation_name+'</p></div><div class="d-flex flex-column w-100">';
                                                                }
                                                                productWarnings += '<div class="py-3 px-3 d-flex ml-2 border warning-message-text" style="background-color: '+warning.design.background+'"><div class="mr-3 d-flex align-items-center"><img src="'+warning.design.icon+'" width="50px"></div><div class="d-flex align-items-center"><div class="text-left warning-messages-block">'+warning.messages+'</div></div></div>';
                                                            }
                                                        }
                                                    }else if(warning.targeted_product_type === 'variation'){//variation wise check
                                                        const productsIds = warning.products_ids;
                                                        if(productsIds.length > 0){
                                                            if(productsIds.includes(parseInt(cartVariationId))){
                                                                if(productWarnings.length === 0){
                                                                    warningProductKeys.push(productKey);
                                                                    productWarnings += '<div class="d-flex align-items-start justify-content-center warning-block-border"><div class="d-flex flex-column align-items-center justify-content-center" style="width: 120px;padding-top: 12px;border: 1px solid #ddd"><img src="'+item.cart_image+'" width="90%" /> <p style="padding: 5px;font-size: 11px;line-height: 1.2;text-align: center;margin-bottom: 0!important;">'+item.cart_product_name+' - '+item.cart_variation_name+'</p></div><div class="d-flex flex-column w-100">';
                                                                }
                                                                productWarnings += '<div class="py-3 px-3 d-flex ml-2 border warning-message-text" style="background-color: '+warning.design.background+'"><div class="mr-3 d-flex align-items-center"><img src="'+warning.design.icon+'" width="50px"></div><div class="d-flex align-items-center"><div class="text-left warning-messages-block">'+warning.messages+'</div></div></div>';
                                                            }
                                                        }
                                                    }
                                                }
                                            }else{ //not include
                                                if(warning.targeted_location_type === 'dont_show'){
                                                    //check product
                                                    if(warning.targeted_product_type === 'all'){
                                                        if(productWarnings.length === 0){
                                                            warningProductKeys.push(productKey);
                                                            productWarnings += '<div class="d-flex align-items-center justify-content-center"><div class="d-flex flex-column align-items-start justify-content-center" style="width: 120px;padding-top: 12px;border: 1px solid #ddd"><img src="'+item.cart_image+'" width="90%" /> <p style="padding: 5px;font-size: 11px;line-height: 1.2;text-align: center">'+item.cart_product_name+' - '+item.cart_variation_name+'</p></div><div class="d-flex flex-column w-100">';
                                                        }
                                                        productWarnings += '<div class="py-3 px-3 d-flex ml-2 border warning-message-text" style="background-color: '+warning.design.background+'"><div class="mr-3 d-flex align-items-center"><img src="'+warning.design.icon+'" width="50px"></div><div class="d-flex align-items-center"><div class="text-left warning-messages-block">'+warning.messages+'</div></div></div>';
                                                    }else if(warning.targeted_product_type === 'product'){//variation wise check
                                                        const productsIds = warning.products_ids;
                                                        if(productsIds.length > 0){
                                                            if(productsIds.includes(parseInt(cartProductId))){
                                                                if(productWarnings.length === 0){
                                                                    warningProductKeys.push(productKey);
                                                                    productWarnings += '<div class="d-flex align-items-start justify-content-center warning-block-border"><div class="d-flex flex-column align-items-center justify-content-center" style="width: 120px;padding-top: 12px;border: 1px solid #ddd"><img src="'+item.cart_image+'" width="90%" /> <p style="padding: 5px;font-size: 11px;line-height: 1.2;text-align: center;margin-bottom: 0!important;">'+item.cart_product_name+' - '+item.cart_variation_name+'</p></div><div class="d-flex flex-column w-100">';
                                                                }
                                                                productWarnings += '<div class="py-3 px-3 d-flex ml-2 border warning-message-text" style="background-color: '+warning.design.background+'"><div class="mr-3 d-flex align-items-center"><img src="'+warning.design.icon+'" width="50px"></div><div class="d-flex align-items-center"><div class="text-left warning-messages-block">'+warning.messages+'</div></div></div>';
                                                            }
                                                        }
                                                    }else if(warning.targeted_product_type === 'variation'){//variation wise check
                                                        const productsIds = warning.products_ids;
                                                        if(productsIds.length > 0){
                                                            if(productsIds.includes(parseInt(cartVariationId))){
                                                                if(productWarnings.length === 0){
                                                                    warningProductKeys.push(productKey);
                                                                    productWarnings += '<div class="d-flex align-items-start justify-content-center warning-block-border"><div class="d-flex flex-column align-items-center justify-content-center" style="width: 120px;padding-top: 12px;border: 1px solid #ddd"><img src="'+item.cart_image+'" width="90%" /> <p style="padding: 5px;font-size: 11px;line-height: 1.2;text-align: center;margin-bottom: 0!important;">'+item.cart_product_name+' - '+item.cart_variation_name+'</p></div><div class="d-flex flex-column w-100">';
                                                                }
                                                                productWarnings += '<div class="py-3 px-3 d-flex ml-2 border warning-message-text" style="background-color: '+warning.design.background+'"><div class="mr-3 d-flex align-items-center"><img src="'+warning.design.icon+'" width="50px"></div><div class="d-flex align-items-center"><div class="text-left warning-messages-block">'+warning.messages+'</div></div></div>';
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        //console.log('billing_country: ', country);
                                        //console.log('locations: ', locations[country]);
                                    }else{
                                        //check product
                                        if(warning.targeted_product_type === 'all'){
                                            if(productWarnings.length === 0){
                                                warningProductKeys.push(productKey);
                                                productWarnings += '<div class="d-flex align-items-start justify-content-center warning-block-border"><div class="d-flex flex-column align-items-center justify-content-center" style="width: 120px;padding-top: 12px;border: 1px solid #ddd"><img src="'+item.cart_image+'" width="90%" /> <p style="padding: 5px;font-size: 11px;line-height: 1.2;text-align: center;margin-bottom: 0!important;">'+item.cart_product_name+' - '+item.cart_variation_name+'</p></div><div class="d-flex flex-column w-100">';
                                            }
                                            productWarnings += '<div class="py-3 px-3 d-flex ml-2 border warning-message-text" style="background-color: '+warning.design.background+'"><div class="mr-3 d-flex align-items-center"><img src="'+warning.design.icon+'" width="50px"></div><div class="d-flex align-items-center"><div class="text-left warning-messages-block">'+warning.messages+'</div></div></div>';
                                        }else if(warning.targeted_product_type === 'product'){//variation wise check
                                            const productsIds = warning.products_ids;
                                            if(productsIds.length > 0){
                                                if(productsIds.includes(parseInt(cartProductId))){
                                                    if(productWarnings.length === 0){
                                                        warningProductKeys.push(productKey);
                                                        productWarnings += '<div class="d-flex align-items-start justify-content-center warning-block-border"><div class="d-flex flex-column align-items-center justify-content-center" style="width: 120px;padding-top: 12px;border: 1px solid #ddd"><img src="'+item.cart_image+'" width="90%" /> <p style="padding: 5px;font-size: 11px;line-height: 1.2;text-align: center;margin-bottom: 0!important;">'+item.cart_product_name+' - '+item.cart_variation_name+'</p></div><div class="d-flex flex-column w-100">';
                                                    }
                                                    productWarnings += '<div class="py-3 px-3 d-flex ml-2 border warning-message-text" style="background-color: '+warning.design.background+'"><div class="mr-3 d-flex align-items-center"><img src="'+warning.design.icon+'" width="50px"></div><div class="d-flex align-items-center"><div class="text-left warning-messages-block">'+warning.messages+'</div></div></div>';
                                                }
                                            }
                                        }else if(warning.targeted_product_type === 'variation'){//variation wise check
                                            const productsIds = warning.products_ids;
                                            if(productsIds.length > 0){
                                                if(productsIds.includes(parseInt(cartVariationId))){
                                                    if(productWarnings.length === 0){
                                                        warningProductKeys.push(productKey);
                                                        productWarnings += '<div class="d-flex align-items-start justify-content-center warning-block-border"><div class="d-flex flex-column align-items-center justify-content-center" style="width: 120px;padding-top: 12px;border: 1px solid #ddd"><img src="'+item.cart_image+'" width="90%" /> <p style="padding: 5px;font-size: 11px;line-height: 1.2;text-align: center;margin-bottom: 0!important;">'+item.cart_product_name+' - '+item.cart_variation_name+'</p></div><div class="d-flex flex-column w-100">';
                                                    }
                                                    productWarnings += '<div class="py-3 px-3 d-flex ml-2 border warning-message-text" style="background-color: '+warning.design.background+'"><div class="mr-3 d-flex align-items-center"><img src="'+warning.design.icon+'" width="50px"></div><div class="d-flex align-items-center"><div class="text-left warning-messages-block">'+warning.messages+'</div></div></div>';
                                                }
                                            }
                                        }
                                    }

                                }
                            });
                            if(productWarnings.length > 0) {
                                warningContents += productWarnings + '</div></div>';
                            }
                        });
                    }

                    //console.log('warningContents: ', warningContents);

                    if(warningContents.length > 0){
                        this.setState({ warningProductCartKeys: warningProductKeys });

                        $("#warningModal").modal({
                            backdrop: 'static',
                            keyboard: false,
                        });
                        //let modalContent = '<div class="mt-2 warning-block-cards">'+warningContents+'</div>';
                        //let modalContent = '<div class="modal-header cus-modal-header"><button type="button" className="close" data-dismiss="modal" aria-label="Close" style="border: 0px;background: transparent;font-size: 25px;right: 0px;top: -5px;cursor: pointer"><span aria-hidden="true">&times;</span></button></div><div class="modal-body montserrat" style="background: '+this.state.warnings[0].design.background+'"><div class="py-3 d-flex align-items-center justify-content-center"><img src="'+this.state.warnings[0].design.icon+'" width="80px"></div><div class="py-3 px-3 text-center">'+this.state.warnings[0].messages+'</div><div class="d-flex align-items-center justify-content-center py-3"><button class="btn mr-4" style="background:'+this.state.warnings[0].buttons.cancel.background+'">Cancel</button><button class="btn btn-s">OK</button></div></div>';
                        //let modalContent = '<div class="modal-header cus-modal-header"><button type="button" className="close" data-dismiss="modal" aria-label="Close" style="border: 0px;background: transparent;font-size: 25px;right: 0px;top: -5px;cursor: pointer"><span aria-hidden="true">&times;</span></button></div><div class="modal-body montserrat" style="background: '+this.state.warnings[0].design.background+'"><div class="py-3 px-3 d-flex justify-content-center align-items-start"><div class="mr-3"><img src="'+this.state.warnings[0].design.icon+'" width="80px"></div><div class="text-center">'+this.state.warnings[0].messages+'</div></div><div class="d-flex align-items-center justify-content-center py-3"><button class="btn mr-4" style="background:'+this.state.warnings[0].buttons.cancel.background+'">Cancel</button><button class="btn btn-s">OK</button></div></div>';
                        //let modalContent = '<div class="modal-header cus-modal-header"><button type="button" className="close" data-dismiss="modal" aria-label="Close" style="border: 0px;background: transparent;font-size: 25px;right: 0px;top: -5px;cursor: pointer"><span aria-hidden="true">&times;</span></button></div><div class="modal-body montserrat" style="background: '+this.state.warnings[0].design.background+'"><div class="py-3 px-3 d-flex justify-content-center align-items-start"><div class="text-center">'+this.state.warnings[0].messages+'</div><div class="ml-3"><img src="'+this.state.warnings[0].design.icon+'" width="80px"></div></div><div class="d-flex align-items-center justify-content-center py-3"><button class="btn mr-4" style="background:'+this.state.warnings[0].buttons.cancel.background+'">Cancel</button><button class="btn btn-s">OK</button></div></div>';
                        //let modalContent = '<div class="modal-header cus-modal-header"><button type="button" className="close" data-dismiss="modal" aria-label="Close" style="border: 0px;background: transparent;font-size: 25px;right: 0px;top: -5px;cursor: pointer"><span aria-hidden="true">&times;</span></button></div><div class="modal-body montserrat" style="background: '+this.state.warnings[0].design.background+'"><div class="py-3 px-3 text-center">'+this.state.warnings[0].messages+'</div><div class="pt-2 pb-3 d-flex align-items-center justify-content-center"><img src="'+this.state.warnings[0].design.icon+'" width="80px"></div><div class="d-flex align-items-center justify-content-center py-3"><button class="btn mr-4" style="background:'+this.state.warnings[0].buttons.cancel.background+'">Cancel</button><button class="btn btn-success">OK</button></div></div>';
                        $("#warningModalContent").html(warningContents);
                    }
                }
            }
        });
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.reApplyCoupon();
        this.getCart();
        this.getAllShippingMethods();
        this.getCountryList();
        const { user } = this.props.auth;
        if (user.sales_agent_feature == "enable") {
            this.getTeamMemberList();
        }
    }

    // Get and calculate tax if applicable
    getTax = (checkStatus = 'no') => {

        this.setState({
            tax_amount: 0,
            tax_info: '',
            subscription_tax_amount: 0,
            subscription_tax_info: '',
            meal_tax_amount: 0,
            meal_tax_info: '',
            subscription_meal_tax_amount: 0,
            subscription_meal_tax_info: '',
        })

        if (this.state.taxStatus == 1) {
            let address_1 = '';
            let postcode = '';
            let city = '';
            let state = '';
            let country = '';
            if (checkStatus == "checked") {
                address_1 = document.getElementById("shipping_address_1").value;
                postcode = document.getElementById("shipping_postcode").value;
                city = document.getElementById("shipping_city").value;
                state = document.getElementById("shipping_state").value;
                country = document.getElementById("shipping_country").value;
            } else {
                address_1 = document.getElementById("billing_address_1").value;
                postcode = document.getElementById("billing_postcode").value;
                city = document.getElementById("billing_city").value;
                state = document.getElementById("billing_state").value;
                country = document.getElementById("billing_country").value;
            }

            if (address_1 != '' && postcode != '' && city != '' && state != '' && country != '') {

                let taxData = {
                    address_1: address_1,
                    postcode: postcode,
                    city: city,
                    state: state,
                    country: country,
                    shipping_method_id: this.state.shipping_method_id,
                    recurring_shipping_method_id: this.state.recurring_shipping_method_id,
                    cart_items: JSON.parse(GET_STORAGE("cart")), // set shoping carts
                    meals: JSON.parse(GET_STORAGE("meals")), // set meals
                    cart_coupons: JSON.parse(GET_STORAGE("coupon")),
                }

                AJAX_REQUEST("POST", "order/getTax", taxData).then(results => {
                    if (parseInt(results.response.code) === 1000 && results.response.data != '') {
                        let data = results.response.data;
                        this.setState({
                            tax_amount: (data.tax_amount) ? data.tax_amount : 0,
                            tax_info: data.tax_info,
                            subscription_tax_amount: (data.subscription_tax_amount) ? data.subscription_tax_amount : 0,
                            subscription_tax_info: data.subscription_tax_info,
                            meal_tax_amount: (data.meal_tax_amount) ? data.meal_tax_amount : 0,
                            meal_tax_info: data.meal_tax_info,
                            subscription_meal_tax_amount: (data.subscription_meal_tax_amount) ? data.subscription_meal_tax_amount : 0,
                            subscription_meal_tax_info: data.subscription_meal_tax_info,
                        });
                    }
                });
            }
        }
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false,
                server_message: ''
            });
        }.bind(this), timedata);
    }

    getCart = () => {
        CHECK_STORAGE();
        if (GET_STORAGE('cart')) {
            this.setState({ items: JSON.parse(GET_STORAGE('cart')) });
        } else {
            this.setState({ items: [] });
        }
        if (GET_STORAGE('meals')) {
            let meals = JSON.parse(GET_STORAGE('meals'));
            if (meals.hasOwnProperty('items') && meals.items.length > 0) {
                this.setState({ meals: meals });
            } else {
                REMOVE_STORAGE('meals');
                this.setState({ meals: [] });
            }
        } else {
            this.setState({ meals: [] });
        }
        if (GET_STORAGE('coupon')) {
            this.setState({ coupons: JSON.parse(GET_STORAGE("coupon")) });
        } else {
            this.setState({ coupons: [] });
        }
    }

    getAllShippingMethods = () => {
        AJAX_REQUEST("POST", "order/getShippingMethodList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let methods = results.response.data;
                let method = methods.filter(c => c.id === GET_STORAGE("cartMethodId"));
                let method2 = methods.filter(c => c.id === GET_STORAGE("recurringCartMethodId"));

                if (this.state.shipping_method_id) {
                    if (this.state.shipping_method_id != GET_STORAGE("cartMethodId")) {
                        SET_STORAGE("cartMethodId", methods[0].id);
                    }
                }

                this.setState({
                    shippingMethods: methods,
                    shipping_method_id: GET_STORAGE("cartMethodId"),
                    // cartShippingCost: (this.state.shipping_method_id != GET_STORAGE("cartMethodId")) ? method[0].cost : methods[0].cost,
                    cartShippingCost: (GET_STORAGE("cartMethodId")) ? method[0].cost : methods[0].cost,
                });
                if (method2) {
                    this.setState({
                        recurring_shipping_method_id: GET_STORAGE("recurringCartMethodId"),
                        recurringCartShippingCost: method2[0].cost,
                    });
                }
            } else {
                this.setState({
                    error: results.response.message,
                })
            }
        });
    }

    getCountryList = () => {
        AJAX_REQUEST("POST", "user/getCountry", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    countryList: results.response.data
                });
            } else {
                this.setState({
                    loading: false,
                    error: results.response.message,
                })
            }
        });
    }

    onChangeBillingCountry = (e) => {
        let countryId = e.target.value;

        if (!document.getElementById("ship_to_different_address").checked && parseInt(countryId) == 38 && CanadaRestrictedProduct()) {
            $("#canadaRestrictedProductModal").modal({
                backdrop: 'static',
                keyboard: false,
            });
            $("#canadaRestrictedProductModalBody").html(CanadaRestrictedProduct());
        } else {
            this.setState({ [e.target.name]: countryId })
            let data = { country_id: countryId }
            AJAX_REQUEST("POST", "user/getState", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    this.setState({
                        billingStateList: results.response.data,
                        billing_state: "",
                    });
                } else {
                    this.setState({
                        billingStateList: [],
                        billing_state: "",
                    })
                }
            });
        }

    }

    onChangeShippingCountry = (e) => {
        let countryId = e.target.value;

        if (document.getElementById("ship_to_different_address").checked && parseInt(countryId) == 38 && CanadaRestrictedProduct()) {
            $("#canadaRestrictedProductModal").modal({
                backdrop: 'static',
                keyboard: false,
            });
            $("#canadaRestrictedProductModalBody").html(CanadaRestrictedProduct());
        } else {
            this.setState({ [e.target.name]: countryId })
            let data = { country_id: countryId };
            AJAX_REQUEST("POST", "user/getState", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    this.setState({
                        shippingStateList: results.response.data,
                        shipping_state: "",
                    });
                } else {
                    this.setState({
                        shippingStateList: [],
                        shipping_state: "",
                    })
                }
            });
        }

    }

    changeCartShippingMethod = (e) => {
        this.setState({
            shipping_method_id: e.target.getAttribute('cid'),
            cartShippingCost: e.target.getAttribute('price'),
        })
        SET_STORAGE("cartMethodId", e.target.getAttribute('cid'))
    }
    changeRecurringCartShippingMethod = (e) => {
        this.setState({
            recurring_shipping_method_id: e.target.getAttribute('rid'),
            recurringCartShippingCost: e.target.getAttribute('price'),
        })
        SET_STORAGE("recurringCartMethodId", e.target.getAttribute('rid'))
    }

    continueWithoutVerify = (e) => {
        if (document.getElementById("continue_without_verify").checked) {
            this.setState({ continue_without_verify: 1 });
        } else {
            this.setState({ continue_without_verify: 0 });
        }
    }

    isDifferentShipping = (e) => {
        if (document.getElementById("ship_to_different_address").checked) {
            this.setState({
                ship_to_different_address: 'checked',
                shippingAreaVisible: true,
            });

            this.getTax("checked");
        } else {
            this.setState({
                ship_to_different_address: 'no',
                shippingAreaVisible: false,
                shipping_first_name: '',
                shipping_last_name: '',
                shipping_company: '',
                shipping_country: '',
                shipping_address_1: '',
                shipping_address_2: '',
                shipping_city: '',
                shipping_state: '',
                shipping_postcode: '',
            });
            if (CanadaRestrictedProduct()) {
                this.setState({
                    billing_country: '',
                    billing_state: '',
                    billingStateList: [],
                })
            }
            this.getTax();
            //load warning
            if(this.state.billing_state){
                this.warningModalHandel(this.state.billing_country, this.state.billing_state);
            }
        }
    }
    agreeTermsPolicy = (e) => {
        if (document.getElementById("agreeTermsPolicy").checked) {
            this.setState({ agreeTermsPolicy: true });
        } else {
            this.setState({ agreeTermsPolicy: false });
        }
    }
    sendPromotionUpdate = (e) => {
        if (document.getElementById("send_promotion_update").checked) {
            this.setState({ send_promotion_update: "yes" });
        } else {
            this.setState({ send_promotion_update: "no" });
        }
    }

    getTeamMemberList = () => {
        AJAX_REQUEST("POST", "distributor/getTeamMemberListOption", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({ teamMemberList: results.response.data.team_members })
            } else {
                this.setState({ error: results.response.message })
            }
        });
    }

    onSubmitHandler = (e, forceOrderValue = 0) => {
        e.preventDefault();

        this.setState({ errors: {}, isLoading: true, place_order_loading: true });

        let cartData = {
            // Billing Details
            billing_first_name: this.state.billing_first_name,
            billing_last_name: this.state.billing_last_name,
            billing_company: this.state.billing_company,
            billing_country: this.state.billing_country,
            billing_address_1: this.state.billing_address_1,
            billing_address_2: this.state.billing_address_2,
            billing_city: this.state.billing_city,
            billing_state: this.state.billing_state,
            billing_postcode: this.state.billing_postcode,
            billing_phone: this.state.billing_phone,
            billing_email: this.state.billing_email,

            password_check: this.state.password_check,
            password: this.state.password,
            confirm_password: this.state.confirm_password,

            // Different Shipping Address
            ship_to_different_address: this.state.ship_to_different_address,
            shipping_first_name: this.state.shipping_first_name,
            shipping_last_name: this.state.shipping_last_name,
            shipping_company: this.state.shipping_company,
            shipping_country: this.state.shipping_country,
            shipping_address_1: this.state.shipping_address_1,
            shipping_address_2: this.state.shipping_address_2,
            shipping_city: this.state.shipping_city,
            shipping_state: this.state.shipping_state,
            shipping_postcode: this.state.shipping_postcode,
            // Additional Information
            agree_to_receive_text: this.state.agree_to_receive_text,
            continue_without_verify: this.state.continue_without_verify,
            send_promotion_update: this.state.send_promotion_update,
            team_member_id: this.state.team_member_id,
            order_note: this.state.order_note,
            force_order: (this.state.force_order == 1) ? 1 : forceOrderValue,
            // Payment Method
            payment_method: this.state.payment_method,
            name_on_card: this.state.name_on_card,
            expire_month: this.state.expire_month,
            expire_year: this.state.expire_year,
            card_number: CRYPTO_ENCRYPTION(this.state.card_number),
            cvv: CRYPTO_ENCRYPTION(this.state.cvv),
            // Cart Information
            shipping_method_id: this.state.shipping_method_id,
            recurring_shipping_method_id: this.state.recurring_shipping_method_id,
            tax_amount: this.state.tax_amount,
            subscription_tax_amount: this.state.subscription_tax_amount,
            meal_tax_amount: this.state.meal_tax_amount,
            subscription_meal_tax_amount: this.state.subscription_meal_tax_amount,
            tax_info: this.state.tax_info,
            subscription_tax_info: this.state.subscription_tax_info,
            meal_tax_info: this.state.meal_tax_info,
            subscription_meal_tax_info: this.state.subscription_meal_tax_info,
            cart_items: (ITEM_COUNT() > 0) ? JSON.parse(GET_STORAGE("cart")) : [],
            meals: (MEAL_COUNT() > 0) ? JSON.parse(GET_STORAGE("meals")) : [],
            cart_coupons: JSON.parse(GET_STORAGE("coupon")),
        }

        if (this.state.session_id !== '') {
            cartData.session_id = this.state.session_id
        }

        const val_return = checkoutValidate(cartData);
        this.setState(val_return);

        if (!document.getElementById("ship_to_different_address").checked) {
            cartData.shipping_first_name = this.state.billing_first_name;
            cartData.shipping_last_name = this.state.billing_last_name;
            cartData.shipping_company = this.state.billing_company;
            cartData.shipping_country = this.state.billing_country;
            cartData.shipping_address_1 = this.state.billing_address_1;
            cartData.shipping_address_2 = this.state.billing_address_2;
            cartData.shipping_city = this.state.billing_city;
            cartData.shipping_state = this.state.billing_state;
            cartData.shipping_postcode = this.state.billing_postcode;
        }

        if (val_return.isValid) {

            this.props.checkoutRequest(cartData).then(results => {

                // Check existing affiliate email for order
                if (parseInt(results.response.code) === 3003) {

                    this.setState({
                        isLoading: false,
                        place_order_loading: false,
                        isFormValid: false,
                        affiliateErrorMessage: results.response.message,
                    });

                    $("#affiliateErrorModal").modal({
                        backdrop: 'static',
                        keyboard: false,
                    });

                }

                // Check product stockout
                else if (parseInt(results.response.code) === 3004) {

                    this.setState({
                        isLoading: false,
                        place_order_loading: false,
                        isFormValid: false,
                        stockoutErrorMessage: results.response.message,
                    });

                    $("#stockoutErrorModal").modal({
                        backdrop: 'static',
                        keyboard: false,
                    });

                }

                // Check existing subscription product for order
                else if (parseInt(results.response.code) === 3000) {

                    $("#subscriptionProductErrorModal").modal({
                        backdrop: 'static',
                        keyboard: false,
                    });

                    this.setState({
                        isLoading: false,
                        place_order_loading: false,
                        isFormValid: false,
                        subscriptionProductErrorMessage: results.response.message,
                    });

                }

                else {
                    this.orderSubmittedResult(results);
                }

            });

        } else {
            this.setState({
                isLoading: false,
                place_order_loading: false,
                isFormValid: false
            });
            document.querySelector("body").scrollIntoView(); // Scroll to top
        }
    }

    forceOrderSubmit = (e) => {
        this.setState({ force_order: 1 })
        this.onSubmitHandler(e, 1);
    }

    orderSubmittedResult = (results) => {
        if (parseInt(results.response.code) === 1000) {
            DESTROY_CART(); // Destroy cart information from localStorage
            this.setState({
                server_message: results.response.message,
                isLoading: false,
                place_order_loading: false,
                isFormValid: false,
                session_id: ''
            });
            document.querySelector("body").scrollIntoView(); // Scroll to top
            history.push('/order-received/' + results.response.data.order_id);
        } else {
            if (parseInt(results.response.code) === 3001) {
                this.setState({ addressVerifyCode: true })
            }
            if (parseInt(results.response.code) === 5002) {
                this.setState({ session_id: results.response.session_id })
            }
            this.setState({
                server_message: results.response.message,
                isLoading: false,
                place_order_loading: false,
                isFormValid: false
            });
            document.querySelector("body").scrollIntoView(); // Scroll to top
        }
    }

    applyCoupon = (e) => {
        e.preventDefault();
        let couponCode = (this.state.coupon_code).trim();

        this.setState({
            isFormValid: true,
            coupon_loading: true,
            success_alert_wrapper_show_coupon: false
        })

        if (couponCode == '' || couponCode == null) {
            this.setState({
                server_message: "The coupon code field is required.",
                isLoading: false,
                coupon_loading: false,
                isFormValid: false,
            });
        } else {

            let couponExists = false;
            let exCouponList = [];
            if (!GET_STORAGE("coupon")) {
                SET_STORAGE("coupon", JSON.stringify(exCouponList));
            }
            exCouponList = JSON.parse(GET_STORAGE("coupon"));

            if (exCouponList.length > 0) {
                exCouponList.forEach(function (exCoupon, key) {
                    if (exCoupon.coupon_code.toUpperCase() === couponCode.toUpperCase()) {
                        couponExists = true;
                    }
                });
            }

            if (!couponExists) {
                let applyCouponCode = [];
                if (exCouponList.length > 0) {
                    exCouponList.forEach(function (couponData, key) {
                        applyCouponCode.push(couponData.coupon_code);
                    });
                }
                applyCouponCode.push(couponCode);

                let data = {
                    coupon_code: applyCouponCode,
                    cart_items: JSON.parse(GET_STORAGE("cart")),
                    meals: JSON.parse(GET_STORAGE("meals")),
                }

                AJAX_REQUEST("POST", "coupon/applyCoupon", data).then(results => {
                    if (parseInt(results.response.code) === 1000) {

                        this.setState({
                            success_alert_wrapper_show_coupon: false,
                            coupon_loading: false,
                            coupon_code: '',
                            server_message: results.response.message,
                            success_alert_wrapper_show: true
                        })

                        let couponResponse = results.response.data;
                        if (couponResponse || couponResponse != '') {
                            exCouponList = [];
                            couponResponse.forEach(function (couponData, key) {
                                exCouponList.push(couponData);
                            });
                        }

                        SET_STORAGE("coupon", JSON.stringify(exCouponList));
                        this.getAllShippingMethods();
                        this.getCart();
                        this.getTax();
                    } else {
                        this.setState({
                            server_message: results.response.message,
                            isLoading: false,
                            coupon_loading: false,
                            isFormValid: false,
                            error: results.response.message,
                        });
                    }
                    this.timeOut(5000);
                });
            } else {
                this.setState({
                    server_message: "The coupon code already applied.",
                    isLoading: false,
                    coupon_loading: false,
                    isFormValid: false,
                });
            }
        }
    }

    reApplyCoupon = () => {
        if (GET_STORAGE("coupon")) {
            let exCouponList = JSON.parse(GET_STORAGE("coupon"));
            let coupon_code = [];
            exCouponList.forEach(function (couponData, key) {
                coupon_code.push(couponData.coupon_code);
            });
            let data = {
                coupon_code: coupon_code,
                cart_items: JSON.parse(GET_STORAGE("cart")),
                meals: JSON.parse(GET_STORAGE("meals")),
            }
            AJAX_REQUEST("POST", "coupon/applyCoupon", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    SET_STORAGE("coupon", JSON.stringify(results.response.data));
                } else if (parseInt(results.response.code) === 4000) {
                    REMOVE_STORAGE('coupon')
                }
                this.getAllShippingMethods();
                this.getTax();
                this.getCart();
            });
        }
    }

    deleteCoupon = (e, row_id) => {
        e.preventDefault();
        if (window.confirm("Are you sure want to delete coupon?")) {
            let coupon = JSON.parse(GET_STORAGE('coupon'));
            if (coupon.splice(row_id, 1)) {
                SET_STORAGE("coupon", JSON.stringify(coupon));
                this.setState({
                    freeShipping: 0,
                    mealShippingCostStatus: true,
                    server_message: 'The coupon code successfully removed.',
                    success_alert_wrapper_show_coupon: false,
                    coupon_code: '',
                    success_alert_wrapper_show: true
                });
                document.querySelector("body").scrollIntoView();
                this.timeOut(5000);
                this.reApplyCoupon();
                this.getAllShippingMethods();
                this.getCart();
            }
        }
    }

    showCouponAction = (e) => {
        e.preventDefault();
        this.setState({
            show_coupon: this.state.show_coupon ? false : true
        })
    }

    haveExistsUser = (e) => {
        let data = { email: this.state.billing_email }
        AJAX_REQUEST("POST", "user/haveExists", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    haveExistsUser: results.response.data.have_exists,
                    password_check: (results.response.data.have_exists == 1) ? 0 : 1,
                })
            } else {
                this.setState({
                    haveExistsUser: 1,
                    password_check: 0
                })
            }
        });
    }
    automatedPassword = (e) => {
        if (document.getElementById("password_check").checked) {
            this.setState({ password_check: 0 })
        } else {
            this.setState({ password_check: 1 })
        }
    }
    
    backToCart = () => {
        $('#stockoutErrorModal').modal('hide');
        history.push('/cart');
    }


    render() {
        var efa_status=false;
        var meal_status=false;
        const {
            errors,
            server_message,
            show_coupon,
            coupon_code_button_loading,
            success_alert_wrapper_show,
            place_order_loading
        } = this.state;
        const errors_data = server_message;

        let cartTotal = 0;
        if (this.state.items.length > 0) {
            if (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0 && this.state.mealShippingCostStatus == true) {
                cartTotal = Number(CART_SUB_TOTAL()) + Number(MEAL_TOTAL()) + Number(this.state.cartShippingCost) + Number(this.state.tax_amount) + Number(this.state.meal_tax_amount) - Number(COUPON_TOTAL());
            } else {
                cartTotal = Number(CART_SUB_TOTAL()) + Number(MEAL_SUB_TOTAL()) + Number(this.state.cartShippingCost) + Number(this.state.tax_amount) - Number(COUPON_TOTAL());
            }
        } else {
            if (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0 && this.state.mealShippingCostStatus == true) {
                cartTotal = Number(MEAL_TOTAL()) + Number(this.state.meal_tax_amount) - Number(COUPON_TOTAL());
                meal_status=true;
            } else {
                cartTotal = Number(MEAL_SUB_TOTAL()) + Number(this.state.meal_tax_amount) - Number(COUPON_TOTAL());
            }
        }
        this.setState({ cartTotal: cartTotal })
        this.state.items.map(function (item, key) {
            if(item.cart_product_name=="EFA")
            {
                efa_status=true;
            }
        });
        return (
            <Fragment>
                {
                    (this.state.loading) ?
                        <div className='loading container full_page_loader'></div>
                        :
                        <Fragment>
                            {
                            ((this.state.shipping_country=="CA" && efa_status) || ((this.state.shipping_state=="AK" || this.state.shipping_state=="HI") && meal_status)) ?
                             <PreventCheckoutModal  productLink="#"/>:<br />
                            }
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <main>
                                            <div className="page-content entry-content">
                                                <div className="page-title">Checkout</div>
                                                <div className="woocommerce">
                                                    <div className="steps-wrapper">
                                                        <span className="cart"><i className="fa fa-cart-arrow-down" aria-hidden="true"></i>Shopping bag</span>
                                                        <span className="checkout cart_active"><i className="fa fa-align-justify" aria-hidden="true"></i>Checkout details</span>
                                                        <span className="order"><i className="fa fa-check" aria-hidden="true"></i>Order complete</span>
                                                    </div>
                                                    <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                                    <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show} />

                                                    {
                                                        (!this.state.addressVerifyCode) ? ''
                                                            :
                                                            <Fragment>
                                                                <p className="promotion_and_product_updates addess-verification">
                                                                    <label className="dis_checkout_label">
                                                                        <input onClick={this.continueWithoutVerify} id='continue_without_verify' className="" type="checkbox" />
                                                                        Continue without verify address?
                                                                    </label>
                                                                </p>
                                                            </Fragment>
                                                    }

                                                    {
                                                        // (this.state.coupons.length > 0) ? null :
                                                        <div className="coupon-wrapper-container">
                                                            <div className="woocommerce-info">
                                                                <i className="fa fa-info-circle" aria-hidden="true"></i> Have a coupon? <a href="#" className="showcoupon" onClick={this.showCouponAction}>Click here to enter your code</a>
                                                            </div>
                                                            {
                                                                show_coupon ?
                                                                    <Fragment>
                                                                        <div className="coupon checkout_coupon checkout_coupon_apply">
                                                                            <p>If you have a coupon code, please apply it below.</p>
                                                                            <input onChange={this.changeHandler} value={this.state.coupon_code} type="text" className=" input-coupon input-text" name="coupon_code" placeholder="Coupon code" autoComplete="off" />
                                                                            <input onClick={this.applyCoupon} type="submit" className="button cus_button" value={this.state.coupon_loading ? "Please Wait..." : "Apply Coupon"} />
                                                                        </div>
                                                                    </Fragment>
                                                                    : null
                                                            }
                                                        </div>
                                                    }
                                                    <form id="orderForm" onSubmit={this.onSubmitHandler}>

                                                        <div className="pull-left col2-set">
                                                            <div className="checkout_address_form">
                                                                <div className="">

                                                                    {/* Start Billing Address */}
                                                                    <h3 className="checkout_title">Billing details</h3>
                                                                    <div className="woocommerce-billing-fields__field-wrapper">
                                                                        <div className="form-group pull-left name_field">
                                                                            <label className="dis_checkout_label">First name <span className="required">*</span></label>
                                                                            <input onChange={this.changeHandler} value={this.state.billing_first_name} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_first_name })} name="billing_first_name" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group pull-right name_field">
                                                                            <label className="dis_checkout_label">Last name <span className="required">*</span></label>
                                                                            <input onChange={this.changeHandler} value={this.state.billing_last_name} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_last_name })} name="billing_last_name" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Company name <span className="optional">(optional)</span></label>
                                                                            <input onChange={this.changeHandler} value={this.state.billing_company} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_company })} name="billing_company" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Country <span className="required">*</span> </label>
                                                                            <select onChange={this.onChangeBillingCountry} value={this.state.billing_country} name="billing_country" id="billing_country" className={classnames("cus_field", { 'pl_error_input': errors.billing_country })}>
                                                                                <option value="">Select a country…</option>
                                                                                {/* Start billing country list*/}
                                                                                {
                                                                                    (this.state.countryList.length <= 0) ? null :
                                                                                        this.state.countryList.map(function (country, key) {
                                                                                            return (
                                                                                                (parseInt(country.id) == 38 && MEAL_COUNT() != 0) ? "" :
                                                                                                    <option key={key} value={country.id}>{country.name}</option>
                                                                                            )
                                                                                        }.bind(this))
                                                                                }
                                                                                {/* End billing country list */}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Street Address <span className="required">*</span> </label>
                                                                            <input onChange={this.changeHandler} onBlur={this.changeHandlerWithCallTax} value={this.state.billing_address_1} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_address_1 })} name="billing_address_1" id="billing_address_1" placeholder="House number and street name" />
                                                                            {
                                                                                (errors.billing_address_1_msg) ?
                                                                                    <span className="error-msg">{errors.billing_address_1_msg}</span>
                                                                                    : ""
                                                                            }
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <input onChange={this.changeHandler} onBlur={this.changeHandlerWithCallTax} value={this.state.billing_address_2} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_address_2 })} name="billing_address_2" id="billing_address_2" placeholder="Apartment, suite, unit etc. (optional)" />
                                                                            {
                                                                                (errors.billing_address_2_msg) ?
                                                                                    <span className="error-msg">{errors.billing_address_2_msg}</span>
                                                                                    : ""
                                                                            }
                                                                        </div>

                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Town / City <span className="required">*</span> </label>
                                                                            <input onChange={this.changeHandler} onBlur={this.changeHandlerWithCallTax} value={this.state.billing_city} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_city })} name="billing_city" id="billing_city" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">State <span className="required">*</span> </label>
                                                                            <select onChange={this.changeHandlerWithCallTax} value={this.state.billing_state} name="billing_state" id="billing_state" className={classnames("cus_field", { 'pl_error_input': errors.billing_state })}>
                                                                                <option value="">Select a state...</option>
                                                                                {/* Start billing state list*/}
                                                                                {
                                                                                    (this.state.billingStateList.length <= 0) ? null :
                                                                                        this.state.billingStateList.map(function (state, key) {
                                                                                            return (
                                                                                                <option key={key} value={state.code}>{state.name}</option>
                                                                                            )
                                                                                        }.bind(this))
                                                                                }
                                                                                {/* End billing state list */}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">ZIP <span className="required">*</span> </label>
                                                                            <input onChange={this.changeHandler} onBlur={this.changeHandlerWithCallTax} value={this.state.billing_postcode} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_postcode })} name="billing_postcode" id="billing_postcode" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Phone <span className="required">*</span> </label>
                                                                            <input onChange={this.changeHandler} value={this.state.billing_phone} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_phone })} name="billing_phone" id="billing_phone" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Email Address <span className="required">*</span> </label>
                                                                            <input onChange={this.changeHandler} onBlur={this.haveExistsUser} value={this.state.billing_email} type="text" className={classnames("cus_field", { 'pl_error_input': errors.billing_email })} name="billing_email" placeholder="" />
                                                                        </div>
                                                                        {
                                                                            (this.state.haveExistsUser == 0) ?
                                                                                <Fragment>
                                                                                    {
                                                                                        (this.state.password_check == 1) ?
                                                                                            <Fragment>
                                                                                                <div className="form-group">
                                                                                                    <label className="dis_checkout_label">Password <span className="required">*</span> </label>
                                                                                                    <input onChange={this.changeHandler} value={this.state.password} type="password" className={classnames("cus_field", { 'pl_error_input': errors.password })} name="password" id="password" placeholder="" />
                                                                                                </div>
                                                                                                <div className="form-group">
                                                                                                    <label className="dis_checkout_label">Confirm password <span className="required">*</span> </label>
                                                                                                    <input onChange={this.changeHandler} value={this.state.confirm_password} type="password" className={classnames("cus_field", { 'pl_error_input': errors.confirm_password })} name="confirm_password" id="confirm_password" placeholder="" />
                                                                                                </div>
                                                                                            </Fragment>
                                                                                            : ""
                                                                                    }
                                                                                    <p className="promotion_and_product_updates">
                                                                                        <label className="dis_checkout_label">
                                                                                            <input onClick={this.automatedPassword} value={this.state.password_check} id='password_check' className="" type="checkbox" />
                                                                                            Automatically Generated Password
                                                                                        </label>
                                                                                    </p>
                                                                                </Fragment>
                                                                                : ""
                                                                        }
                                                                    </div>

                                                                    {/* End Billing Address */}

                                                                    {/* Start Shipping Address */}

                                                                    <h3 className="ship-to-different-address">
                                                                        <label>
                                                                            <input onClick={this.isDifferentShipping} value={this.state.ship_to_different_address} name="ship_to_different_address" id="ship_to_different_address" className="woocommerce-form__input woocommerce-form__input-checkbox input-checkbox" type="checkbox" />
                                                                            <span className="roboto_condensed is_ship_different_address">Ship to a different address?</span>
                                                                        </label>
                                                                    </h3>

                                                                    <div style={{ display: this.state.shippingAreaVisible ? '' : 'none' }} className="woocommerce-billing-fields__field-wrapper">
                                                                        <div className="form-group pull-left name_field">
                                                                            <label className="dis_checkout_label">First name <span className="required">*</span></label>
                                                                            <input onChange={this.changeHandler} value={this.state.shipping_first_name} type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_first_name })} name="shipping_first_name" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group pull-right name_field">
                                                                            <label className="dis_checkout_label">Last name <span className="required">*</span></label>
                                                                            <input onChange={this.changeHandler} value={this.state.shipping_last_name} type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_last_name })} name="shipping_last_name" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Company name <span className="optional">(optional)</span></label>
                                                                            <input onChange={this.changeHandler} value={this.state.shipping_company} type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_company })} name="shipping_company" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Country <span className="required">*</span> </label>
                                                                            <select onChange={this.onChangeShippingCountry} value={this.state.shipping_country} name="shipping_country" id="shipping_country" className={classnames("cus_field", { 'pl_error_input': errors.shipping_country })}>
                                                                                <option value="">Select a country…</option>
                                                                                {/* Start shipping country list*/}
                                                                                {
                                                                                    (this.state.countryList.length <= 0) ? null :
                                                                                        this.state.countryList.map(function (country, key) {
                                                                                            return (
                                                                                                (parseInt(country.id) == 38 && MEAL_COUNT() != 0) ? "" :
                                                                                                    <option key={key} value={country.id}>{country.name}</option>
                                                                                            )
                                                                                        }.bind(this))
                                                                                }
                                                                                {/* End shipping country list */}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Street Address <span className="required">*</span> </label>
                                                                            <input onChange={this.changeHandler} onBlur={this.changeHandlerWithCallTax} value={this.state.shipping_address_1} type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_address_1 })} name="shipping_address_1" id="shipping_address_1" placeholder="House number and street name" />
                                                                            {
                                                                                (errors.shipping_address_1_msg) ?
                                                                                    <span className="error-msg">{errors.shipping_address_1_msg}</span>
                                                                                    : ""
                                                                            }
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <input onChange={this.changeHandler} onBlur={this.changeHandlerWithCallTax} value={this.state.shipping_address_2} type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_address_2 })} name="shipping_address_2" id="shipping_address_2" placeholder="Apartment, suite, unit etc. (optional)" />
                                                                            {
                                                                                (errors.shipping_address_2_msg) ?
                                                                                    <span className="error-msg">{errors.shipping_address_2_msg}</span>
                                                                                    : ""
                                                                            }
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">Town / City <span className="required">*</span> </label>
                                                                            <input onChange={this.changeHandler} onBlur={this.changeHandlerWithCallTax} value={this.state.shipping_city} type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_city })} name="shipping_city" id="shipping_city" placeholder="" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">State <span className="required">*</span> </label>
                                                                            <select onChange={this.changeHandlerWithCallTax} value={this.state.shipping_state} name="shipping_state" id="shipping_state" className={classnames("cus_field", { 'pl_error_input': errors.shipping_state })}>
                                                                                <option value="">Select a state</option>
                                                                                {/* Start shipping state list*/}
                                                                                {
                                                                                    (this.state.shippingStateList.length <= 0) ? null :
                                                                                        this.state.shippingStateList.map(function (state, key) {
                                                                                            return (
                                                                                                <option key={key} value={state.code}>{state.name}</option>
                                                                                            )
                                                                                        }.bind(this))
                                                                                }
                                                                                {/* End shipping state list */}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="dis_checkout_label">ZIP <span className="required">*</span> </label>
                                                                            <input onChange={this.changeHandler} onBlur={this.changeHandlerWithCallTax} value={this.state.shipping_postcode} type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_postcode })} name="shipping_postcode" id="shipping_postcode" placeholder="" />
                                                                        </div>
                                                                    </div>

                                                                    {/* End Shipping Address */}

                                                                    {/* <div className="form-group" >
                                                                        <label className="dis_checkout_label">Order notes <span className="optional">(optional)</span></label>
                                                                        <textarea onChange={this.changeHandler} value={this.state.order_note} name="order_note" className={classnames("cus_field", { 'pl_error_input': errors.order_note })} placeholder="Notes about your order, e.g. special notes for delivery." rows="2" cols="5">{this.state.order_note}</textarea>
                                                                    </div> */}

                                                                    <div className="form-group agree_wrapper">
                                                                        <label className="dis_checkout_label">I agree to receive text communications from Prestige Labs. Message and Data rates may apply</label> &nbsp;&nbsp;
                                                                        <br />
                                                                        <span>
                                                                            <label><input onChange={this.changeHandler} type="radio" name="agree_to_receive_text" value="yes" defaultChecked="checked" /> Yes </label>
                                                                        </span>
                                                                        <span>
                                                                            <label><input onChange={this.changeHandler} type="radio" name="agree_to_receive_text" value="no" /> No </label>
                                                                        </span>
                                                                    </div>

                                                                    {
                                                                        (this.state.sales_agent_feature !== "enable") ? ""
                                                                            :
                                                                            <Fragment>
                                                                                {/* <div className="form-group">
                                                                                    <label className="dis_checkout_label">Team Member</label>
                                                                                    <select onChange={this.changeHandler} value={this.state.team_member_id} name="team_member_id" id="team_member_id" className={classnames("cus_field", { 'pl_error_input': errors.team_member_id })}>
                                                                                        <option value="">Select a team member</option>
                                                                                        
                                                                                        {
                                                                                            (this.state.teamMemberList.length <= 0) ? null :
                                                                                                this.state.teamMemberList.map(function (member, key) {
                                                                                                    return (
                                                                                                        <option key={key} value={member.team_member_id}>{member.name}</option>
                                                                                                    )
                                                                                                }.bind(this))
                                                                                        }
                                                                                        
                                                                                    </select>
                                                                                </div> */}
                                                                            </Fragment>
                                                                    }

                                                                    <p className="promotion_and_product_updates">
                                                                        <label className="dis_checkout_label">
                                                                            <input onClick={this.sendPromotionUpdate} id='send_promotion_update' className="" type="checkbox" />
                                                                            Send me promotion and product updates
                                                                        </label>
                                                                    </p>
                                                                    <div className="clearfix"></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Start cart view */}

                                                        <div className="pull-right col2-set">
                                                            <h3 className="checkout_title">Your order</h3>
                                                            <div id="order_review" className="woocommerce-checkout-review-order">
                                                                <div className="cart_totals review-order-table-wrapper">

                                                                    <table cellSpacing="0" className="shop_table checkout_table">
                                                                        <colgroup>
                                                                            <col width="40%" />
                                                                            <col width="60%" />
                                                                        </colgroup>
                                                                        <tbody>
                                                                            {/* Start cart list*/}
                                                                            {
                                                                                (this.state.items.length <= 0) ? null :
                                                                                    this.state.items.map(function (item, key) {
                                                                                        return (
                                                                                            <Fragment key={key}>
                                                                                                <tr className="cart_item">
                                                                                                    <td className="product-name">
                                                                                                        <span className="checkout_product_name"> {item.cart_product_name + " - " + item.cart_variation_name} </span>
                                                                                                        <span className="product-quantity checkout-product-quantity">Quantity: {item.quantity}</span>
                                                                                                        {
                                                                                                            (item.subscription == "yes") ?
                                                                                                                <dl className="variation">
                                                                                                                    <dt className="variation-Every1Months">{item.cart_subscription_msg}:</dt>
                                                                                                                    <dd className="variation-Every1Months"><strong> {CURRENCY_FORMAT(item.cart_discount_price * item.quantity)} each</strong></dd>
                                                                                                                </dl>
                                                                                                                : null
                                                                                                        }
                                                                                                    </td>
                                                                                                    <td className="product-total">
                                                                                                        <span className="subscription-price"><span className="woocommerce-Price-amount amount"><span className="woocommerce-Price-currencySymbol">
                                                                                                            {
                                                                                                                (item.subscription == "yes") ?
                                                                                                                    CURRENCY_FORMAT(item.quantity * item.cart_discount_price)
                                                                                                                    :
                                                                                                                    CURRENCY_FORMAT(item.quantity * item.cart_sale_price)
                                                                                                            }
                                                                                                        </span></span></span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </Fragment>
                                                                                        )
                                                                                    }.bind(this))
                                                                            }

                                                                            {/* Meal start  */}
                                                                            {
                                                                                (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0) ?
                                                                                    <Fragment>
                                                                                        {
                                                                                            this.state.meals.items.map(function (item, key) {
                                                                                                return (
                                                                                                    <Fragment key={key}>
                                                                                                        <tr className="cart_item">
                                                                                                            <td className="product-name">
                                                                                                                <span className="checkout_product_name"> {item.meal_name + " (" + item.meal_size}) </span>
                                                                                                                <span className="product-quantity checkout-product-quantity">Quantity: {item.meal_quantity}</span>
                                                                                                            </td>
                                                                                                            <td className="product-total">
                                                                                                                <span className="subscription-price"><span className="woocommerce-Price-amount amount"><span className="woocommerce-Price-currencySymbol">
                                                                                                                    {CURRENCY_FORMAT(item.meal_quantity * item.meal_price)}
                                                                                                                </span></span></span>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </Fragment>
                                                                                                )
                                                                                            }.bind(this))
                                                                                        }
                                                                                        <tr className="cart_item">
                                                                                            <td className="product-name">
                                                                                                {
                                                                                                    (this.state.meals.subscription == "yes") ?
                                                                                                        <dl className="variation">
                                                                                                            <dt className="variation-Every1Months">{this.state.meals.plan_name}:</dt>
                                                                                                            <dd className="variation-Every1Months"><strong> {CURRENCY_FORMAT(MEAL_SUB_TOTAL())}</strong></dd>
                                                                                                        </dl>
                                                                                                        : null
                                                                                                }
                                                                                            </td>
                                                                                            <td className="product-total"> &nbsp; </td>
                                                                                        </tr>
                                                                                    </Fragment>
                                                                                    : ''
                                                                            }
                                                                            {/* Meal end  */}

                                                                            <tr className="cart-subtotal">
                                                                                <td>Subtotal</td>
                                                                                <td data-title="Subtotal">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <span className="woocommerce-Price-currencySymbol"> <strong>{CURRENCY_FORMAT(Number(CART_SUB_TOTAL()) + Number(MEAL_SUB_TOTAL()))} </strong></span>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                            {
                                                                                // Start coupon list
                                                                                (this.state.coupons.length <= 0) ? "" :
                                                                                    this.state.coupons.map(function (coupon, key) {

                                                                                        if (coupon.free_shipping == 1 && coupon.coupon_type == "product") {
                                                                                            this.setState({
                                                                                                freeShipping: 1,
                                                                                                cartShippingCost: 0,
                                                                                            })
                                                                                        } else if (coupon.free_shipping == 1 && coupon.coupon_type == "meal") {
                                                                                            this.setState({
                                                                                                mealShippingCostStatus: false,
                                                                                            })
                                                                                        } else if (coupon.free_shipping == 1 && coupon.coupon_type == "any") {
                                                                                            this.setState({
                                                                                                freeShipping: 1,
                                                                                                cartShippingCost: 0,
                                                                                                mealShippingCostStatus: false
                                                                                            });
                                                                                        }

                                                                                        return (
                                                                                            <Fragment key={key}>
                                                                                                <tr className="cart-subtotal">
                                                                                                    <td>COUPON: {coupon.coupon_code} </td>
                                                                                                    <td data-title="COUPON">
                                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                                            <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(coupon.discount_amount)} [<a onClick={(e) => this.deleteCoupon(e, key)} href="javascript:void(0)">Remove</a>]</span>
                                                                                                        </span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </Fragment>
                                                                                        )
                                                                                    }.bind(this))
                                                                                // End coupon list
                                                                            }

                                                                            {
                                                                                (this.state.items.length <= 0) ? '' :
                                                                                    <Fragment>
                                                                                        <tr className="woocommerce-shipping-totals shipping">
                                                                                            <td>Shipping Cost</td>
                                                                                            <td>
                                                                                                <span className="shipping_address_enter">
                                                                                                    {
                                                                                                        // Start cart shipping

                                                                                                        (this.state.freeShipping == 0) ?
                                                                                                            <Fragment>
                                                                                                                {
                                                                                                                    (this.state.shippingMethods.length <= 0) ? null :
                                                                                                                        this.state.shippingMethods.map(function (shipping, key) {
                                                                                                                            if (shipping.allow_for_coupon == 0) {
                                                                                                                                return (
                                                                                                                                    <Fragment key={key}>
                                                                                                                                        <label> {shipping.label}:
                                                                                                                                            <span className="woocommerce-Price-amount amount">
                                                                                                                                                <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(shipping.cost)} </span>
                                                                                                                                            </span>
                                                                                                                                            {
                                                                                                                                                (this.state.shipping_method_id == shipping.id) ?
                                                                                                                                                    <input onChange={this.changeHandler} onClick={this.changeCartShippingMethod} price={shipping.cost} cid={shipping.id} defaultChecked="checked" type="radio" name="orderShippingMethod" />
                                                                                                                                                    :
                                                                                                                                                    <input onChange={this.changeHandler} onClick={this.changeCartShippingMethod} price={shipping.cost} cid={shipping.id} type="radio" name="orderShippingMethod" />
                                                                                                                                            }
                                                                                                                                        </label><br />
                                                                                                                                    </Fragment>
                                                                                                                                )
                                                                                                                            }
                                                                                                                        }.bind(this))
                                                                                                                }
                                                                                                            </Fragment>
                                                                                                            :
                                                                                                            <Fragment>
                                                                                                                {
                                                                                                                    (this.state.shippingMethods.length <= 0) ? null :
                                                                                                                        this.state.shippingMethods.map(function (shipping, key) {

                                                                                                                            if (shipping.allow_for_coupon == 1) {
                                                                                                                                SET_STORAGE("cartMethodId", shipping.id);
                                                                                                                                return (
                                                                                                                                    <Fragment key={key}>
                                                                                                                                        <label> {shipping.label}:
                                                                                                                                                <span className="woocommerce-Price-amount amount">
                                                                                                                                                <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(shipping.cost)} </span>
                                                                                                                                            </span>
                                                                                                                                            {
                                                                                                                                                (this.state.shipping_method_id == shipping.id || GET_STORAGE("cartMethodId") == shipping.id) ?
                                                                                                                                                    <input onChange={this.changeHandler} onClick={this.changeCartShippingMethod} price={shipping.cost} cid={shipping.id} defaultChecked="checked" type="radio" name="orderShippingMethod" />
                                                                                                                                                    :
                                                                                                                                                    <input onChange={this.changeHandler} onClick={this.changeCartShippingMethod} price={shipping.cost} cid={shipping.id} type="radio" name="orderShippingMethod" />
                                                                                                                                            }
                                                                                                                                        </label><br />
                                                                                                                                    </Fragment>
                                                                                                                                )
                                                                                                                            }
                                                                                                                        }.bind(this))
                                                                                                                }
                                                                                                            </Fragment>
                                                                                                        // End cart shipping
                                                                                                    }
                                                                                                </span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </Fragment>
                                                                            }

                                                                            {/* Start meal shipping cost for total */}
                                                                            {
                                                                                (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0) ?
                                                                                    <Fragment>
                                                                                        <tr className="woocommerce-shipping-totals shipping">
                                                                                            <td>Meal Shipping Cost</td>
                                                                                            <td data-title="Meal Shipping Cost">
                                                                                                <span className="woocommerce-Price-amount amount">
                                                                                                    <span className="woocommerce-Price-currencySymbol">
                                                                                                        {
                                                                                                            (this.state.meals.shipping_cost > 0 && this.state.mealShippingCostStatus == true) ?
                                                                                                                CURRENCY_FORMAT(this.state.meals.shipping_cost)
                                                                                                                : "Free Shipping"
                                                                                                        }
                                                                                                    </span>
                                                                                                </span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </Fragment>
                                                                                    : ''
                                                                            }
                                                                            {/* End meal shipping cost for total */}

                                                                            {
                                                                                (this.state.taxStatus == 0) ? ''
                                                                                    :
                                                                                    <Fragment>
                                                                                        <tr className="woocommerce-shipping-totals shipping">
                                                                                            <td className="">Tax</td>
                                                                                            <td data-title="Tax">
                                                                                                <span className="woocommerce-Price-amount amount">
                                                                                                    <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(Number(this.state.tax_amount) + Number(this.state.meal_tax_amount))} </span>
                                                                                                </span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </Fragment>
                                                                            }
                                                                            <tr className="sub-order-total">
                                                                                <td>Total</td>
                                                                                <td className="sub-order-total-usd">
                                                                                    <strong>
                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                {CURRENCY_FORMAT(CART_TOTAL_CURRENCY_FORMAT(this.state.cartTotal))}
                                                                                            </span>
                                                                                        </span>
                                                                                    </strong>
                                                                                </td>
                                                                            </tr>

                                                                            {
                                                                                (COUNT_SUBSCRIPTION() == 0) ? null :
                                                                                    <Fragment>
                                                                                        <tr>
                                                                                            <td colSpan="2" className="recurring_totals_title">Recurring Totals</td>
                                                                                        </tr>
                                                                                        <tr className="cart-subtotal recurring-total">
                                                                                            <td rowSpan="1">Subtotal</td>
                                                                                            <td className="subtotal">
                                                                                                <span className="woocommerce-Price-amount amount"><span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(RECURRING_CART_SUB_TOTAL())} </span></span> / month
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr className="woocommerce-shipping-totals shipping">
                                                                                            <td>SHIPPING COST</td>
                                                                                            <td data-title="SHIPPING COST">
                                                                                                <span className="shipping_address_enter">
                                                                                                    {
                                                                                                        // Start recurring cart shipping
                                                                                                        (this.state.shippingMethods.length <= 0) ? null :
                                                                                                            this.state.shippingMethods.map(function (shipping, key) {
                                                                                                                if (shipping.allow_for_coupon == 0) {
                                                                                                                    return (
                                                                                                                        <Fragment key={key}>
                                                                                                                            <label > {shipping.label}:
                                                                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                                                                    <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(shipping.cost)} </span>
                                                                                                                                </span>
                                                                                                                                {
                                                                                                                                    (this.state.recurring_shipping_method_id == shipping.id) ?
                                                                                                                                        <input onChange={this.changeRecurringCartShippingMethod} price={shipping.cost} rid={shipping.id} defaultChecked="checked" type="radio" name="recurringOrderShippingMethod" />
                                                                                                                                        :
                                                                                                                                        <input onChange={this.changeRecurringCartShippingMethod} price={shipping.cost} rid={shipping.id} type="radio" name="recurringOrderShippingMethod" />
                                                                                                                                }
                                                                                                                            </label><br />
                                                                                                                        </Fragment>
                                                                                                                    )
                                                                                                                }
                                                                                                            }.bind(this))
                                                                                                        // End recurring cart shipping
                                                                                                    }
                                                                                                </span>
                                                                                            </td>
                                                                                        </tr>
                                                                                        {
                                                                                            (this.state.taxStatus == 0) ? ''
                                                                                                :
                                                                                                <Fragment>
                                                                                                    <tr className="woocommerce-shipping-totals shipping">
                                                                                                        <td className="">Tax</td>
                                                                                                        <td data-title="Tax">
                                                                                                            <span className="woocommerce-Price-amount amount">
                                                                                                                <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(this.state.subscription_tax_amount)} </span>
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </Fragment>
                                                                                        }
                                                                                        <tr className="order-total">
                                                                                            <td rowSpan="1" className="recurring_total_text">Recurring Total</td>
                                                                                            <td className="recurring_total">
                                                                                                <div className="total_per_month">
                                                                                                    <span><span className="woocommerce-Price-currencySymbol">
                                                                                                        {
                                                                                                            CURRENCY_FORMAT(Number(RECURRING_CART_SUB_TOTAL()) + Number(this.state.recurringCartShippingCost) + Number(this.state.subscription_tax_amount))
                                                                                                        }
                                                                                                    </span></span><span className="per_month"> / month</span>
                                                                                                </div>

                                                                                                <div className="first-payment-date">
                                                                                                    <small>First renewal: {NEXT_MONTH()}</small>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </Fragment>
                                                                            }

                                                                            {/* Meal Recurring cart area start */}
                                                                            {
                                                                                (this.state.meals.length <= 0 || this.state.meals.subscription == 'no') ? null :
                                                                                    <Fragment>
                                                                                        <tr>
                                                                                            <td colSpan="2" className="recurring_totals_title">Meal Recurring Totals</td>
                                                                                        </tr>

                                                                                        <tr className="cart-subtotal recurring-total">
                                                                                            <td rowSpan="1">Subtotal</td>
                                                                                            <td className="subtotal">
                                                                                                <span className="woocommerce-Price-amount amount"><span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(MEAL_SUB_TOTAL())} </span></span> /  {this.state.meals.duration_text}
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr className="woocommerce-shipping-totals shipping">
                                                                                            <td>Meal SHIPPING COST</td>
                                                                                            <td data-title="Meal Shipping Cost">
                                                                                                <span className="woocommerce-Price-amount amount">
                                                                                                    {
                                                                                                        (this.state.meals.shipping_cost > 0) ?
                                                                                                            CURRENCY_FORMAT(this.state.meals.shipping_cost)
                                                                                                            : "Free Shipping"
                                                                                                    }
                                                                                                </span>
                                                                                            </td>
                                                                                        </tr>
                                                                                        {
                                                                                            (this.state.taxStatus == 0) ? ''
                                                                                                :
                                                                                                <Fragment>
                                                                                                    <tr className="woocommerce-shipping-totals shipping">
                                                                                                        <td className="">Tax</td>
                                                                                                        <td data-title="Tax">
                                                                                                            <span className="woocommerce-Price-amount amount">
                                                                                                                <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(this.state.subscription_meal_tax_amount)} </span>
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </Fragment>
                                                                                        }
                                                                                        <tr className="order-total">
                                                                                            <td rowSpan="1" className="recurring_total_text">Meal Recurring Total</td>
                                                                                            <td className="recurring_total">
                                                                                                <div className="total_per_month">
                                                                                                    <span><span className="woocommerce-Price-currencySymbol">
                                                                                                        {
                                                                                                            CURRENCY_FORMAT(Number(MEAL_TOTAL()) + Number(this.state.subscription_meal_tax_amount))
                                                                                                        }
                                                                                                    </span></span><span className="per_month"> /  {this.state.meals.duration_text}</span>
                                                                                                </div>
                                                                                                <div className="first-payment-date">
                                                                                                    <small>First renewal: {NEXT_WEEK(this.state.meals.duration_id)}</small>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </Fragment>
                                                                            }
                                                                            {/* Meal Recurring cart area end */}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            {/* End cart view */}

                                                            {/* <div className="checkout-meal-shipping-shedule">
                                                                {
                                                                    (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0) ?
                                                                        <ShippingSchedule />
                                                                        : ""
                                                                }
                                                            </div> */}

                                                            {/* Start payment method */}

                                                            <h3 className="checkout_title">Payment Methods</h3>
                                                            <div className="woocommerce-checkout-payment">
                                                                {
                                                                    (
                                                                        (this.state.cartTotal <= 0 && GET_STORAGE("meals") && this.state.meals.subscription == 'no')
                                                                        ||
                                                                        (this.state.cartTotal <= 0 && COUNT_SUBSCRIPTION() == 0 && !GET_STORAGE("meals"))
                                                                    ) ? "" :
                                                                        <Fragment>
                                                                            <div className="checkout-payment-card-opt">
                                                                                <label htmlFor="payment_method_icanpay"> {this.state.payment_method}  </label>
                                                                                <img src={require("../../Assets/images/card.png")} alt={this.state.payment_method} />
                                                                            </div>
                                                                        </Fragment>
                                                                }

                                                                <div className="payment_box">
                                                                    {
                                                                        (
                                                                            (this.state.cartTotal <= 0 && GET_STORAGE("meals") && this.state.meals.subscription == 'no')
                                                                            ||
                                                                            (this.state.cartTotal <= 0 && COUNT_SUBSCRIPTION() == 0 && !GET_STORAGE("meals"))
                                                                        ) ? "" :
                                                                            <Fragment>
                                                                                <div className="fieldset">
                                                                                    <div className="form-group pull-left name_field">
                                                                                        <label>Name On Card <span className="required">*</span></label>
                                                                                        <input onChange={this.changeHandler} value={this.state.name_on_card} type="text" required className={classnames("cus_field", { 'pl_error_input': errors.name_on_card })} name="name_on_card" />
                                                                                    </div>
                                                                                    <div className="form-group pull-right name_field">
                                                                                        <label>Credit Card Number <span className="required">*</span></label>
                                                                                        <input onChange={this.changeHandler} value={this.state.card_number} type="text" required className={classnames("cus_field", { 'pl_error_input': errors.card_number })} name="card_number" maxLength="16" autoComplete="off" />
                                                                                    </div>
                                                                                    <div className="form-group pull-left name_field card_exp_date">
                                                                                        <label>Expiration Date <span className="required">*</span></label>
                                                                                        <select onChange={this.changeHandler} required className={classnames("pull-left cus_field", { 'pl_error_input': errors.expire_month })} name="expire_month" >
                                                                                            <option value="">Month</option>
                                                                                            <CartMonths />
                                                                                        </select>
                                                                                        <select onChange={this.changeHandler} required className={classnames("pull-right cus_field", { 'pl_error_input': errors.expire_year })} name="expire_year" >
                                                                                            <option value="">Year</option>
                                                                                            <CartYears />
                                                                                        </select>
                                                                                    </div>
                                                                                    <div className="form-group pull-right name_field">
                                                                                        <label>CVV <span className="required">*</span></label>
                                                                                        <input onChange={this.changeHandler} value={this.state.cvv} type="text" required className={classnames("cus_field", { 'pl_error_input': errors.cvv })} name="cvv" maxLength="4" />
                                                                                    </div>
                                                                                    <div className="iCanPayTermsAndCondition">
                                                                                        By placing your order, you agree to our
                                                                                        <NavLink to={`${this.state.terms_of_use}`} target="_blank"> Terms and Conditions </NavLink> and
                                                                                        <NavLink to={`${this.state.privacy_policy}`} target="_blank"> Privacy Policy </NavLink>
                                                                                        <span>Powered and owned by {this.state.payment_method}.</span>
                                                                                    </div>
                                                                                </div>
                                                                            </Fragment>
                                                                    }

                                                                    <div className="agree_section">
                                                                        <label>
                                                                            <input onClick={this.agreeTermsPolicy} id="agreeTermsPolicy" type="checkbox" className="form-check-input" /> I agree to the <NavLink to={`${this.state.terms_of_use}`} target="_blank">Terms and Conditions</NavLink> and <NavLink to={`${this.state.privacy_policy}`} target="_blank">Privacy Policy</NavLink>. <NavLink to="/cancellation-process" target="_blank">Cancellation Process & Information</NavLink>
                                                                        </label>
                                                                    </div>

                                                                </div>

                                                                <div className="card_notification">
                                                                    <p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
                                                                </div>

                                                                {/* End payment method */}

                                                                <div className="form-row place-order">
                                                                    {
                                                                        (this.state.phone_verification_on_checkout == 'enable') ?

                                                                            // Start Facebook KIT Verify
                                                                            <AccountKit
                                                                                appId={this.state.facebook_app_id} // Update this!
                                                                                version={this.state.account_kit_api_version} // Version must be in form v{major}.{minor}
                                                                                onResponse={(resp) => {
                                                                                    if (resp.status === "PARTIALLY_AUTHENTICATED") {
                                                                                        let data = {
                                                                                            code: resp.code,
                                                                                            facebook_app_id: this.state.facebook_app_id,
                                                                                            account_kit_app_secret: this.state.account_kit_app_secret,
                                                                                            account_kit_api_version: this.state.account_kit_api_version,
                                                                                        };
                                                                                        AJAX_ACCOUNT_KIT_REQUEST(data).then(results => {
                                                                                            let phone = results.phone ? results.phone.national_number : null;
                                                                                            if (phone) {
                                                                                                this.setState({
                                                                                                    billing_phone: phone,
                                                                                                    phone_verification_on_checkout: '',
                                                                                                });
                                                                                                $('#billing_phone').attr('readonly', true);
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                }}
                                                                                csrf={this.state.account_kit_app_secret} // Required for security
                                                                                countryCode={'+1'} // eg. +60
                                                                                phoneNumber={`${this.state.billing_phone}`} // eg. 12345678
                                                                                emailAddress={`${this.state.billing_email}`} // eg. me@site.com
                                                                            >
                                                                                {p => <button {...p} type="button" className="wc-forward" name="facebookKit" value="" >Verify phone number before place order</button>}
                                                                            </AccountKit>
                                                                            // End Facebook KIT Verify
                                                                            :
                                                                            <Fragment>
                                                                                {
                                                                                    (this.state.agreeTermsPolicy) ?
                                                                                        <button disabled={this.state.isLoading} type="submit" className={this.state.agreeTermsPolicy ? "wc-forward" : "wc-forward disable"} name="" value="" >{place_order_loading ? "Please Wait..." : "Place Order"}</button>
                                                                                        :
                                                                                        <button disabled className="wc-forward disable">Place Order</button>
                                                                                }
                                                                            </Fragment>
                                                                    }

                                                                </div>
                                                            </div>

                                                        </div>

                                                    </form>
                                                </div>
                                            </div>
                                        </main>
                                    </div>
                                </div>

                                {/* Affiliate email check modal start  */}

                                <div className="modal fade" id="affiliateErrorModal" tabIndex="-1" role="dialog" aria-labelledby="affiliateErrorModal" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header cus-modal-header">
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body montserrat">
                                                <div className="text-danger cus-modal-title">Alert!</div>
                                                <p className="modal-body-content">{this.state.affiliateErrorMessage}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Affiliate email check modal end  */}

                                {/* Product stockout check modal start  */}

                                <div className="modal fade" id="stockoutErrorModal" tabIndex="-1" role="dialog" aria-labelledby="stockoutErrorModal" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header cus-modal-header">
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body montserrat">
                                                <div className="text-danger cus-modal-title">Alert!</div>
                                                <p className="modal-body-content">{Parser(this.state.stockoutErrorMessage)}</p>
                                                <NavLink to="#" onClick={this.backToCart} className="wc-forward">Back to Cart</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product stock check modal end  */}

                                {/* subscription product check modal start  */}

                                <div className="modal fade" id="subscriptionProductErrorModal" tabIndex="-1" role="dialog" aria-labelledby="subscriptionProductErrorModal" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header cus-modal-header">
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body montserrat">
                                                <div className="text-danger cus-modal-title">Alert!</div>
                                                <p className="modal-body-content">{this.state.subscriptionProductErrorMessage}</p>
                                            </div>
                                            <div className="modal-footer">
                                                <button onClick={(e) => this.forceOrderSubmit(e)} type="button" className="cus_button" data-dismiss="modal">Agree &amp; Place Order</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* subscription product check modal end  */}

                                {/* warning modal start  */}
                                <div className="modal fade" id="warningModal" tabIndex="-1" role="dialog" aria-labelledby="warningModal" aria-hidden="true">
                                    <div className="modal-dialog modal-lg" role="document" style={{marginTop: '5%'}}>
                                        <div className="modal-content warningModalContent">
                                            <div className="modal-header cus-modal-header">
                                                <h3>Warnings</h3>
                                                <button type="button" className="close pl-warning-close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body montserrat pl-warning-body">
                                                <div className="mt-2 warning-block-cards" id="warningModalContent"></div>
                                                <div className="d-flex align-items-center justify-content-center py-3">
                                                    <div className="d-flex flex-column">
                                                        <button className="btn mr-4 btn-close" onClick={this.warningModalCancelHandel} type="button" >Cancel</button>
                                                        <span className="warning-cancel-help-text">Remove item(s) from the cart</span>
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <button className="btn btn-confirm" data-dismiss="modal">OK Proceed</button>
                                                        <sapn className="warning-cancel-help-text"></sapn>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* warning modal end  */}

                                {/* canadaRestrictedProductModal start  */}

                                <div className="modal fade" id="canadaRestrictedProductModal" tabIndex="-1" role="dialog" aria-labelledby="canadaRestrictedProductModal" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header cus-modal-header">
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body montserrat">
                                                <div className="text-danger cus-modal-title">Alert!</div>
                                                <p className="modal-body-content" style={{ fontWeight: 'bold' }} id="canadaRestrictedProductModalBody"></p>
                                            </div>
                                            <div className="modal-footer" style={{ justifyContent: "center" }}>
                                                <a href="/cart" className="">Back to Cart</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* canadaRestrictedProductModal end  */}


                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

CheckOut.propTypes = {
    checkoutRequest: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps, { checkoutRequest })(CheckOut);