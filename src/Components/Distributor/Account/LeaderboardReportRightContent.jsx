import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import { CURRENCY_FORMAT } from '../../../Constants/AppConstants';
import DataTable from 'datatables/media/js/jquery.dataTables.min.js';
import 'datatables/media/css/jquery.dataTables.min.css';

class LeaderboardReportRightContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidUpdate(prevProps){
        // if (this.props.distData !== prevProps.distData) {
            $('.data_table_style').DataTable({
                responsive: true,
                destroy: true,
                "oLanguage": {
                    "sSearch": "Quick Search: "
                },
                "aLengthMenu": [[50, 100, 150, 200, 250, 300], [50, 100, 150, 200, 250, 300]],
                "iDisplayLength": 100,
                "order": [[ 1, "desc" ]]
            });
        // }
    }

    render() {
        
        return (
            <Fragment>
                {
                        this.props.reportLoading ? 
                        <div className="loading"></div>
                        :
                <Fragment>
                    <div className="tab-pane fade show active" id="tab_data" role="tabpanel" aria-labelledby="today-tab">
                        <table className="table table-striped table-bordered nowrap data_table_style">
                            <thead>
                                <tr>
                                    <th><b>Affiliate</b></th>
                                    <th className="text-right leaderboard_totalSales" style={{ paddingRight:"10px !important" }} ><b>Total Sales</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.distData.length <= 0 ? null:
                                    this.props.distData.map(function(order,key){
                                    return(
                                        <tr key={key}>
                                            <td>{order.distributor_name}</td>
                                            <td className="text-right">{order.total_sale}</td>
                                        </tr>
                                    )
                                    })
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th><b>Affiliate</b></th>
                                    <th className="text-right"><b>Total Sales</b></th>
                                </tr>
                            </tfoot>
                        </table>
                        <div className="clearfix"></div>
                    </div>
                </Fragment>
                }
            </Fragment>
            
        );
    }
}
 
export default LeaderboardReportRightContent;