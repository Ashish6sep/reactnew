
import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import history from '../../../history';
import ActiveSubscriptionList from './ActiveSubscriptionList';
import Pagination from '../../Common/Pagination';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Parser from 'html-react-parser';

class ActiveSubscription extends Component {
    constructor(props){
        super(props)
        this.state = {
            subscriptions   :[],
            error_meg       :'',
            message         :'',
            total_records   :0,
            total_page      :0,
            per_page        :0,
            pagenum         :1,
            loading:true,
            filter_loading:false
        }
        document.title = "Active Subscriptions -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","subscription/getActiveItems",{pagenum:this.state.pagenum}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    loading:false,
                    subscriptions               :results.response.data.subscriptions,
                    total_records               :results.response.data.total_records,
                    total_page                  :results.response.data.total_page,
                    per_page                    :results.response.data.per_page,
                    pagenum                     :results.response.data.pagenum,
                    message                     :results.response.message
                });	
            } 
            else{
                this.setState({
                    error_meg                   :results.response.message,
                    loading:false,
                })
            }          
        });
    }

    pagenationHandle= (pageNumber)=>{
        this.setState({
            loading:true
        });
        document.querySelector("body").scrollIntoView();
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST","subscription/getActiveItems",{pagenum:pagenum}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    loading:false,
                    subscriptions               :results.response.data.subscriptions,
                    total_records               :results.response.data.total_records,
                    total_page                  :results.response.data.total_page,
                    per_page                    :results.response.data.per_page,
                    pagenum                     :results.response.data.pagenum,
                    error_meg                     :results.response.message
                });	
            } 
            else{
                this.setState({
                    error_meg                   :results.response.message,
                    loading:false,
                })
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
                <h2 className=" montserrat page-title">ACTIVE SUBSCRIPTIONS</h2>
                
                <table className="my_account_orders shop_table_responsive">
                    <thead>
                        <tr>
                            <th className="order-number"><span className="nobr">Subscription ID</span></th>
                            <th className="order-date text-right"><span className="nobr">Subscription Total</span></th>
                            <th className="order-status"><span className="nobr">Start Date</span></th>
                            <th className="order-representative"><span className="nobr">Next Payment</span></th>
                            <th className="order-total"><span className="nobr">Customer</span></th>
                        </tr>
                    </thead>
                    
                        <tbody>
                            {
                                this.state.subscriptions.length <= 0 ? <tr><td className="text-center" colSpan="5">{Parser(this.state.error_meg)}</td></tr>:
                                this.state.subscriptions.map(function(subscription,key){
                                return(
                                <ActiveSubscriptionList
                                        key                 ={key}
                                        subscription        ={subscription}
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
 
export default ActiveSubscription;