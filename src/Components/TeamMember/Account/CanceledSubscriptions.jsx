import React, { Component, Fragment } from 'react';
import {AJAX_REQUEST} from "../../../Constants/AppConstants";
import CanceledSubscriptionsList from './CanceledSubscriptionsList';
import Pagination from '../../Common/Pagination';

class CanceledSubscriptions extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            subscriptions   :[],
            error_meg       :'',
            total_records   :0,
            total_page      :0,
            per_page        :0,
            pagenum         :1,
            loading         :true,
        }
        document.title = "Canceled Subscriptions -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "subscription/getCanceledItems", {pagenum:1}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    subscriptions   :   results.response.data.subscriptions,
                    total_records   :parseInt(results.response.data.total_records),
                    total_page      :parseInt(results.response.data.total_page),
                    per_page        :parseInt(results.response.data.per_page),
                    pagenum         :parseInt(results.response.data.pagenum),
                    error_meg       :results.response.message,
                    loading         :false,
                })     
            } else {
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
        AJAX_REQUEST("POST", "subscription/getCanceledItems", {
            pagenum:pagenum
        }).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    loading         :false,
                    pagenum         :parseInt(results.response.data.pagenum),
                    subscriptions          :results.response.data.subscriptions,
                    total_records   :parseInt(results.response.data.total_records),
                    total_page      :parseInt(results.response.data.total_page),
                    per_page        :parseInt(results.response.data.per_page),
                    error_meg:results.response.message,
                });	
            } else {
                this.setState({
                    loading:false,
                    error_meg:results.response.message,
                    total_records   :0,
                    total_page      :0,
                    per_page        :0,
                    pagenum         :1,
                    subscriptions          :[]
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
                    <h2 className=" montserrat page-title">CANCELED SUBSCRIPTION</h2>

                    <table className="my_account_orders shop_table_responsive">
                        <colgroup>
                            <col width="20%" />
                            <col width="25%" />
                            <col width="25%" />
                            <col width="30%" />
                        </colgroup>
                        <thead>
                        <tr>
                            <th className="order-number"><span className="nobr">Subscription</span></th>
                            <th className="order-date"><span className="nobr">Subscription Start Date</span></th>
                            <th className="order-status"><span className="nobr">Subscription Cancel Date</span></th>
                            <th className="order-total"><span className="nobr">Canceled By</span></th>
                        </tr>
                        </thead>

                        <tbody>

                        {
                        this.state.subscriptions.length <= 0 ? <tr><td className="text-center" colSpan="4">{this.state.error_meg}</td></tr>:
                        this.state.subscriptions.map(function(subscription,key){
                        return(
                        <CanceledSubscriptionsList
                                key             = {key}
                                subscription    ={subscription}
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
 
export default CanceledSubscriptions;