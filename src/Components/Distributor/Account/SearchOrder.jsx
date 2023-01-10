import React, { Component } from 'react';
import {AJAX_REQUEST} from "../../../Constants/AppConstants";
import history from '../../../history';
import OrderLists from './OrderLists';
import TeamMemberLists from './TeamMemberLists';

class SearchOrder extends Component {
    constructor(props){
        super(props)
        this.state = {
            role            :'distributor',
            Orders          :[],
            total_records   :0,
            total_page      :0,
            per_page        :0,
            pagenum         :1,
            order_id        :this.props.match.params.order_id,
            error_meg       :'',
            error_meg_dtm   :'',
            DisTeamMembers  :[],
            team_member_id  :this.props.match.params.team_member_id,
            page_id         :this.props.match.params.page_id
          
        }
        document.title = "Orders -Prestige Labs";
    }
    componentDidMount() {
        document.querySelector("body").scrollIntoView();
       this. getAllOrders();
       this. getDistridutorTeamMembers();
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    selectedMember= (event)=> {
        const memberId              = event.target.value;
        this.setState({
            team_member_id          :memberId
        });	
    }

    getDistridutorTeamMembers=()=>{
		AJAX_REQUEST("POST", "distributor/getTeamMemberList", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    DisTeamMembers          :results.response.data
                });	
            } else {
                this.setState({
                    error_meg_dtm           :results.response.message       
                });
            }            
        }); 
    }

    getAllOrders=()=>{
        let data = {
            pagenum         :1,
            order_id        :this.state.order_id,
            team_member_id  :this.state.team_member_id
        }
		AJAX_REQUEST("POST", "order/getList", data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    Orders          :results.response.data.orders,
                    total_records   :results.response.data.total_records,
                    total_page      :results.response.data.total_page,
                    per_page        :results.response.data.per_page,
                    pagenum         :results.response.data.pagenum
                });	
            } else {
                this.setState({
                    error_meg      :results.response.message       
                });
            }            
        });
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        history.push(`/my-account/view-order/search/${this.state.order_id}/${this.state.team_member_id}/${this.state.page_id}`);
    }

    render() { 
        return ( 
                <div className="woocommerce-MyAccount-content inner_content">
                    <h2 className=" montserrat page-title">Orders</h2>
                    <div className="table_search">
                        <form onSubmit={this.onSubmitHandler} method="post">
                            <label>Team Member</label>
                            <select onChange={this.selectedMember} className="cus_field" name="team_member_id">
                                <option value="">Select One</option>
                                {
                                this.state.DisTeamMembers.length <= 0 ? this.state.error_meg_dtm:
                                this.state.DisTeamMembers.map(function(disTeamMember,key){
                                return(
                                <TeamMemberLists
                                        key             = {key}
                                        disTeamMember   ={disTeamMember}
                                />
                                )
                                })
                                }
                            </select>
                            <input className="cus_field" type="text" name="order_id" onChange={this.changeHandler} placeholder="Order ID" />
                            <input className="roboto_condensed cus_button" type="submit" name="action" value="Search" />
                        </form>
                    </div>

                    <table className="my_account_orders shop_table_responsive">
                        <thead>
                        <tr>
                            <th className="order-number"><span className="nobr">Order</span></th>
                            <th className="order-date"><span className="nobr">Date</span></th>
                            <th className="order-status"><span className="nobr">Status</span></th>
                            <th className="order-representative"><span className="nobr">Team Member</span></th>
                            <th className="order-total"><span className="nobr">Total</span></th>
                            <th className="order-actions"><span className="nobr">&nbsp;</span></th>
                        </tr>
                        </thead>

                        <tbody>
                        {
                        this.state.Orders.length <= 0 ? this.state.error_meg:
                        this.state.Orders.map(function(order,key){
                        return(
                        <OrderLists
                                key     = {key}
                                order   ={order}
                        />
                        )
                        })
                        }
                        </tbody>
                    </table>

                    <div className="tablenav">
                        <div className="tablenav-pages">
                            <nav  className="text-center">
                                <ul className="pagination cus_pagination">
                                    <li className="page-item">
                                        <a className="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                            <span className="sr-only">Previous</span>
                                        </a>
                                    </li>
                                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item">
                                        <a className="page-link" href="#" aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                            <span className="sr-only">Next</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="woocommerce-notices-wrapper"></div>
                </div>
                );
    }
}
 
export default SearchOrder;