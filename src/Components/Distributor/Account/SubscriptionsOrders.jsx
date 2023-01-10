import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import $ from "jquery";
import moment from "moment";
import daterangepicker from "daterangepicker";
import Pagination from "../../Common/Pagination";
import OrderLists from "./OrderLists";
import OrderStatusList from "./OrderStatusList";
import Parser from "html-react-parser";

let order_st_data = [];
let dist_team_members = [];
let order_date_from_g = moment().subtract(29, "days");
let order_date_to_g = moment();

class SubscriptionsOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order_date_from: null,
      order_date_to: null,
      order_status: "",
      customer_name: "",
      is_affiliate_sale: "",
      order_type: '',
      orders: [],
      order_status_arr: [],
      error_meg: "",
      dis_team_members: [],
      total_records: 0,
      total_page: 0,
      per_page: 0,
      pagenum: 1,
      loading: true,
      filter_loading: false
    };
    document.title = "Subscription Orders -Prestige Labs";
  }

  componentDidMount() {
    order_date_from_g = moment().subtract(29, "days");
    order_date_to_g = moment();
    document.querySelector("body").scrollIntoView();
    AJAX_REQUEST("POST", "order/getOrderStatus", {}).then(results => {
      if (parseInt(results.response.code) === 1000) {
        order_st_data = results.response.data;
      } else {
        // console.log(results.response.message);
      }
    });

    AJAX_REQUEST("POST", "distributor/getTeamMemberListOption", {}).then(
      results => {
        if (parseInt(results.response.code) === 1000) {
          dist_team_members = results.response.data.team_members;
        } else {
          // console.log(results.response.message);
        }
      }
    );

    AJAX_REQUEST("POST", "subscription/getOrderItems", {
      order_date_from: this.state.order_date_from,
      order_date_to: this.state.order_date_to,
      order_status: this.state.order_status,
      customer_name: this.state.customer_name,
      is_affiliate_sale: this.state.is_affiliate_sale,
      order_type: this.state.order_type,
      pagenum: this.state.pagenum
    }).then(results => {
      if (parseInt(results.response.code) === 1000) {
        this.setState({
          loading: false,
          orders: results.response.data.orders,
          total_records: parseInt(results.response.data.total_records),
          total_page: parseInt(results.response.data.total_page),
          per_page: parseInt(results.response.data.per_page),
          order_status_arr: order_st_data,
          dis_team_members: dist_team_members,
          error_meg: results.response.message,
        });
      } else {
        this.setState({
          loading: false,
          error_meg: results.response.message
        });
      }
    });
  }

  componentDidUpdate() {
    $(function () {
      var start = order_date_from_g;
      var end = order_date_to_g;
      function cb(start, end) {
        $("#show_date").html(
          start.format("DD/MM/YYYY") + " - " + end.format("DD/MM/YYYY")
        );
        order_date_from_g = moment(start, "DD-MM-YYYY");
        order_date_to_g = moment(end, "DD-MM-YYYY");
      }
      $("#reportrange").daterangepicker(
        {
          startDate: start,
          endDate: end,
          ranges: {
            Today: [moment(), moment()],
            Yesterday: [
              moment().subtract(1, "days"),
              moment().subtract(1, "days")
            ],
            "Last 7 Days": [moment().subtract(6, "days"), moment()],
            "Last 30 Days": [moment().subtract(29, "days"), moment()],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "Last Month": [
              moment()
                .subtract(1, "month")
                .startOf("month"),
              moment()
                .subtract(1, "month")
                .endOf("month")
            ]
          },
          locale: {
            format: "DD/MM/YYYY"
          }
        },
        cb
      );
      cb(start, end);
    });
  }

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  pagenationHandle = pageNumber => {
    this.setState({
      loading: true
    });
    document.querySelector("body").scrollIntoView();
    const order_status = document.getElementById("status_id").value;
    const customer_name = document.getElementById("customer_name").value;
    const is_affiliate_sale = document.getElementById("is_affiliate_sale").value;
    const order_type = document.getElementById("order_type").value;
    const order_date_from = this.state.order_date_from;
    const order_date_to = this.state.order_date_to;
    const pagenum = parseInt(pageNumber);
    AJAX_REQUEST("POST", "subscription/getOrderItems", {
      order_date_from: order_date_from,
      order_date_to: order_date_to,
      order_status: order_status,
      customer_name: customer_name,
      is_affiliate_sale: is_affiliate_sale,
      order_type: order_type,
      pagenum: pagenum
    }).then(results => {
      if (parseInt(results.response.code) === 1000) {
        this.setState({
          loading: false,
          order_date_from,
          order_date_to,
          order_status,
          customer_name,
          is_affiliate_sale,
          order_type,
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
          order_date_from: null,
          order_date_to: null,
          order_status: "",
          orders: []
        });
      }
    });
  };

  selectedMember = event => {
    const memberId = parseInt(event.target.value);
    this.setState({
      team_member_id: memberId
    });
  };

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

  onSubmitHandler = e => {
    e.preventDefault();
    this.setState({
      loading: true,
      filter_loading: true
    });
    const order_status = document.getElementById("status_id").value;
    const customer_name = document.getElementById("customer_name").value;
    const is_affiliate_sale = document.getElementById("is_affiliate_sale").value;
    const order_type = document.getElementById("order_type").value;
    const the_date_range = $("#show_date").text();
    const date_array = the_date_range.split(" - ");
    const order_date_from = date_array[0].replace(/\//gi, "-");
    const order_date_to = date_array[1].replace(/\//gi, "-");
    const pdata = {
      order_date_from: order_date_from,
      order_date_to: order_date_to,
      order_status: order_status,
      customer_name: customer_name,
      is_affiliate_sale: is_affiliate_sale,
      order_type: order_type,
      pagenum: 1
    };

    order_date_from_g = moment(order_date_from, "DD-MM-YYYY");
    order_date_to_g = moment(order_date_to, "DD-MM-YYYY");

    this.setState({
      pdata
    });
    AJAX_REQUEST("POST", "subscription/getOrderItems", pdata).then(results => {
      if (parseInt(results.response.code) === 1000) {
        this.setState({
          loading: false,
          filter_loading: false,
          order_date_from,
          order_date_to,
          customer_name,
          is_affiliate_sale,
          order_type,
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
          order_date_from: null,
          order_date_to: null,
          orders: []
        });
      }
    });
  };

  render() {
    return (
      <Fragment>
        {this.state.loading ?
          <div className="loading" />
          :
          <div className="woocommerce-MyAccount-content inner_content">
            <h2 className=" montserrat page-title">
              SUBSCRIPTION ORDERS
              <Link
                className="montserrat pull-right"
                to={`/my-account/subscription-order/active-subscription`}
              >
                ACTIVE SUBSCRIPTIONS
              </Link>
            </h2>
            <div className="table_search">
              <form onSubmit={this.onSubmitHandler} method="get">
                <label>Date</label>
                <div id="reportrange" className="date_by_day">
                  <span id="show_date" /> <i className="fa fa-caret-down" />
                </div>
                <select onChange={this.selectedIsReferrer} id="is_affiliate_sale" className="cus_field" name="is_affiliate_sale" defaultValue={this.state.is_affiliate_sale} style={{ width: "100px" }}>
                  <option value="">Is Referrer</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <select onChange={this.selectedOrderType} id="order_type" className="cus_field" name="order_type" defaultValue={this.state.order_type}  style={{ width: "100px" }}>
                    <option value="">All Types</option>
                    <option value="supplement">Product</option>
                    <option value="meal">Meal</option>
                </select>
                <input className="cus_field" type="text" id="customer_name" name="customer_name" onChange={this.changeHandler} placeholder="Customer Name" value={this.state.customer_name} style={{ width: "110px" }} />
                <select
                  id="status_id"
                  onChange={this.changeHandler}
                  className="cus_field toTitleCase"
                  name="order_status"
                  defaultValue={this.state.order_status}
                  style={{ width: "110px" }}>
                  <option value="">Order Status</option>
                  {order_st_data.length <= 0
                    ? null
                    : Object.keys(order_st_data).map(function (status, key) {
                      return <OrderStatusList key={key} status={status} />;
                    })}
                </select>
                <input
                  className="roboto_condensed cus_button"
                  type="submit"
                  name="action"
                  value={this.state.filter_loading ? "Searching..." : "Search"}
                />
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
                  <th className="order-number">
                    <span className="nobr">Order</span>
                  </th>
                  <th className="order-date">
                    <span className="nobr">Date</span>
                  </th>
                  <th className="order-status">
                    <span className="nobr">Status</span>
                  </th>
                  <th className="order-type">
                    <span className="nobr">Order Type</span>
                  </th>
                  <th className="order-representative">
                    <span className="nobr">Team Member</span>
                  </th>
                  <th className="order-representative">
                    <span className="nobr">Is Referrer</span>
                  </th>
                  <th className="order-total">
                    <span className="nobr">Total</span>
                  </th>
                  <th className="order-actions">
                    <span className="nobr">&nbsp;</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {this.state.orders.length <= 0 ? (
                  <tr>
                    <td className="text-center" colSpan="8">
                      {Parser(this.state.error_meg)}
                    </td>
                  </tr>
                ) : (
                    this.state.orders.map(function (order, key) {
                      return (
                        <OrderLists
                          key={key}
                          order={order}
                          dist_team_members={dist_team_members}
                        />
                      );
                    })
                  )}
              </tbody>
            </table>

            <Pagination
              pagenationHandle={this.pagenationHandle}
              total_records={this.state.total_records}
              total_page={this.state.total_page}
              per_page={this.state.per_page}
              pagenum={this.state.pagenum}
            />

            <div className="woocommerce-notices-wrapper" />
          </div>
        }
      </Fragment>
    );
  }
}

export default SubscriptionsOrders;
