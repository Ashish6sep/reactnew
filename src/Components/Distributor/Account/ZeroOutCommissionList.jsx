import React, { Component, Fragment } from 'react';
import { CURRENCY_FORMAT } from "../../../Constants/AppConstants";

class ZeroOutCommissionList extends Component {
    state = {  }
    render() { 
        return ( 
            <Fragment>
                <tr>
                    <td data-title="Commission of Payout Period">{this.props.commision.hasOwnProperty('commission_of_payout_period') ? this.props.commision.commission_of_payout_period: ''}</td>
                    <td data-title="Zero out happened at">{this.props.commision.hasOwnProperty('zero_out_happened_at') ? this.props.commision.zero_out_happened_at: ''}</td>                      
                    <td data-title="Zero out amount" className="text-right">{this.props.commision.hasOwnProperty('zero_out_amount') ? CURRENCY_FORMAT(this.props.commision.zero_out_amount): ''}</td>                      
                    <td data-title="Date Time">{this.props.commision.hasOwnProperty('date_time') ? this.props.commision.date_time: ''}</td>                      
                </tr>
            </Fragment> 
            );
    }
}
 
export default ZeroOutCommissionList;