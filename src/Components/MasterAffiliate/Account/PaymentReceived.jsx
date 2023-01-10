import React, { Fragment, PureComponent } from 'react';
import history from "../../../history";
import Parser from 'html-react-parser';
import Pagination from "../../Common/Pagination";
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";

class PaymentReceived extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            paymentReceived: [],
            message: '',
            loading:true,
            // Pagination Config
            total_records   :0,
            total_page      :0,
            per_page        :0,
            pagenum         :1,
        }
        document.title="Received Payments - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getAllReceivedPayments(this.state.pagenum);       
    }

    pagenationHandle= (pageNumber)=>{
        this.setState({ loading:true });
        this.getAllReceivedPayments(pageNumber);        
    }


    getAllReceivedPayments=(pageNumber)=>{
        let data = { pagenum : parseInt(pageNumber) }
        AJAX_REQUEST("POST","master_affiliate/getPaymentReceivedList",data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    paymentReceived: results.response.data.payment_received,
                    message: results.response.message,

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
                            <h2 className=" montserrat page-title">PAYMENT RECEIVED</h2>
                            <table className="my_account_orders shop_table_responsive payment_received">
                                <thead>
                                    <tr>
                                        <th className="text-left">Payout Period</th>
                                        <th className="text-left">Payment Date</th>
                                        <th className="text-left">Payment Details</th>
                                        <th className="text-right">Payment Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.paymentReceived.length <= 0 ? <tr><td className="text-center" colSpan="4">{Parser(this.state.message)}</td></tr>:
                                        this.state.paymentReceived.map(function(payment,key){
                                        return(
                                                <Fragment key={key}>
                                                    <tr>
                                                        <td data-title="Payout Period">{payment.hasOwnProperty('payout_period') ? payment.payout_period: ''}</td>
                                                        <td data-title="Payment Date">{payment.hasOwnProperty('payment_date') ? payment.payment_date: ''}</td>                      
                                                        <td data-title="Payment Details">
                                                            {payment.hasOwnProperty('payment_details')? Parser(payment.payment_details) : ''}  
                                                        </td>                 
                                                        <td data-title="Payment Amount" className="text-right">{payment.hasOwnProperty('payment_amount') ? CURRENCY_FORMAT(payment.payment_amount): ''}</td>                      
                                                    </tr>
                                                </Fragment> 
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
 
export default PaymentReceived;