import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Parser from 'html-react-parser';
import Pagination from '../../Common/Pagination';

class CommissionAdjustmentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payout_period: "",
            adjustment_data: [],
            total_adjustment:0,
            error_msg       :'',
            total_records   :0,
            total_page      :0,
            per_page        :0,
            pagenum         :1,
            loading         :true
        }
        document.title = "Commission Details -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","master_affiliate/getAdjustmentDetails",{payout_id:this.props.match.params.id,pagenum:1}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    payout_period: results.response.data.payout_period,
                    adjustment_data: results.response.data.adjustment_data,
                    total_adjustment:results.response.data.total_adjustment,
                    total_records   :parseInt(results.response.data.total_records),
                    total_page      :parseInt(results.response.data.total_page),
                    per_page        :parseInt(results.response.data.per_page),
                    pagenum         :parseInt(results.response.data.pagenum),
                    error_msg       :results.response.message,
                    loading         :false
                });	
            }else{
                this.setState({
                    error_msg       :results.response.message,
                    loading         :false
                });
            }           
        });
    }

    pagenationHandle= (pageNumber)=>{
        this.setState({
            loading:true
        });
        document.querySelector("body").scrollIntoView();
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "master_affiliate/getAdjustmentDetails", {
            pagenum:pagenum,payout_id:this.props.match.params.id
        }).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    payout_period: results.response.data.payout_period,
                    adjustment_data: results.response.data.adjustment_data,
                    total_adjustment:results.response.data.total_adjustment,
                    total_records   :parseInt(results.response.data.total_records),
                    total_page      :parseInt(results.response.data.total_page),
                    per_page        :parseInt(results.response.data.per_page),
                    pagenum         :parseInt(results.response.data.pagenum),
                    error_msg       :results.response.message,
                    loading         :false,
                });	
            } else {
                this.setState({
                    loading         :false,
                    error_msg       :results.response.message,
                    total_records   :0,
                    total_page      :0,
                    per_page        :0,
                    pagenum         :1,
                    payout_period: "",
                    adjustment_data: [],
                    total_adjustment:0
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
                    <h2 className=" montserrat page-title">COMMISSION ADJUSTMENT DETAILS: {this.state.payout_period}</h2>

                    <table className="my_account_orders shop_table_responsive">
                        <thead>
                            <tr>
                                <th>Date Time</th>
                                <th>Remarks</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.adjustment_data.length <= 0 ? <tr><td className="text-center" colSpan="4">{this.state.error_msg}</td></tr>:
                                this.state.adjustment_data.map(function(order,key){
                                return(
                                    <tr key={key}>
                                        <td>{order.date}</td>                                            
                                        <td><span>{order.remarks}</span></td>
                                        <td className="text-right"><span>{Parser(order.amount)}</span></td>
                                    </tr>
                                )
                                })
                            }
                            <tr>
                                <th className="text-right" colSpan="2">Total</th>
                                <th className="text-right">{CURRENCY_FORMAT(this.state.total_adjustment)}</th>
                            </tr>
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
 
export default CommissionAdjustmentDetails;