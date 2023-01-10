import React, { PureComponent, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Pagination from "../../Common/Pagination";
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Parser from 'html-react-parser';

class CommissionEarned extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            commissionEarnedList: [],
            loading:true,
            message: '',
           // Pagination Config
           total_records   :0,
           total_page      :0,
           per_page        :0,
           pagenum         :1,
        }
        document.title="Commission Earned - Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        this.getAllCommissionEarnedList(this.state.pagenum);
    }

    pagenationHandle= (pageNumber)=>{
        this.setState({ loading:true });
        this.getAllCommissionEarnedList(pageNumber);        
    }

    getAllCommissionEarnedList=(pageNumber)=>{
        let data = { pagenum : parseInt(pageNumber) }
        AJAX_REQUEST("POST","master_affiliate/getCommissionEarnedList",data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    commissionEarnedList: results.response.data.commission_earned,
                    message: results.response.message,
                    total_earned: results.response.data.total_earned,
                    payment_received: results.response.data.payment_received,
                    adjustment: results.response.data.adjustment,
                    balance: results.response.data.balance,
                    loading:false,
                    // Pagination Config
                    total_records   :parseInt(results.response.data.total_records),
                    total_page      :parseInt(results.response.data.total_page),
                    per_page        :parseInt(results.response.data.per_page),
                    pagenum         :parseInt(results.response.data.pagenum),
                });	
            } 
            else{
                this.setState({
                    message: results.response.message,
                    loading:false,
                    // Pagination Config
                    total_records   :0,
                    total_page      :0,
                    per_page        :0,
                    pagenum         :1,
                })
            }          
        });
    }

    render() { 
        return (
            <Fragment>
                {
                    (this.state.loading)?
                    <div className="loading"></div>
                    :
                    <Fragment>
                        <div className="woocommerce-MyAccount-content inner_content">
                            <h2 className="montserrat page-title">COMMISSION EARNED <span>(SINCE LAST PAYOUT)</span> <NavLink className="montserrat pull-right" to="/my-affiliate-account/commission-real-time-earnings">REAL-TIME EARNINGS</NavLink></h2>

                            <div className="total_summery">
                                <p>
                                    Total Earned: <b>{CURRENCY_FORMAT(this.state.total_earned)}</b>, 
                                    Payment Received: <b>{CURRENCY_FORMAT(this.state.payment_received)}</b>, 
                                    Adjustment: <b>{CURRENCY_FORMAT(this.state.adjustment)}</b>, 
                                    Balance: <b>{CURRENCY_FORMAT(this.state.balance)}</b>
                                </p>
                            </div>

                            <table className="my_account_orders shop_table_responsive">
                                <colgroup>
                                    <col width="25%" />
                                    <col width="11%" />
                                    <col width="11%" />
                                    <col width="11%" />
                                    <col width="11%" />
                                    <col width="11%" />
                                    <col width="11%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th className="order-number"><span className="nobr">Payout Period</span></th>
                                        <th className="order-date text-right"><span className="nobr">Affiliate Count</span></th>
                                        <th className="order-status text-right"><span className="nobr">Affiliate Earnings</span></th>
                                        <th className="order-representative text-right"><span className="nobr">My Earned Commissions</span></th>
                                        <th className="order-total text-right"><span className="nobr">Commission Adjustment</span></th>
                                        <th className="order-actions text-right"><span className="nobr">Commission Total</span></th>
                                        <th className="order-actions text-right"><span className="nobr">Commission Received</span></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        this.state.commissionEarnedList<=0? <tr><td className="text-center" colSpan="7">{Parser(this.state.message)}</td></tr> :
                                        this.state.commissionEarnedList.map(function(commission,key){
                                        return(
                                            <tr className="order" key={key}>
                                                <td className="order-number text-left" data-title="Payout Period">
                                                    <NavLink className="text_decoration_border mob_left_right_none text_underline" to={`/my-affiliate-account/commission-earned-details/${commission.payout_id}`}>{commission.payout_period}</NavLink>
                                                </td>
                                                <td className="order-status text-right" data-title="Affiliate Count">
                                                    { commission.hasOwnProperty('distributor_count')? commission.distributor_count : '' }
                                                </td>                                    
                                                <td className="order-status text-right" data-title="Affiliate Earnings">
                                                    { commission.hasOwnProperty('distributor_earnings')? CURRENCY_FORMAT(commission.distributor_earnings) : '' }
                                                </td>                                    
                                                <td className="order-status text-right" data-title="Earning Commission">
                                                    { commission.hasOwnProperty('earning_commission')? CURRENCY_FORMAT(commission.earning_commission) : '' }
                                                </td>
                                                {
                                                    Number(commission.commission_adjustment)>0?
                                                    <td className="order-actions  text-right" data-title="Commission Adjustment"><NavLink to={`/my-affiliate-account/commission-earned/adjustment-details/${commission.payout_id}`}>{ commission.hasOwnProperty('commission_adjustment')? CURRENCY_FORMAT(commission.commission_adjustment) : '' }</NavLink></td>
                                                    :
                                                    <td className="order-status text-right" data-title="Commission Adjustment">
                                                    { commission.hasOwnProperty('commission_adjustment')? CURRENCY_FORMAT(commission.commission_adjustment) : '' }
                                                    </td> 
                                                }                               
                                                <td className="order-status text-right" data-title="commission total">
                                                    { commission.hasOwnProperty('commission_total')? CURRENCY_FORMAT(commission.commission_total) : '' }
                                                </td>                                    
                                                <td className="order-status text-right" data-title="commission received">
                                                    { commission.hasOwnProperty('commission_received')? CURRENCY_FORMAT(commission.commission_received) : '' }
                                                </td>                                    
                                            </tr>
                                        )
                                        })
                                    }
                                </tbody>
                            </table> 
                            <Pagination
                                pagenationHandle    ={this.pagenationHandle}
                                total_records       ={this.state.total_records}
                                total_page          ={this.state.total_page}
                                per_page            ={this.state.per_page}
                                pagenum             ={this.state.pagenum}
                            />
                        </div>
                    </Fragment>
                }
            </Fragment>
        );
    }
}


export default CommissionEarned;