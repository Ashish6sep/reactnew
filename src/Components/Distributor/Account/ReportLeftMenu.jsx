import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import daterangepicker from 'daterangepicker';

class ReportLeftMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    
    lcb = (start, end) => {
        $('.custom_date_range').val(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));
        this.props.getAttrData({
            start_date:start.format('YYYY-MM-DD'),
            end_date:end.format('YYYY-MM-DD'),
            filter_by:"custom"
        });
    }

    componentDidMount(){

        $('.custom_date_range').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
    
            }
        }, this.lcb);

        const start = moment().startOf('day');
        const end = moment().startOf('day');
        this.props.stopReportLoading();
        // this.lcb(start, end);
    }

    ChangeTab = (current_action) => {
        this.props.getAttrData({
            filter_by: current_action
        });
    }

    XdayClick = () => {
        const left_menu_x_day = document.getElementById("x_day_from_start").value;
        if((left_menu_x_day !=='') && (left_menu_x_day > 0)){
            this.props.getAttrData({
                filter_by: 'x_day',
                x_day:left_menu_x_day
            });
        }
    }

    render() { 
        const leftMenu = this.props.leftMenu;
        return (
            <div className="vertical_cus_tab_wrapper">
                        <ul className="nav nav-tabs vertical_cus_tab" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" onClick={() => this.ChangeTab('today')} id="today-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="tab_data" aria-selected="true">{leftMenu.today}</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('yesterday')} id="yesterday-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="tab_data" aria-selected="false">{leftMenu.yesterday}</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('thisweek')} id="this_week-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="this week" aria-selected="false">{leftMenu.thisweek}</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('lastweek')} id="last_week-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="last week" aria-selected="false">{leftMenu.lastweek}</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('thismonth')} id="this_month-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="This Month" aria-selected="false">This Month</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('lastmonth')} id="last_month-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="Last Month" aria-selected="false">Last Month</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('thisquarter')} id="this_quarter-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="This Quarter" aria-selected="false">This Quarter</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('lastquarter')} id="last_quarter-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="Last Quarter" aria-selected="false">Last Quarter</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('thisyear')} id="this_year-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="This Year" aria-selected="false">This Year</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('lastyear')} id="last_year-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="Last Year" aria-selected="false">Last Year</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.ChangeTab('lifetime')} id="lifetime-tab" data-toggle="tab" href="#tab_data" role="tab" aria-controls="Lifetime" aria-selected="false">Lifetime</a>
                            </li>
                        </ul>

                        <input id="leftdatarange" type="text" className="custom_date_range date_by_day" />

                        <div className="tab_search">
                            <span>Start from </span>
                            <input name="x_day_from_start" id="x_day_from_start" placeholder="X" /> 
                            <span>day(s)</span>
                            <button type="submit" className="roboto_condensed cus_button" onClick={this.XdayClick} data-toggle="tab" href="#tab_data" role="tab">GO</button>                                         
                        </div>
                    </div>


        );
    }
}
 
export default ReportLeftMenu;