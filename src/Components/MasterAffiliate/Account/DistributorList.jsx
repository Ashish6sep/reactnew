import React, { Fragment, PureComponent } from 'react';
import Parser from 'html-react-parser';
import Pagination from "../../Common/Pagination";
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";

class DistributorList extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            distributorList: [],
            loading:true,
            message: '',
            // Pagination Config
            total_records   :0,
            total_page      :0,
            per_page        :0,
            pagenum         :1,
        }
        document.title="Affiliate Lists - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getAllDistributorList(this.state.pagenum);       
    }

    pagenationHandle= (pageNumber)=>{
        this.setState({ loading:true });
        this.getAllDistributorList(pageNumber);        
    }

    getAllDistributorList=(pageNumber)=>{
        let data = { pagenum : parseInt(pageNumber) }
        AJAX_REQUEST("POST","master_affiliate/getDistributorList",data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    distributorList: results.response.data.distributor_list,
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
                        <h2 className=" montserrat page-title">AFFILIATE LIST</h2>
                        <table className="my_account_orders shop_table_responsive payment_received">
                            <thead>
                                <tr>
                                    <th className="text-left">Name</th>
                                    <th className="text-left">Email</th>
                                    <th className="text-right">Affiliate Earnings</th>
                                    <th className="text-right">My Earned Commissions</th>
                                    <th className="text-center">Assigned Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.distributorList.length <= 0 ? <tr><td className="text-center" colSpan="5">{Parser(this.state.message)}</td></tr>:
                                    this.state.distributorList.map(function(distributor,key){
                                    return(
                                            <Fragment key={key}>
                                                <tr>
                                                    <td data-title="Name">{distributor.hasOwnProperty('name') ? distributor.name: ''}</td>
                                                    <td data-title="Email">{distributor.hasOwnProperty('email') ? distributor.email: ''}</td>                      
                                                    <td className="text-right"  data-title="Distributor Earnings">{distributor.hasOwnProperty('distributor_earnings') ? CURRENCY_FORMAT(distributor.distributor_earnings): ''}</td>                      
                                                    <td className="text-right"  data-title="Commission Earnings">{distributor.hasOwnProperty('commission_earnings') ? CURRENCY_FORMAT(distributor.commission_earnings): ''}</td>                      
                                                    <td  data-title="Assign On">{distributor.hasOwnProperty('assign_on') ? distributor.assign_on: ''}</td>                      
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
 
export default DistributorList;