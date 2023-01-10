import React, { Fragment, PureComponent } from "react";
import ReactImageFallback from "react-image-fallback";
import Parser from "html-react-parser";
import { GET_STORAGE, CURRENCY_FORMAT, SAVE_PERCENTAGE } from "../../../Constants/AppConstants";
import ItemVariation from "./ItemVariation";

class Item extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        const item = this.props.item;
        return (
            <div className="meal_list_content meal_list_content-block">
                <div className="meal_list_img">
                    <ReactImageFallback
                        src={item.hasOwnProperty("thumb_image") ? item.thumb_image : null}
                        fallbackImage={require("../../../Assets/images/preloader.gif")}
                        initialImage={require("../../../Assets/images/preloader.gif")}
                        alt={item.hasOwnProperty("title") ? item.title : ""}
                        className="meal-thumb-img"
                    />
                </div>
                <div className="meal_list_ctg">
                    <h3 className="montserrat">{item.hasOwnProperty("title") ? item.title : ""}
                        <span className="montserrat sub_title">
                            {
                                item.hasOwnProperty("allergen") ?
                                    <span>Allergen: {item.allergen}</span>
                                    : ""
                            }
                        </span>
                    </h3>
                    <div className="selected_meal-radio-block">
                        {
                            (item.variations.length <= 0) ? "" :
                                item.variations.map(function (variation, index) {
                                    return (
                                        <Fragment key={variation.variation_id}>
                                            <ItemVariation
                                                plan={this.props.plan}
                                                item={this.props.item}
                                                addItem={this.props.addItem}
                                                deleteItem={this.props.deleteItem}
                                                planItemLimit={this.props.planItemLimit}
                                                mealCount={this.props.mealCount}
                                                meals={this.props.meals}
                                                priceCalculation={this.props.priceCalculation}
                                                subscription={this.props.subscription}
                                                variation={variation}
                                            />
                                        </Fragment>
                                    )
                                }.bind(this))
                        }
                    </div>
                </div>
                <div className="clearfix" />
            </div>
        );
    }
}

export default Item;