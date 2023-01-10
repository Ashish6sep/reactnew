import React, { Fragment, PureComponent } from "react";
import history from '../../../history';
import $ from 'jquery';
import { CURRENCY_FORMAT, SET_STORAGE, GET_STORAGE, AJAX_REQUEST, DESTROY_CART } from "../../../Constants/AppConstants";
import Item from "./Item";

class Plans extends PureComponent {

    constructor(props) {
        super(props);
        // Check Tax
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }
        this.state = {
            taxStatus: settings ? settings.tax_status : 0,
            please_wait: false,
            item_search: '',
            mealList: this.props.plan.meals,
            subscription: this.props.meals.subscription,
            duration_id: this.props.meals.duration_id,
            subTotal: 0,
        }
    }

    componentDidMount() {
        this.priceCalculation();
    }
    componentDidUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            this.priceCalculation();
            this.setState({ duration_id: this.props.meals.duration_id })
        }
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    showHideMealDetails = (plan) => {
        const reset_meals = {
            duration_id: 1,
            duration_text: "Every 1 week",
            plan_id: 0,
            item_count: 0,
            item_add_count: 0,
            plan_name: "",
            quantity: 1,
            shipping_cost: 0,
            subscription: "",
            items: [],
            is_continue: false,
        };

        if (this.props.subscription_id == '') {
            if (this.props.meals.plan_id != plan.plan_id) {
                plan.duration_id = 1;
                plan.duration_text = "Every 1 week";
                this.props.addPlan(plan);
                this.setState({
                    mealList: plan.meals,
                })
            } else {
                this.props.addPlan(reset_meals);
                this.setState({
                    mealList: reset_meals,
                })
            }
        }
    }

    priceCalculation = () => {
        let meals = this.props.meals;
        let subTotal = 0;
        if (meals.items.length > 0) {
            meals.items.forEach(function (item, key) {
                subTotal = Number(subTotal) + (Number(item.meal_quantity * item.meal_price));
            }.bind(this));
        }
        this.setState({
            subTotal: subTotal,
        })
    }

    changeSubscription = (e, subsname, planId) => {

        const element = document.getElementById(`meal_subscription${planId}`);
        const element_f = document.getElementById(`meal_subscription_f${planId}`);
        element.classList.remove("plan-select-error");
        element_f.classList.remove("plan-select-error");

        let subscription = document.getElementById(subsname).value;
        if (subscription == 'yes') {
            document.getElementById(`plan${planId}`).hidden = false;
            document.getElementById(`plan_f${planId}`).hidden = false;
        } else {
            document.getElementById(`plan${planId}`).hidden = true;
            document.getElementById(`plan_f${planId}`).hidden = true;
        }

        this.props.changeSubscription(e.target.value);

        document.getElementById(`meal_subscription${planId}`).value = e.target.value;
        document.getElementById(`meal_subscription_f${planId}`).value = e.target.value;

        let meals = this.props.meals;
        if (meals.items.length > 0) {
            meals.items.forEach(function (item, key) {
                this.props.addItem(item, item.meal_quantity, item.variation, subscription);
            }.bind(this));
        }

        this.priceCalculation();
        this.setState({
            subscription: e.target.value,
        })
    }

    changeDuration = (e, plan_id) => {
        const duration_id = e.target.value;
        const duration_text = document.getElementById(`duration${plan_id}_${duration_id}`).text;
        document.getElementById(`plan${parseInt(plan_id)}`).value = duration_id;
        document.getElementById(`plan_f${parseInt(plan_id)}`).value = duration_id;
        this.props.changeDuration(duration_id, duration_text);
        this.setState({ duration_id: duration_id })
    }

    addMealToCart = (e) => {
        this.setState({ please_wait: true })
        // Update meals subscription
        if (this.props.subscription_id != '') {
            this.getTax();
        } else {
            // Go to cart
            const element = document.getElementById("meal_subscription" + this.props.meals.plan_id);
            const element_f = document.getElementById("meal_subscription_f" + this.props.meals.plan_id);
            if (element.value == null || element.value == '' || element_f.value == null || element_f.value == '') {
                element.classList.add("plan-select-error");
                element_f.classList.add("plan-select-error");
                this.setState({ please_wait: false })
            } else {
                SET_STORAGE("meals", JSON.stringify(this.props.meals));
                history.push('/cart');
            }
        }

    }

    // Get and calculate tax if applicable
    getTax = () => {
        this.setState({
            subscription_meal_tax_amount: 0,
            subscription_meal_tax_info: '',
        })
        if (this.state.taxStatus == 1) {
            let address = this.props.billingAddress;
            let taxData = {
                address_1: address.street_address,
                postcode: address.zip,
                city: address.city,
                state: address.state,
                country: address.country,
                shipping_cost: this.props.meals.shipping_cost,
                meals: this.props.meals
            }
            AJAX_REQUEST("POST", "order/getTax", taxData).then(results => {
                if (parseInt(results.response.code) === 1000 && results.response.data != '') {
                    let data = results.response.data;
                    this.setState({
                        subscription_meal_tax_amount: (data.subscription_meal_tax_amount) ? data.subscription_meal_tax_amount : 0,
                        subscription_meal_tax_info: data.subscription_meal_tax_info,
                    });
                    this.changeMealslItem();
                }
            });
        }
    }
    changeMealslItem = () => {
        let subscription_id = this.props.subscription_id;
        let data = {
            subscription_id: subscription_id,
            subscription_meal_tax_amount: this.state.subscription_meal_tax_amount,
            subscription_meal_tax_info: this.state.subscription_meal_tax_info,
            meals: this.props.meals,
        }
        AJAX_REQUEST("POST", "subscription/updateMealItem", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                DESTROY_CART();
                history.push("/my-account/subscription-order-view/" + subscription_id + "?is_subscription_orders_page=1");
            } else if (parseInt(results.response.code) === 4004) {
                history.push('/meals');
            }
        });
    }

    itemSearch = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        const plan = this.props.plan;

        return (
            <Fragment>
                <div className="meal_list meal_list_active">
                    <div className="meal_list_header_container">
                        <label className="cus_radio">
                            <input onChange={this.changeHandler} onClick={() => this.showHideMealDetails(plan)} type="radio" checked={this.props.meals.plan_id == plan.plan_id ? 'checked' : ''} name="radio" />
                            <span className="checkmark"></span>
                        </label>
                        <div className="meal_per_week">
                            <span className="montserrat meal_per_week_number">{plan.hasOwnProperty('plan_item_count') ? plan.plan_item_count : ''}</span>
                            <span className="meal_per_week_title">{plan.hasOwnProperty('title') ? plan.title : ''}</span>
                        </div>
                        <div className="meal_per_week_rate">

                            {plan.hasOwnProperty('pricing_label') ? plan.pricing_label : ''}

                            {
                                (plan.starting_sale_price) ?
                                    <span className="montserrat">
                                        <span className="meal_compared_price">{plan.starting_price}</span>
                                        {plan.starting_sale_price}
                                    </span>
                                    :
                                    <span>{plan.starting_price}</span>
                            }

                        </div>
                        <span onClick={() => this.showHideMealDetails(plan)} className="pull-right montserrat meal_per_week_down">Select & Choose Meals <i className={(this.props.meals.plan_id == plan.plan_id) ? "fa fa-angle-down" : "fa fa-angle-right"} aria-hidden="true"></i></span>
                        <div className="clearfix"></div>
                    </div>
                    {
                        (this.props.meals.plan_id == plan.plan_id) ?
                            <Fragment>
                                <div className="meal_list_open">
                                    <div className="meal_list_open_header">
                                        <div className="montserrat form-group subs_select">
                                            {
                                                (plan.subscription == 'yes' && this.props.subscription_id == '') ?
                                                    <Fragment>
                                                        <select onChange={(e) => this.changeSubscription(e, `meal_subscription${plan.plan_id}`, plan.plan_id)} id={`meal_subscription${plan.plan_id}`} defaultValue={this.props.meals.subscription} className="form-control" style={{ width: '235px' }}>
                                                            {
                                                                (plan.delivery_frequency_options) ?
                                                                    <Fragment>
                                                                        <option value="">{plan.delivery_frequency_options.default}</option>
                                                                        <option value="no">{plan.delivery_frequency_options.no}</option>
                                                                        <option value="yes">{plan.delivery_frequency_options.yes}</option>
                                                                    </Fragment>
                                                                    : ''
                                                            }
                                                        </select>
                                                    </Fragment>
                                                    : ''
                                            }
                                            {
                                                <select className="form-control" onChange={(e) => this.changeDuration(e, plan.plan_id)} value={this.state.duration_id} id={`plan${parseInt(plan.plan_id)}`} hidden={this.props.meals.subscription == "yes" ? false : true}>
                                                    {
                                                        plan.durations.map(function (duration, key) {
                                                            return (
                                                                <option key={Math.random()} value={duration.id} id={`duration${plan.plan_id}_${duration.id}`} >{duration.text}</option>
                                                            )
                                                        }.bind(this))
                                                    }
                                                </select>
                                            }
                                            <input onChange={(e) => this.itemSearch(e)} className="meal_search_box" type="text" name="item_search" value={this.state.item_search} placeholder="Search" />
                                            <strong>{CURRENCY_FORMAT(this.state.subTotal)}</strong>
                                        </div>
                                        <div className="montserrat pull-right continue_btn">
                                            <div className="selected_number">
                                                {this.props.meals.item_add_count} of {this.props.meals.item_count} Selected
                                            </div>
                                            {
                                                (this.props.meals.item_add_count < this.props.meals.item_count) ?
                                                    <a className="montserrat meal-disble">Continue</a>
                                                    :
                                                    <a onClick={(e) => this.addMealToCart(e)} href="javascript:void(0)" className="montserrat">{(this.state.please_wait) ? "Please Wait..." : (this.props.subscription_id == '') ? "Continue" : "Confirm"}</a>
                                            }
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                    <div className="meal_list_wrapper">
                                        {
                                            (this.state.mealList <= 0) ?
                                                <div className="text-center text-danger">No Meals Item Found!</div> :
                                                this.state.mealList.map(function (category, key) {
                                                    return (
                                                        <Fragment key={`term${category.term_id}`}>
                                                            {
                                                                (category.meal_items <= 0) ? "" :
                                                                    <Fragment>
                                                                        <h6 className="meal-category-type-header"> {category.term_name}</h6>
                                                                        {
                                                                            category.meal_items.map(function (item, key) {
                                                                                return (
                                                                                    <Fragment key={`item${item.meal_id}`}>
                                                                                        {
                                                                                            (this.state.item_search == '' || item.title.toUpperCase().includes(this.state.item_search.toUpperCase())) ?
                                                                                                <Item
                                                                                                    plan={plan}
                                                                                                    item={item}
                                                                                                    addItem={this.props.addItem}
                                                                                                    deleteItem={this.props.deleteItem}
                                                                                                    planItemLimit={this.props.planItemLimit}
                                                                                                    mealCount={this.props.mealCount}
                                                                                                    meals={this.props.meals}
                                                                                                    priceCalculation={this.priceCalculation}
                                                                                                    subscription={this.state.subscription}
                                                                                                />
                                                                                                : ""
                                                                                        }
                                                                                    </Fragment>
                                                                                )
                                                                            }.bind(this))
                                                                        }
                                                                    </Fragment>
                                                            }

                                                        </Fragment>
                                                    )
                                                }.bind(this))
                                        }
                                    </div>
                                    <div className="meal_list_open_header meal_list_open_header_bottom">
                                        <div className="montserrat form-group subs_select">
                                            {
                                                (plan.subscription == 'yes' && this.props.subscription_id == '') ?
                                                    <Fragment>
                                                        <select onChange={(e) => this.changeSubscription(e, `meal_subscription_f${plan.plan_id}`, plan.plan_id)} id={`meal_subscription_f${plan.plan_id}`} defaultValue={this.props.meals.subscription} className="form-control" style={{ width: '235px' }}>
                                                            {
                                                                (plan.delivery_frequency_options) ?
                                                                    <Fragment>
                                                                        <option value="">{plan.delivery_frequency_options.default}</option>
                                                                        <option value="no">{plan.delivery_frequency_options.no}</option>
                                                                        <option value="yes">{plan.delivery_frequency_options.yes}</option>
                                                                    </Fragment>
                                                                    : ''
                                                            }
                                                        </select>
                                                    </Fragment>
                                                    : ''
                                            }
                                            {
                                                <select className="form-control" onChange={(e) => this.changeDuration(e, plan.plan_id)} value={this.state.duration_id} id={`plan_f${parseInt(plan.plan_id)}`} hidden={this.props.meals.subscription == "yes" ? false : true}>
                                                    {
                                                        plan.durations.map(function (duration, key) {
                                                            return (
                                                                <option key={Math.random()} value={duration.id} id={`duration${plan.plan_id}_${duration.id}`} >{duration.text}</option>
                                                            )
                                                        }.bind(this))
                                                    }
                                                </select>
                                            }
                                            <input onChange={(e) => this.itemSearch(e)} className="meal_search_box" type="text" name="item_search" value={this.state.item_search} placeholder="Search" />
                                            <strong>{CURRENCY_FORMAT(this.state.subTotal)}</strong>
                                        </div>

                                        <div className="montserrat pull-right continue_btn">
                                            <div className="selected_number">
                                                {this.props.meals.item_add_count} of {this.props.meals.item_count} Selected
                                            </div>
                                            {
                                                (this.props.meals.item_add_count < this.props.meals.item_count) ?
                                                    <a className="montserrat meal-disble">Continue</a>
                                                    :
                                                    <a onClick={(e) => this.addMealToCart(e)} href="javascript:void(0)" className="montserrat">{(this.state.please_wait) ? "Please Wait..." : (this.props.subscription_id == '') ? "Continue" : "Confirm"}</a>
                                            }
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            </Fragment>
                            : ""
                    }
                </div>
            </Fragment>
        );
    }
}

export default Plans;