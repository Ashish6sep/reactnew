import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import $ from 'jquery';
import ReportLeftMenu from './ReportLeftMenu';
import LeaderboardReportRightContent from './LeaderboardReportRightContent';

class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response:{
                data: {
                    date_range: {},
                    distributor_list: []
                }
            },
            // sort_field:'',
            // sort_type:'asc',
            filter_by:'today',
            start_date:null,
            end_date:null,
            x_day:1,
            reportLoading:true,
            loading:true
        }
        document.title = "Leaderboard -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","distributor/getLeaderboard",{filter_by:'today'}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    response,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date,
                    loading:false
                });	
            }           
        });
    }

    // MakeSorted = (sort_field,sort_type) => {
    //     this.setState({
    //         sort_field:sort_field,
    //         sort_type:sort_type
    //     });
    // }

    stopReportLoading = () => {
        this.setState({
            reportLoading:false
        });
    }

    getAttrData = (adata) => {
        this.setState({
            reportLoading:true
        });
        AJAX_REQUEST("POST","distributor/getLeaderboard",adata).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    response,
                    x_day:adata.x_day,
                    filter_by:adata.filter_by,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date,
                    reportLoading:false
                    // sort_field:'',
                    // sort_type:'asc'
                });	
            }
        });
    }

    render() {
        const distData = this.state.response.data.distributor_list;
        const date_range = this.state.response.data.date_range;
        const reportLoading = this.state.reportLoading;
        // const { sort_field, sort_type } = this.state;
        return (
            <Fragment>
                {
                        this.state.loading ? 
                        <div className="loading"></div>
                        :
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            Leaderboard
                        </div>
                        <div className="panel-body">
                            <ReportLeftMenu getAttrData={this.getAttrData} leftMenu={date_range} stopReportLoading={this.stopReportLoading} />
                            <div className="tab-content vertical_cus_tab_content" id="myTabContent">
                                <LeaderboardReportRightContent distData={distData} reportLoading={reportLoading} />
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                }
            </Fragment>
        );
    }
}
 
export default Leaderboard;