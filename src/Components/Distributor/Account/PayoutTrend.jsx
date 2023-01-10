import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import { Chart } from 'react-google-charts';
import select2 from 'select2';
import $ from 'jquery';
import moment from 'moment';
import daterangepicker from 'daterangepicker';

class PayoutTrend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payout_data:[],
            start_date:null,
            end_date:null,
            isLoading:false,
            loading:true
        }
    }

    salesFormData = () => {
        AJAX_REQUEST("POST","distributor/getPayoutTrendReports",{start_date:moment().subtract(29, 'days').format('YYYY-MM-DD'),end_date:moment().format('YYYY-MM-DD')}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                const data = [[]];
                response.data.graph_data.map(function(jsonData,key){
                    data[[key]] = [jsonData.date, parseFloat(jsonData.sales)];
                });
                
                data.unshift(['Date', 'Payout']);

                this.setState({
                    payout_data:data,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date,
                    loading:false
                });	
            }           
        });
    }

    componentDidMount(){
        this.salesFormData();

        const start = moment().subtract(29, 'days');
        const end = moment().startOf('day');

        function pcb(start, end) {
            $('#payoutdatarange').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
        }

        $('#payoutdatarange').daterangepicker({
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
        }, pcb);

        pcb(start, end);
    }

    submitForm = (e) => {
        e.preventDefault();
        this.setState({
            isLoading:true,
            loading:true
        });
        const payoutdatarange = document.getElementById("payoutdatarange").value;
        const start_date = payoutdatarange.split(' - ')[0];
        const end_date = payoutdatarange.split(' - ')[1];
        AJAX_REQUEST("POST","distributor/getPayoutTrendReports",{start_date:start_date,end_date:end_date}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                const data = [[]];
                response.data.graph_data.map(function(jsonData,key){
                    data[[key]] = [jsonData.date, parseFloat(jsonData.sales)];
                });
                
                data.unshift(['Date', 'Payout']);

                this.setState({
                    payout_data:data,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date,
                    isLoading:false,
                    loading:false
                });	
            }           
        });
    }

    render() { 
        const cdata = this.state.payout_data;
        return (
            <Fragment>
            <div className="statistics_report_by_date">
                <form onSubmit={this.submitForm}>
                    <input id="payoutdatarange" type="text" className="sales_report_date date_by_day"  />
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
 
export default PayoutTrend;