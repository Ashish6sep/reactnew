import React, { Component, Fragment } from 'react';
import Parser from 'html-react-parser';
import { CURRENCY_FORMAT } from "../../../Constants/AppConstants";

class PaymentReceivedList extends Component {
    constructor(props){
        super(props)
        this.state = {  
        }
    }
    render() { 
        return (
            <Fragment>
                <tr>
                    <td data-title="Payout Period">{this.props.payment.hasOwnProperty('payout_period') ? this.props.payment.payout_period: ''}</td>
                    <td data-title="Payment Date">{this.props.payment.hasOwnProperty('payment_date') ? this.props.payment.payment_date: ''}</td>                      
                    <td data-title="Payment Detail">
                        {Parser(this.props.payment.payment_details)}  
                    </td>                 
                    <td data-title="Payment Amount" className="text-right">{this.props.payment.hasOwnProperty('payment_amount') ? CURRENCY_FORMAT(this.props.payment.payment_amount): ''}</td>                      
                </tr>
            </Fragment> 
        );
    }
}
 
export default PaymentReceivedList;