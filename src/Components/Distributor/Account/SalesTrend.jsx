import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import { Chart } from 'react-google-charts';
import select2 from 'select2';
import $ from 'jquery';
import moment from 'moment';
import daterangepicker from 'daterangepicker';
import OptionGroups from '../../Common/OptionGroups';

class SalesTrend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sales_data:[],
            filter_by:'x_day',
            start_date:null,
            end_date:null,
            x_day:1,
            isLoading:false,
            loading:true
        }
    }

    salesFormData = () => {
        AJAX_REQUEST("POST","distributor/getSalesTrendReports",{filter_by:'custom',start_date:moment().subtract(29, 'days').format('YYYY-MM-DD'),end_date:moment().format('YYYY-MM-DD')}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                const data = [[]];
                response.data.graph_data.map(function(jsonData,key){
                    data[[key]] = [jsonData.date, parseFloat(jsonData.sales)];
                });
                
                data.unshift(['Date', 'Sales']);

                this.setState({
                    sales_data:data,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date,
                    loading:false
                });	
            }           
        });
    }

    componentDidMount(){
        this.salesFormData();

        $("#salestrendproductlist").select2({
            placeholder: "Select product"
        });

        const start = moment().subtract(29, 'days');
        const end = moment().startOf('day');

        function scb(start, end) {
            $('#salesdatarange').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
        }

        $('#salesdatarange').daterangepicker({
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
        }, scb);

        scb(start, end);
    }

    submitForm = (e) => {
        e.preventDefault();
        this.setState({
            isLoading:true,
            loading:true
        });
        const salesdatarange = document.getElementById("salesdatarange").value;
        const start_date = salesdatarange.split(' - ')[0];
        const end_date = salesdatarange.split(' - ')[1];
        const sales_x_day = document.getElementById("sales_x_day").value;
        const salestrendproductlist = $("#salestrendproductlist").select2("val");
        let filter_by = 'custom';
        if((sales_x_day !=='') && (sales_x_day > 0)){
            filter_by = 'x_day';
        }
        AJAX_REQUEST("POST","distributor/getSalesTrendReports",{filter_by:filter_by,x_day:sales_x_day,start_date:start_date,end_date:end_date,products:salestrendproductlist}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                const data = [[]];
                response.data.graph_data.map(function(jsonData,key){
                    data[[key]] = [jsonData.date, parseFloat(jsonData.sales)];
                });
                
                data.unshift(['Date', 'Sales']);

                this.setState({
                    sales_data:data,
                    start_date:response.data.date_range.start_date,
                    end_date:response.data.date_range.end_date,
                    isLoading:false,
                    loading:false
                });	
            }           
        });
    }

    render() { 
        const cdata = this.state.sales_data;
        return (
                <Fragment>
                        <div className="statistics_report_by_date">
                            <form onSubmit={this.submitForm}>
                                <input id="salesdatarange" type="text" className="sales_report_date date_by_day" />
                                <input type="text" name="sales_x_day" id="sales_x_day" className="datepickercustom" placeholder="X-day" />
                                <OptionGroups product_list={this.props.product_list} oId="salestrendproductlist" oClass="form-control" oName="team_member[]" />&nbsp;
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
 
export default SalesTrend;