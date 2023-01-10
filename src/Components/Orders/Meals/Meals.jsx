import React, { Fragment, PureComponent } from "react";
import history from '../../../history';
import Parser from 'html-react-parser';
import { AJAX_REQUEST, GET_STORAGE, SET_STORAGE, SAVE_PERCENTAGE } from "../../../Constants/AppConstants";
import Plans from "./Plans";

class Meals extends PureComponent {

    constructor(props) {
        super(props);
        let subscription = GET_STORAGE("meal_subscription") ? GET_STORAGE("meal_subscription") : "";
        this.state = {
            loading: true,
            error: '',
            subscription_id: '',
            billingAddress: {},
            planList: [],
            planItemLimit: 0,
            mealCount: 0,
            meals: {
                duration_id: 1,
                duration_text: "Every 1 week",
                plan_id: 0,
                item_count: 0,
                item_add_count: 0,
                plan_name: "",
                quantity: 1,
                shipping_cost: 0,
                subscription: subscription,
                items: [],
                is_continue: false
            },
        }
        document.title = "Meals - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getPlanList();
    }

    getPlanList = () => {
        AJAX_REQUEST("POST", "meal/getPlanWiseMealList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    planList: results.response.data,
                    loading: false,
                });
                this.getMealList();
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false
                });
            }
        });
    }

    getMealList = () => {
        // Check existing subscription only for change subscription item
        const url = new URL(window.location.href);
        let subscription_id = url.searchParams.get("subscription_id");
        if (subscription_id != null) {
            let data = {
                subscription_id: subscription_id
            }
            AJAX_REQUEST("POST", "subscription/getExistingMeals", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    let existingMeals = results.response.data.meals;
                    SET_STORAGE('meals', JSON.stringify(existingMeals));
                    this.setState({
                        subscription_id: subscription_id,
                        meals: existingMeals,
                        billingAddress: results.response.data.billing_address,
                        planItemLimit: parseInt(existingMeals.item_count),
                        mealCount: parseInt(existingMeals.item_add_count),
                    });
                } else {
                    history.push(`/my-account/subscription-order-view/${subscription_id}`);
                }
            });
        } else {
            let oldMeals = JSON.parse(GET_STORAGE('meals'));
            if (oldMeals) {
                this.setState({
                    meals: oldMeals,
                    planItemLimit: parseInt(oldMeals.item_count),
                    mealCount: parseInt(oldMeals.item_add_count),
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                });
            }
        }
    };

    addItem = (item, quantity, variation, subscription = null) => {
        subscription = (subscription) ? subscription : this.state.subscription;
        let data = [];
        let meal_price = 0;
        if (this.state.meals.subscription == 'yes') {
            // meal_price = (variation.sale_price > 0) ? SAVE_PERCENTAGE(variation.sale_price, item.subscription_save_percentage) : SAVE_PERCENTAGE(variation.regular_price, item.subscription_save_percentage);
            meal_price = parseFloat(variation.subscription_price);
        } else {
            meal_price = parseFloat((variation.sale_price > 0) ? variation.sale_price : variation.regular_price);
        }
        let newItem = {
            meal_id: item.meal_id,
            meal_variation_id: parseInt(variation.variation_id),
            meal_name: item.title,
            meal_quantity: quantity,
            meal_size: variation.variation_name + '-' + variation.term_name,
            meal_price: meal_price,
            meal_thumb_image: item.thumb_image,
            variation: variation,
            subscription_save_percentage: parseFloat(item.subscription_save_percentage),
        };

        if (this.state.meals.items.length > 0) {
            let exMealItems = this.state.meals.items;
            if (exMealItems.length > 0) {
                exMealItems.forEach(function (exItem, key) {
                    if (parseInt(exItem.meal_variation_id) == parseInt(variation.variation_id)) {
                        exItem.meal_variation_id = parseInt(variation.variation_id);
                        exItem.meal_quantity = quantity;
                        exItem.meal_price = meal_price;
                        exItem.variation = variation;
                        data.push(exItem);
                        newItem = null;
                    } else {
                        data.push(exItem);
                    }
                }.bind(this));
                if (newItem != null) {
                    data.push(newItem);
                }
            } else {
                data.push(newItem);
            }

            let meals = this.state.meals;
            meals.items = data;

            let mealCount = this.mealCount();
            meals.item_add_count = mealCount;

            this.setState({
                meals: meals,
                mealCount: mealCount,
            });

        } else {
            data.push(newItem);
            let meals = this.state.meals;
            meals.items = data;

            let mealCount = this.mealCount();
            meals.item_add_count = mealCount;

            this.setState({
                meals: meals,
                mealCount: mealCount,
            });
        }
    };

    deleteItem = (item, variation) => {
        if (this.state.meals.items.length > 0) {
            let meals = this.state.meals;
            meals.items = meals.items.filter(el => el.meal_variation_id != variation.variation_id);
            meals.item_add_count = this.mealCount();
            let mealCount = this.mealCount();
            this.setState({
                meals: meals,
                mealCount: mealCount,
            });
        }
    };

    mealCount = () => {
        let count = 0;
        this.state.meals.items.forEach(function (item, key) {
            count = Number(count) + Number(item.meal_quantity);
        });
        return count;
    };

    addPlan = (data) => {
        const meals = {
            duration_id: data.duration_id,
            duration_text: data.duration_text,
            plan_id: parseInt(data.plan_id),
            item_count: data.plan_item_count,
            item_add_count: 0,
            plan_name: data.title,
            quantity: 1,
            shipping_cost: data.shipping_cost,
            subscription: "",
            items: [],
            is_continue: false,
        };

        let oldMeals = JSON.parse(GET_STORAGE('meals'));
        if (oldMeals && oldMeals.plan_id == data.plan_id) {
            this.setState({
                meals: oldMeals,
                planItemLimit: parseInt(oldMeals.item_count),
                mealCount: parseInt(oldMeals.item_add_count),
            });
        } else {
            this.setState({
                meals: meals,
                planItemLimit: data.plan_item_count,
                mealCount: 0
            });
        }
    }

    changeSubscription = (value) => {
        let state_meals = this.state.meals;
        state_meals.subscription = value;
        this.setState({
            meals: state_meals,
        });
    }

    changeDuration = (duration_id, duration_text) => {
        let state_meals = this.state.meals;
        state_meals.duration_id = duration_id;
        state_meals.duration_text = duration_text;
        this.setState({
            meals: state_meals,
        });
    }

    render() {
        return (
            <Fragment>
                {
                    (this.state.loading) ?
                        <div className="loading container full_page_loader"></div> :
                        <Fragment>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="mealContainer">
                                            {
                                                (this.state.planList.length <= 0) ?
                                                    <div className="text-center">{this.state.error}</div> :
                                                    this.state.planList.map(function (plan, key) {
                                                        return (
                                                            <Fragment key={`plan${plan.plan_id}`}>
                                                                <Plans
                                                                    plan={plan}
                                                                    planItemLimit={this.state.planItemLimit}
                                                                    mealCount={this.state.mealCount}
                                                                    meals={this.state.meals}
                                                                    addItem={this.addItem}
                                                                    addPlan={this.addPlan}
                                                                    deleteItem={this.deleteItem}
                                                                    changeSubscription={this.changeSubscription}
                                                                    changeDuration={this.changeDuration}
                                                                    itemSearch={this.itemSearch}
                                                                    subscription_id={this.state.subscription_id}
                                                                    billingAddress={this.state.billingAddress}
                                                                />
                                                            </Fragment>
                                                        )
                                                    }.bind(this))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default Meals;