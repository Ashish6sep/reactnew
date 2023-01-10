import React, { Fragment, PureComponent } from "react";
import ReactImageFallback from "react-image-fallback";
import Parser from "html-react-parser";
import { GET_STORAGE, CURRENCY_FORMAT, SAVE_PERCENTAGE } from "../../../Constants/AppConstants";

class ItemVariation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentQuantity: 0,
        };
    }

    componentDidMount() {
    }

    addItem = (quantity) => {
        const variation = this.props.variation;
        const item = this.props.item;
        document.getElementById(`v${variation.variation_id}`).checked = true;
        this.setState({ currentQuantity: quantity })
        this.props.addItem(item, quantity, variation);
        this.props.priceCalculation();
    };

    deleteItem = (item) => {
        const variation = this.props.variation;
        this.setState({ currentQuantity: 0 })
        document.getElementById(`v${variation.variation_id}`).checked = false;
        this.props.deleteItem(item, variation);
        this.props.priceCalculation();
    }

    render() {
        const variation = this.props.variation;

        let meal_price = parseFloat((variation.sale_price > 0) ? variation.sale_price : variation.regular_price);

        if (this.props.subscription == 'yes' || this.props.meals.subscription == 'yes') {
            meal_price = parseFloat(variation.subscription_price);
        }

        const item = this.props.item;
        let options = [];

        let meal_item_current_qty = this.state.currentQuantity;
        if (this.props.meals.items.length > 0) {
            this.props.meals.items.forEach(function (item_single, key) {
                if (item_single.meal_variation_id == variation.variation_id) {
                    meal_item_current_qty = item_single.meal_quantity;
                    // select existing variation
                    this.setState({
                        currentQuantity: meal_item_current_qty,
                    })
                    if (document.getElementById(`v${item_single.meal_variation_id}`)) {
                        document.getElementById(`v${item_single.meal_variation_id}`).checked = true;
                    }
                }
            }.bind(this));
        }

        for (let i = 1; i <= this.props.planItemLimit; i++) {
            if (meal_item_current_qty > 0) {
                if (i <= meal_item_current_qty) {
                    options.push(
                        <span
                            key={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                            onClick={e => this.addItem(i)}
                            className="active"
                        />
                    );
                } else {
                    const remaining_diff = this.props.planItemLimit - this.props.mealCount;
                    if (i <= remaining_diff + meal_item_current_qty) {
                        options.push(
                            <span
                                key={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                                id={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                                onClick={e => this.addItem(i)}
                                className=""
                            />
                        );
                    } else {
                        options.push(
                            <span
                                key={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                                id={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                                className="meal-item-disble"
                            />
                        );
                    }
                }
            } else {
                if (i <= this.props.planItemLimit - this.props.mealCount) {
                    options.push(
                        <span
                            key={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                            onClick={e => this.addItem(i)}
                            className=""
                        />
                    );
                } else {
                    options.push(
                        <span
                            key={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.plan_id}m${item.meal_id}i${i}`}
                            className="meal-item-disble"
                        />
                    );
                }
            }
        }

        return (
            <div className="selected_meal-radio-block-box">
                <Fragment key={variation.variation_id}>

                    <div className="selected_meal-radio-block-box-left">
                        <Fragment>
                            <label className="selected_meal-radio">
                                <small>
                                    {variation.variation_name}&nbsp;
                                    {
                                        (variation.hasOwnProperty('price_difference') && variation.price_difference) ?
                                            <span> {variation.price_difference}</span>
                                            : ""
                                    }
                                    {/* ({
                                        (variation.sale_price > 0) ?
                                            <Fragment>
                                                <span className="compared_price">{CURRENCY_FORMAT(variation.regular_price)}</span>
                                                &nbsp;
                                            </Fragment>
                                            : ""
                                    }
                                    {
                                        CURRENCY_FORMAT(meal_price)
                                        // (this.props.subscription == 'yes' || this.props.meals.subscription == 'yes') ?
                                        //     CURRENCY_FORMAT(SAVE_PERCENTAGE(meal_price, item.subscription_save_percentage))
                                        //     :
                                        //     CURRENCY_FORMAT(meal_price)
                                    }) */}
                                </small>
                                <input value={variation.variation_id} type="radio" name={`variation${variation.variation_id}`} id={`v${variation.variation_id}`} />
                                <span className="checkmark"></span>
                            </label>
                        </Fragment>

                        <Fragment>
                            {
                                (variation.options.length <= 0) ? "" :
                                    <Fragment>
                                        <div className="selected_meal-protein">
                                            <ul>
                                                {
                                                    variation.options.map(function (option, index) {
                                                        return (
                                                            <Fragment key={option.option_id}>
                                                                <li>
                                                                    <strong>{option.option_name}</strong>
                                                                    <span>{option.option_value}</span>
                                                                </li>
                                                            </Fragment>
                                                        )
                                                    }.bind(this))
                                                }
                                            </ul>
                                        </div>
                                    </Fragment>
                            }
                        </Fragment>
                    </div>

                    <div className="selected_meal-radio-block-box-right">
                        <Fragment>
                            <div className="inner-container">
                                <div className="centered-content meal_list_qnt">
                                    <div className="meal_list_qnt-options-box_clear">
                                        {
                                            (meal_item_current_qty > 0) ?
                                                <a onClick={() => this.deleteItem(item)} className="reset-rating" title="Clear"> Clear </a>
                                                : ""
                                        }
                                    </div>
                                    <div className="meal_list_qnt-options-box">
                                        <div className="meal_list_qnt-options">
                                            {options}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    </div>
                </Fragment>
            </div>
        );
    }
}

export default ItemVariation;