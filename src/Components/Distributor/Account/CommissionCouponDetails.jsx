import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Pagination from '../../Common/Pagination';
import Parser from 'html-react-parser';

class CommissionCouponDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batch_date: "",
            coupon_item_list: [],
            error_meg       :'',
            total_records   :0,
            total_page      :0,
            per_page        :0,
            pagenum         :1,
            loading         :true
        }
        document.title = "Commission Coupon Details -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","distributor/getMealCommissionCouponDetails",{payout_id:this.props.match.params.id,pagenum:1}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    batch_date: results.response.data.batch_date,
                    coupon_item_list: results.response.data.coupon_item_list,
                    total_records   :parseInt(results.response.data.total_records),
                    total_page      :parseInt(results.response.data.total_page),
                    per_page        :parseInt(results.response.data.per_page),
                    pagenum         :parseInt(results.response.data.pagenum),
                    error_meg       :results.response.message,
                    loading         :false
                });	
            }else{
                this.setState({
                    batch_date: "",
                    coupon_item_list: [],
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
        AJAX_REQUEST("POST", "distributor/getMealCommissionCouponDetails", {
            pagenum:pagenum,payout_id:this.props.match.params.id
        }).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    batch_date: results.response.data.batch_date,
                    coupon_item_list: results.response.data.coupon_item_list,
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
                    batch_date: results.response.data.batch_date,
                    coupon_item_list: results.response.data.coupon_item_list,
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
                    <h2 className=" montserrat page-title">MEAL COMMISSION COUPON: {this.state.batch_date}</h2>

                    <table className="my_account_orders shop_table_responsive">
                        <thead>
                            <tr>
                                <th>Coupon Code</th>
                                <th className="text-right">Coupon Amount</th>
                                <th className="text-right">Exp. Date</th>
                                <th>Redeemed</th>
                                <th className="text-right">Redeemed Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.coupon_item_list.length <= 0 ? <tr><td className="text-center" colSpan="5">{this.state.error_meg}</td></tr>:
                                this.state.coupon_item_list.map(function(order,key){
                                return(
                                    <tr key={key}>
                                        <td>{order.coupon_code}</td>
                                        <td className="text-right"><span>{CURRENCY_FORMAT(order.coupon_amount)}</span></td>
                                        <td className="text-right"><span>{order.expired_date}</span></td>
                                        <td className="toTitleCase">{order.redeemed}</td>
                                        <td className="text-right"><span>{CURRENCY_FORMAT(order.redeemed_amount)}</span></td>
                                        <td className={`order-actions toTitleCase ${order.status == 'redeemable'?'text-success':'text-danger'}`} data-title="Status">
                                            {order.status}
                                            {/* <ButtonToolbar>
                                                <OverlayTrigger
                                                    key="top"
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id={`tooltip-top`}>
                                                        Tooltip on <strong>top</strong>.
                                                        </Tooltip>
                                                    }
                                                    >
                                                    <Button variant="secondary">Tooltip on {placement}</Button>
                                                </OverlayTrigger>
                                            </ButtonToolbar> */}
                                            
                                            <span style={{display:'inline-block',verticalAlign:'middle',fontSize:'13px',marginLeft:'5px',color: '#838383', cursor:'pointer'}} className="meal-coupon-redeemale" title={Parser(order.notes)}><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                                        </td>
                                    </tr>
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
 
export default CommissionCouponDetails;