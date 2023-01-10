import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Pagination from '../../../Common/Pagination';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../../Constants/AppConstants";

class RepresentativeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            status: "",
            total_commission_amount: 0,
            running_commission: 0,
            total_paid_commission: 0,
            total_refund_commission: 0,
            current_balance: 0,
            commission_summary: [],
            error_meg       :'',
            total_records   :0,
            total_page      :0,
            per_page        :0,
            pagenum         :1,
            loading         :true,
            team_member_id:this.props.match.params.id
        }
        document.title = "Member Details -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","distributor/getTeamMemberDetails",{team_member_id:this.state.team_member_id,pagenum:1}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000){
                this.setState({
                    name: results.response.data.name,
                    email: results.response.data.email,
                    status: results.response.data.status,
                    total_commission_amount: results.response.data.total_commission_amount,
                    running_commission: results.response.data.running_commission,
                    total_paid_commission: results.response.data.total_paid_commission,
                    total_refund_commission: results.response.data.total_refund_commission,
                    current_balance: results.response.data.current_balance,
                    commission_summary: results.response.data.commission_summary.commission_summary_list,
                    total_records   :parseInt(results.response.data.commission_summary.total_records),
                    total_page      :parseInt(results.response.data.commission_summary.total_page),
                    per_page        :parseInt(results.response.data.commission_summary.per_page),
                    pagenum         :parseInt(results.response.data.commission_summary.pagenum),
                    error_meg       :results.response.message,
                    loading         :false,
                });	
            }else{
                this.setState({
                    error_meg       :results.response.message,
                    loading         :false,     
                });
            }
        });
    }

    pagenationHandle= (pageNumber)=>{
        this.setState({
            loading:true
        });
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "distributor/getTeamMemberDetails", {
            pagenum:pagenum,
            team_member_id:this.state.team_member_id
        }).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000){
                this.setState({
                    commission_summary: results.response.data.commission_summary.commission_summary_list,
                    total_records   :parseInt(results.response.data.commission_summary.total_records),
                    total_page      :parseInt(results.response.data.commission_summary.total_page),
                    per_page        :parseInt(results.response.data.commission_summary.per_page),
                    pagenum         :parseInt(results.response.data.commission_summary.pagenum),
                    error_meg       :results.response.message,
                    loading         :false,
                });	
            }else{
                this.setState({
                    commission_summary: [],
                    error_meg       :results.response.message,
                    total_records   :0,
                    total_page      :0,
                    per_page        :0,
                    pagenum         :1,
                    loading         :false
                });
            }
        });
    }

    render() { 
        return (
            <Fragment>
            {
                    this.state.loading ? 
                    <div className="loading"></div>
                    :
                <Fragment>
            <div className="woocommerce-MyAccount-content inner_content">
                <h2 className="montserrat page-title">MEMBER DETAILS: <span>{this.state.name}</span>  <NavLink className="montserrat pull-right" to="/my-account/manage-representative">MANAGE</NavLink></h2>

                <table className="my_account_orders">
                    <thead>
                    <tr>
                        <th colSpan="2"><b>Profile Info</b></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Name</td>
                        <td>{this.state.name}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{this.state.email}</td>
                    </tr>

                    <tr>
                        <td>Status</td>
                        <td>{this.state.status}</td>
                    </tr>
                    <tr>
                        <td>Total Commission Earned</td>
                        <td>{CURRENCY_FORMAT(this.state.total_commission_amount)}</td>
                    </tr>
                    <tr>
                        <td>Running Commission</td>
                        <td>{CURRENCY_FORMAT(this.state.running_commission)}</td>
                    </tr>
                    <tr>
                        <td>Total Commission Paid</td>
                        <td>{CURRENCY_FORMAT(this.state.total_paid_commission)}</td>
                    </tr>
                    <tr>
                        <td>Total Commission Cancel/Refund</td>
                        <td>{CURRENCY_FORMAT(this.state.total_refund_commission)}</td>
                    </tr>
                    <tr>
                        <td>Current Balance</td>
                        <td>{CURRENCY_FORMAT(this.state.current_balance)}</td>
                    </tr>
                    </tbody>
                </table>

                <br />
                <h2 className="montserrat page-title">COMMISSION EARNED </h2>
                <table className="my_account_orders shop_table_responsive">
                    <colgroup>
                        <col width="11.11%" />
                        <col width="11.11%" />
                        <col width="11.11%" />
                        <col width="11.11%" />
                        <col width="11.11%" />
                        <col width="11.11%" />
                        <col width="11.11%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="order-number"><span className="nobr">Payout Period</span></th>
                            <th className="order-date"><span className="nobr">Order Count</span></th>
                            <th className="order-status text-right"><span className="nobr">Order Amount</span></th>
                            <th className="order-representative text-right"><span className="nobr">Commission Earned</span></th>
                            <th className="order-total text-right"><span className="nobr">Cancel/Refund</span></th>
                            <th className="order-actions text-right"><span className="nobr">Commission Received</span></th>
                            <th className="order-actions text-right"><span className="nobr">Status</span></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            this.state.commission_summary.length<=0? <tr><td className="text-center" colSpan="7">No Records found</td></tr>:
                            this.state.commission_summary.map(function(order,key){
                            return(
                                <tr className="order" key={key}>
                                    <td className="order-number" data-title="Payout Period">
                                        {order.payout_period}
                                    </td>
                                    <td className="order-date" data-title="Order Count">
                                    {order.order_count}
                                    </td>
                                    <td className="order-status text-right" data-title="Order Amount">
                                    {order.order_total}
                                    </td>
                                    <td className="order-representative  text-right" data-title="Order Commission">
                                    {order.commission_earned}
                                    </td>
                                    <td className="order-total  text-right" data-title="Cancel/Refund">
                                    {order.refund_amount}
                                    </td>
                                    <td className="order-total  text-right" data-title="Carried Forward">
                                    {order.commission_received}
                                    </td>
                                    <td className="order-actions  text-right" data-title="Commission Received">
                                    {order.payout_status}
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
 
export default RepresentativeDetails;