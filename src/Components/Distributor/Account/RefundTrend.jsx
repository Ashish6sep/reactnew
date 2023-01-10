import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import { Chart } from 'react-google-charts';
import select2 from 'select2';
import $ from 'jquery';
import moment from 'moment';
import daterangepicker from 'daterangepicker';
import OptionGroups from '../../Common/OptionGroups';

class RefundTrend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refund_data:[],
            filter_by:'x_day',
            start_date:null,
            end_date:null,
            x_day:1,
            isLoading:false,
            loading:true
        }
    }

    salesFormData = () => {
        AJAX_REQUEST("POST","distributor/getRefundTrendReports",{filter_by:'custom',start_date:moment().subtract(29, 'days').format('YYYY-MM-DD'),end_date:moment().format('YYYY-MM-DD')}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                const data = [[]];
                response.data.graph_data.map(function(jsonData,key){
                    data[[key]] = [jsonData.date, parseFloat(jsonData.sales)];
                });
                
                data.unshift(['Date', 'Refund']);

                this.setState({
                    refund_data:data,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date,
                    loading:false
                });	
            }           
        });
    }

    componentDidMount(){
        this.salesFormData();

        $("#refundtrendproductlist").select2({
            placeholder: "Select product"
        });

        const start = moment().subtract(29, 'days');
        const end = moment().startOf('day');

        function rcb(start, end) {
            $('#refunddatarange').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
        }

        $('#refunddatarange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            locale: {
                format: 'YYYY-MM-DD'
            }
        }, rcb);

        rcb(start, end);
    }

    submitForm = (e) => {
        e.preventDefault();
        this.setState({
            isLoading:true,
            loading:true
        });
        const refunddatarange = document.getElementById("refunddatarange").value;
        const start_date = refunddatarange.split(' - ')[0];
        const end_date = refunddatarange.split(' - ')[1];
        const refund_x_day = document.getElementById("refund_x_day").value;
        const refundtrendproductlist = $("#refundtrendproductlist").select2("val");
        let filter_by = 'custom';
        if((refund_x_day !=='') && (refund_x_day > 0)){
            filter_by = 'x_day';
        }
        AJAX_REQUEST("POST","distributor/getRefundTrendReports",{filter_by:filter_by,x_day:refund_x_day,start_date:start_date,end_date:end_date,products:refundtrendproductlist}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                const data = [[]];
                response.data.graph_data.map(function(jsonData,key){
                    data[[key]] = [jsonData.date, parseFloat(jsonData.sales)];
                });
                
                data.unshift(['Date', 'Refund']);

                this.setState({
                    refund_data:data,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date,
                    isLoading:false,
                    loading:false
                });	
            }           
        });
    }

    render() { 
        const cdata = this.state.refund_data;
        return (
            <Fragment>
            <div className="statistics_report_by_date">
                <form onSubmit={this.submitForm}>
                    <input id="refunddatarange" type="text" className="sales_report_date date_by_day"  />
                    <input type="text" name="refund_x_day" id="refund_x_day" className="datepickercustom" placeholder="X-day" />
                    <OptionGroups product_list={this.props.product_list} oId="refundtrendproductlist" oClass="form-control" oName="team_member[]" />&nbsp;
                    <button type="submit" className="roboto_condensed cus_button">{this.state.isLoading?'Loading...':'Filter'}</button>
                </form>
            </div>
            {
                this.state.loading ? 
                <div className="loading"></div>
                :
            <Chart
                width={'100%'}
                height={'500'}
                chartType="Line"
                loader={<div>Loading Chart</div>}
                data={cdata}
                options={{
                    chart: {
                    
                    },
                    width: 800,
                    height: 500,
                }}
            />
            }
            </Fragment>
        );
    }
}
 
export default RefundTrend;