import React, { Fragment, PureComponent } from 'react';
import $ from "jquery";
import Parser from 'html-react-parser';
import { NavLink } from "react-router-dom";
import CartMonths from '../../Common/CartMonths';
import CartYears from '../../Common/CartYears';
import classnames from 'classnames';
import cardValidate from '../../../Validations/CardValidate';
import { AJAX_REQUEST, CRYPTO_ENCRYPTION } from "../../../Constants/AppConstants";

import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';

class MyCards extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            showCardForm: false,
            errorMeg: '',
            myCards: [],

            name_on_card: '',
            card_number: '',
            expire_month: '',
            expire_year: '',
            cvv: '',

            // Validation
            action_btn_label: false,
            success_alert_wrapper_show: false,
            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            server_message: ''
        }
        document.title = "My Cards -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        // document.getElementById("pageTitle").innerHTML = "My Cards";
        this.getMyCards();
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false,
                server_message: '',
            });
        }.bind(this), timedata);
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

    showCardForm = (e) => {
        this.setState({ showCardForm: true })
    }

    getMyCards = () => {
        AJAX_REQUEST("POST", "customer/getSaveCardList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    myCards: results.response.data,
                    errorMeg: results.response.message
                });
            } else {
                this.setState({
                    loading: false,
                    myCards: [],
                    errorMeg: results.response.message
                })
            }
        });
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        const data = {
            name_on_card: this.state.name_on_card,
            card_number: CRYPTO_ENCRYPTION(this.state.card_number),
            expire_month: this.state.expire_month,
            expire_year: this.state.expire_year,
            cvv: CRYPTO_ENCRYPTION(this.state.cvv),
        }
        const val_return = cardValidate(data);
        this.setState(val_return);

        if (val_return.isValid) {
            this.setState({ errors: {}, isLoading: true, action_btn_label: true });
            AJAX_REQUEST("POST", "customer/addNewCard", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    this.setState({ showCardForm: false })
                    this.getMyCards();
                    this.setState({
                        name_on_card: '',
                        card_number: '',
                        expire_month: '',
                        expire_year: '',
                        cvv: '',
                        server_message: results.response.message,
                        action_btn_label: false,
                        isLoading: false,
                        isFormValid: true,
                        success_alert_wrapper_show: true
                    });
                    document.getElementById("card_form").reset();
                    document.querySelector("body").scrollIntoView();
                    this.timeOut(5000);
                } else {
                    this.setState({
                        action_btn_label: false,
                        server_message: results.response.message,
                        isLoading: false,
                        isFormValid: false,
                        success_alert_wrapper_show: false
                    })
                    document.querySelector("body").scrollIntoView();
                }
            });
        } else {
            document.querySelector("body").scrollIntoView();
        }
    }

    deleteCart = (e, cartId = null, cartStatus) => {
        e.preventDefault();
        this.setState({
            success_alert_wrapper_show: false
        })
        let data = {
            card_id: cartId,
        }

        let alertMsg = "Are you sure you want delete this cart?"
        if (cartStatus == 'Active') {
            alertMsg = alertMsg + " " + "You have active subscription, Deleting this card will cause payment failure while subscription renewal.";
        }

        if (window.confirm(alertMsg)) {
            document.querySelector("body").scrollIntoView();
            AJAX_REQUEST("POST", "customer/deleteCard", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    this.getMyCards();
                    this.setState({
                        success_alert_wrapper_show: true,
                        server_message: results.response.message,
                    })
                    this.timeOut(5000);
                } else {
                    this.setState({
                        success_alert_wrapper_show: false,
                    })
                }
            });
        }

    }

    render() {

        const { errors, server_message, success_alert_wrapper_show } = this.state;

        return (
            <Fragment>
                <div className="">

                    <AlertWrapper errors_data={server_message} isFormValid={this.state.isFormValid} />
                    <AlertWrapperSuccess errors_data={server_message} success_alert_wrapper_show={success_alert_wrapper_show} />

                    {
                        (this.state.loading) ?
                            <div className="loading"></div>
                            :
                            <div className="woocommerce-MyAccount-content inner_content">
                                <div className="text-right add_new_card">
                                    <h2 className=" montserrat page-title">MY SAVE CARDS
                                    <span onClick={this.showCardForm} className="pull-right roboto_condensed wc-forward">Add New</span>
                                    </h2>
                                </div>
                                <table className="my_account_orders shop_table_responsive">
                                    <colgroup>
                                        <col width="20%" />
                                        <col width="20%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                        <col width="20%" />
                                        <col width="10%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="order-number"><span className="nobr">Name On Card</span></th>
                                            <th className="order-date"><span className="nobr">Card Number</span></th>
                                            <th className="order-status"><span className="nobr">Expiration Date</span></th>
                                            <th className="order-total"><span className="nobr">Status</span></th>
                                            <th className="order-total"><span className="nobr">Added</span></th>
                                            <th className="order-actions"><span className="nobr">Action</span></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            (this.state.myCards.length <= 0) ?
                                                <tr><td className="text-center" colSpan="6">{this.state.errorMeg}</td></tr>
                                                :
                                                this.state.myCards.map(function (card, key) {
                                                    return (
                                                        <Fragment key={key}>
                                                            <tr className="order">
                                                                <td className="order-number" data-title="Name On Card">
                                                                    {card.hasOwnProperty('name_on_card') ? card.name_on_card : ''}
                                                                </td>
                                                                <td className="order-date" data-title="Card Number">
                                                                    {card.hasOwnProperty('card_number') ? card.card_number : ''}
                                                                </td>
                                                                <td className="order-status" data-title="Expiration Date">
                                                                    {card.hasOwnProperty('expire_month') ? card.expire_month : ''}
                                                                    /
                                                                    {card.hasOwnProperty('expire_year') ? card.expire_year : ''}
                                                                </td>
                                                                <td className="order-actions" data-title="Status">
                                                                    {card.hasOwnProperty('status') ? card.status : ''}
                                                                </td>
                                                                <td className="order-actions" data-title="Added">
                                                                    {card.hasOwnProperty('added') ? card.added : ''}
                                                                </td>
                                                                <td className="order-actions" data-title="Action">
                                                                    <NavLink onClick={(e) => this.deleteCart(e, card.card_id, card.status)} to="#" className="order_actions_edit"><i className="fa fa-trash text-danger" aria-hidden="true"></i></NavLink>
                                                                </td>
                                                            </tr>
                                                        </Fragment>
                                                    )
                                                }.bind(this))
                                        }
                                    </tbody>
                                </table>
                                <Fragment>
                                    <div style={{ display: (!this.state.showCardForm) ? "none" : "" }} className="add_new_card_form">
                                        <h2 className="montserrat page-title">SAVE CARDS</h2>
                                        <form onSubmit={this.onSubmitHandler} id="card_form">
                                            <div className="form-group pull-left name_field">
                                                <label>Name On Card <span className="required">*</span></label>
                                                <input onChange={this.changeHandler} value={this.state.name_on_card} type="text" className={classnames("cus_field", { 'pl_error_input': errors.name_on_card })} name="name_on_card" />
                                            </div>
                                            <div className="form-group pull-right name_field">
                                                <label>Credit Card Number <span className="required">*</span></label>
                                                <input onChange={this.changeHandler} value={this.state.card_number} type="text" className={classnames("cus_field", { 'pl_error_input': errors.card_number })} name="card_number" maxLength="16" autoComplete="off" />
                                            </div>
                                            <div className="form-group pull-left name_field card_exp_date">
                                                <label>Expiration Date <span className="required">*</span></label>
                                                <select onChange={this.changeHandler} className={classnames("pull-left cus_field", { 'pl_error_input': errors.expire_month })} name="expire_month" >
                                                    <option value="">Month</option>
                                                    <CartMonths />
                                                </select>
                                                <select onChange={this.changeHandler} className={classnames("pull-right cus_field", { 'pl_error_input': errors.expire_year })} name="expire_year" >
                                                    <option value="">Year</option>
                                                    <CartYears />
                                                </select>
                                            </div>
                                            <div className="form-group pull-right name_field">
                                                <label>CVV <span className="required">*</span></label>
                                                <input onChange={this.changeHandler} value={this.state.cvv} type="text" className={classnames("cus_field", { 'pl_error_input': errors.cvv })} name="cvv" maxLength="4" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="form-group">
                                                <p> To verify the new card, USD 1.00 will be charged temporarily and will be refunded within 3-7 working days. </p>
                                            </div>

                                            <div className="form-group">
                                                <button type="submit" className="roboto_condensed cus_button" name="save" value="save">{this.state.action_btn_label ? "Saving..." : "Save Card"}</button>
                                            </div>
                                        </form>
                                    </div>
                                </Fragment>
                            </div>
                    }
                </div>
            </Fragment>
        );
    }
}

export default MyCards;