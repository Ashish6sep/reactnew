import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import $ from 'jquery';
import ReportLeftMenu from './ReportLeftMenu';
import StatisticsReportsRightContent from './StatisticsReportsRightContent';
import SalesTrend from './SalesTrend';
import RefundTrend from './RefundTrend';
import PayoutTrend from './PayoutTrend';

class StatisticsReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date_range: {},
            report_data: {},
            product_list:[],
            filter_by:'today',
            start_date:null,
            end_date:null,
            x_day:1,
            reportLoading:true,
            loading:true
        }
        document.title = "Statistics Reports -Prestige Labs";
    }

    callFormData = () => {
        AJAX_REQUEST("POST","distributor/getStatisticsReports",{filter_by:'today'}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    date_range:response.data.date_range,
                    report_data:response.data.report_data,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date
                });	
            }
        });
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        this.callFormData();
        AJAX_REQUEST("POST","product/getVariationWiseList",{}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    product_list:response.data.supplement,
                    loading:false
                });	
            }           
        });
    }

    getAttrData = (adata) => {
        this.setState({
            reportLoading:true
        });
        AJAX_REQUEST("POST","distributor/getStatisticsReports",adata).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    date_range:response.data.date_range,
                    report_data:response.data.report_data,
                    x_day:adata.x_day,
                    filter_by:adata.filter_by,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date,
                    reportLoading:false
                });	
            }
        });
    }

    stopReportLoading = () => {
        this.setState({
            reportLoading:false
        });
    }

    render() {
        const report_data = this.state.report_data;
        const date_range = this.state.date_range;
        const reportLoading = this.state.reportLoading;
        return (
            <Fragment>
                {
                        this.state.loading ? 
                        <div className="loading"></div>
                        :
            <Fragment>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Statistics
                    </div>
                    <div className="panel-body">
                        <ReportLeftMenu getAttrData={this.getAttrData} leftMenu={date_range} stopReportLoading={this.stopReportLoading} />
                        <div className="tab-content vertical_cus_tab_content" id="myTabContent">
                            <StatisticsReportsRightContent report_data={report_data} reportLoading={reportLoading} />
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Sales Trend
                    </div>
                    <div className="panel-body">
                        <div className="tab-content " id="myTabContent">
                            <SalesTrend product_list={this.state.product_list}/>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Refund Trend
                    </div>
                    <div className="panel-body">
                        <div className="tab-content " id="myTabContent">
                            <RefundTrend product_list={this.state.product_list} />
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Payout Trend
                    </div>
                    <div className="panel-body">
                        <div className="tab-content" id="myTabContent">
                            <PayoutTrend />
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </Fragment>
                }
        </Fragment>
        );
    }
}
 
export default StatisticsReports;