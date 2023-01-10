import React, { Component, Fragment } from 'react';
import Pagination from '../../Common/Pagination';
import ZeroOutCommissionList from './ZeroOutCommissionList';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";

class ZeroOutCommission extends Component {
    constructor(props){
        super(props)
        this.state = {
            commisions              :[],
            error_meg               :'',
            total_records           :0,
            total_page              :0,
            per_page                :0,
            pagenum                 :1,
            loading                 :true
        }
        document.title = "Zeroed Out Commissions -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getAllCommisions();      
    }

    getAllCommisions=()=>{
        AJAX_REQUEST("POST","distributor/getZeroOutCommissionList",{pagenum:1}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    commisions      :results.response.data.commisions,
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
        AJAX_REQUEST("POST", "distributor/getZeroOutCommissionList", {
            pagenum:pagenum
        }).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    commisions      :results.response.data.commisions,
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
                    commisions      :[]
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
                    <h2 className=" montserrat page-title">ZEROED OUT COMMISSIONS</h2>

                    <table className="my_account_orders shop_table_responsive">
                        <thead>

                            <tr>
                                <th>Commission of Payout Period</th>
                                <th>Zero out happened at</th>
                                <th className="text-right">Zero out amount</th>
                                <th>Date Time</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                this.state.commisions.length <= 0 ? <tr><td className="text-center" colSpan="4">{this.state.error_meg}</td></tr>:
                                this.state.commisions.map(function(commision,key){
                                return(
                                <ZeroOutCommissionList
                                        key             ={key}
                                        commision       ={commision}
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
            </Fragment>
            }
        </Fragment>
        );
    }
}
 
export default ZeroOutCommission;