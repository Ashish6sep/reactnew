import React, { Component, Fragment } from 'react';
import PaymentReceivedList from './PaymentReceivedList';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import Pagination from '../../Common/Pagination';

class PaymentReceived extends Component {
    constructor(props){
        super(props)
        this.state = {
            payment_received        :[],
            error_meg               :'',
            total_records           :0,
            total_page              :0,
            per_page                :0,
            pagenum                 :1,
            loading                 :true
        }
        document.title = "Payment Received -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getAllReceivedPayments();       
    }

    getAllReceivedPayments=()=>{
        AJAX_REQUEST("POST","distributor/getPaymentReceivedList",{pagenum:1}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    payment_received:results.response.data.payment_received,
                    total_records   :parseInt(results.response.data.total_records),
                    total_page      :parseInt(results.response.data.total_page),
                    per_page        :parseInt(results.response.data.per_page),
                    pagenum         :parseInt(results.response.data.pagenum),
                    error_meg       :results.response.message,
                    loading         :false
                });	
            }else{
                this.setState({
                    error_meg       :results.response.message,
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
        AJAX_REQUEST("POST", "distributor/getPaymentReceivedList", {
            pagenum:pagenum
        }).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    payment_received:results.response.data.payment_received,
                    total_records   :parseInt(results.response.data.total_records),
                    total_page      :parseInt(results.response.data.total_page),
                    per_page        :parseInt(results.response.data.per_page),
                    pagenum         :parseInt(results.response.data.pagenum),
                    error_meg       :results.response.message,
                    loading         :false,
                });	
            } else {
                this.setState({
                    loading         :false,
                    error_meg       :results.response.message,
                    total_records   :0,
                    total_page      :0,
                    per_page        :0,
                    pagenum         :1,
                    payment_received:[]
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
            <div className="woocommerce-MyAccount-content inner_content">
                <h2 className=" montserrat page-title">PAYMENT RECEIVED</h2>

                <table className="my_account_orders shop_table_responsive payment_received">
                    <thead>
                        <tr>
                            <th>Payout Period</th>
                            <th>Payment Date</th>
                            <th>Payment Details</th>
                            <th className="text-right">Payment Amount</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            this.state.payment_received.length <= 0 ? <tr><td className="text-center" colSpan="4">{this.state.error_meg}</td></tr>:
                            this.state.payment_received.map(function(payment,key){
                            return(
                                <PaymentReceivedList
                                        key                 ={key}
                                        payment             ={payment}
                                />
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
            }
        </Fragment>
        );
    }
}
 
export default PaymentReceived;