import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import TeamMemberLists from './TeamMemberLists';
import Pagination from '../../Common/Pagination';
import OrderLists from './OrderLists';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';

let dist_team_members = [];

class OrderByMe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order_id: '',
            customer_name: '',
            team_member_id: '',
            is_affiliate_sale: '',
            order_type: '',
            orders: [],
            error_meg: '',
            error_meg_dtm: '',
            dis_team_members: [],
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true,
            filter_loading: false
        }
        document.title = "Orders -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "distributor/getTeamMemberListOption", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                dist_team_members = results.response.data.team_members;
            } else {
                // console.log(results.response.message);
            }
        });

        AJAX_REQUEST("POST", "order/getList", {
            pagenum: 1
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    orders: results.response.data.orders,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    pagenum: parseInt(results.response.data.pagenum),
                    error_meg: results.response.message,
                    dis_team_members: dist_team_members
                });
            } else {
                this.setState({
                    loading: false,
                    error_meg: results.response.message
                });
            }
        });
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    pagenationHandle = (pageNumber) => {
        this.setState({
            loading: true
        });
        document.querySelector("body").scrollIntoView();
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "order/getList", {
            pagenum: pagenum,
            team_member_id: document.getElementById("team_member_id").value,
            is_affiliate_sale: document.getElementById("is_affiliate_sale").value,
            order_type: document.getElementById("order_type").value,
            customer_name: document.getElementById("customer_name").value,
            order_id: document.getElementById("order_id").value,
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    pagenum,
                    orders: results.response.data.orders,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    error_meg: results.response.message
                });
            } else {
                this.setState({
                    loading: false,
                    error_meg: results.response.message,
                    total_records: 0,
                    total_page: 0,
                    per_page: 0,
                    pagenum: 1,
                    orders: []
                });
            }
        });
    }

    selectedMember = (event) => {
        const memberId = parseInt(event.target.value);
        this.setState({
            team_member_id: memberId
        });
    }

    selectedIsReferrer = (event) => {
        this.setState({
            is_affiliate_sale: event.target.value
        });
    }

    selectedOrderType = (event) => {
        this.setState({
            order_type: event.target.value
        });
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.setState({
            loading: true,
            filter_loading: true
        });
        AJAX_REQUEST("POST", "order/getList", {
            team_member_id: document.getElementById("team_member_id").value,
            is_affiliate_sale: document.getElementById("is_affiliate_sale").value,
            order_type: document.getElementById("order_type").value,
            customer_name: document.getElementById("customer_name").value,
            order_id: document.getElementById("order_id").value,
            pagenum: 1
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    filter_loading: false,
                    pagenum: 1,
                    orders: results.response.data.orders,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    error_meg: results.response.message
                });
            } else {
                this.setState({
                    loading: false,
                    filter_loading: false,
                    error_meg: results.response.message,
                    total_records: 0,
                    total_page: 0,
                    per_page: 0,
                    pagenum: 1,
                    orders: []
                });
            }
        });
    }

    render() {
        const { user } = this.props.auth;
        return (
            <div className="woocommerce-MyAccount-content inner_content">
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <h2 className=" montserrat page-title">ORDERS</h2>
                            <div className="table_search order_search">
                                <form onSubmit={this.onSubmitHandler} method="post">
                                    {
                                        user.sales_agent_feature === "enable" ?
                                            <Fragment>
                                                <label>Team Member</label>
                                                <select onChange={this.selectedMember} id="team_member_id" className="cus_field" name="team_member_id" defaultValue={this.state.team_member_id}  style={{ width: "110px" }}>
                                                    <option value="">Select One</option>
                                                    {
                                                        this.state.dis_team_members.length <= 0 ? Parser(this.state.error_meg_dtm) :
                                                            this.state.dis_team_members.map(function (disTeamMember, key) {
                                                                return (
                                                                    <TeamMemberLists
                                                                        key={key}
                                                                        disTeamMember={disTeamMember}
                                                                    />
                                                                )
                                                            })
                                                    }
                                                </select>

                                            </Fragment>
                                            :
                                            <Fragment>
                                                <input type="hidden" id="team_member_id" name="team_member_id" defaultValue="" />
                                            </Fragment>
                                    }
                                    <select onChange={this.selectedIsReferrer} id="is_affiliate_sale" className="cus_field" name="is_affiliate_sale" defaultValue={this.state.is_affiliate_sale}  style={{ width: "100px" }}>
                                        <option value="">Is Referrer</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                    <select onChange={this.selectedOrderType} id="order_type" className="cus_field" name="order_type" defaultValue={this.state.order_type}  style={{ width: "100px" }}>
                                        <option value="">All Types</option>
                                        <option value="supplement">Product</option>
                                        <option value="meal">Meal</option>
                                    </select>
                                    <input className="cus_field" type="text" id="customer_name" name="customer_name" onChange={this.changeHandler} placeholder="Customer Name" value={this.state.customer_name} />
                                    <input className="cus_field" type="text" id="order_id" name="order_id" onChange={this.changeHandler} placeholder="Order ID" value={this.state.order_id}  style={{ width: "100px" }} />
                                    <input className="roboto_condensed cus_button" type="submit" name="action" value={this.state.filter_loading ? "Searching..." : "Search"} />
                                </form>
                            </div>

                            <table className="my_account_orders shop_table_responsive">
                                <colgroup>
                                    <col width="5%" />
                                    <col width="14%" />
                                    <col width="9%" />
                                    <col width="9%" />
                                    <col width="14%" />
                                    <col width="10%" />
                                    <col width="14%" />
                                    <col width="5%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th className="order-number"><span className="nobr">Orders</span></th>
                                        <th className="order-date"><span className="nobr">Date</span></th>
                                        <th className="order-status"><span className="nobr">Status</span></th>
                                        <th className="order-type"><span className="nobr">Order Type</span></th>
                                        <th className="order-representative"><span className="nobr">Team Member</span></th>
                                        <th className="referrer-order"><span className="nobr">Is Referrer</span></th>
                                        <th className="order-total"><span className="nobr">Total</span></th>
                                        <th className="order-actions"><span className="nobr">&nbsp;</span></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        this.state.orders.length <= 0 ? <tr><td className="text-center" colSpan="8">{Parser(this.state.error_meg)}</td></tr> :
                                            this.state.orders.map(function (order, key) {
                                                return (
                                                    <OrderLists
                                                        key={key}
                                                        order={order}
                                                        dist_team_members={dist_team_members}
                                                    />
                                                )
                                            })
                                    }
                                </tbody>
                            </table>



                            <Pagination
                                pagenationHandle={this.pagenationHandle}
                                total_records={this.state.total_records}
                                total_page={this.state.total_page}
                                per_page={this.state.per_page}
                                pagenum={this.state.pagenum}
                            />

                            <div className="woocommerce-notices-wrapper"></div>
                        </Fragment>
                }
            </div>
        );
    }
}


OrderByMe.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps)(OrderByMe);