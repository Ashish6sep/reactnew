import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import TeamMembersList from './TeamMembersList';
import { AJAX_REQUEST } from "../../../../Constants/AppConstants";
import Pagination from '../../../Common/Pagination';
import AlertWrapperSuccess from '../../../Common/AlertWrapperSuccess';

class ManageRepresentative extends Component {
    constructor(props) {
        super(props)
        this.state = {
            team_members: [],
            message: '',
            error_meg: '',
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1,
            loading: true,
            success_alert_wrapper_show: false,
        }
        document.title = "Team Member -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "distributor/getTeamMemberList", { pagenum: 1 }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    team_members: results.response.data.team_members,
                    message: results.response.message,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    pagenum: parseInt(results.response.data.pagenum),
                    error_meg: results.response.message,
                    loading: false,
                });
            } else {
                this.setState({
                    error_meg: results.response.message,
                    loading: false,
                });
            }
        });
    }

    pagenationHandle = (pageNumber) => {
        this.setState({
            loading: true
        });
        const pagenum = parseInt(pageNumber);
        AJAX_REQUEST("POST", "distributor/getTeamMemberList", {
            pagenum: pagenum
        }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    team_members: results.response.data.team_members,
                    total_records: parseInt(results.response.data.total_records),
                    total_page: parseInt(results.response.data.total_page),
                    per_page: parseInt(results.response.data.per_page),
                    pagenum: parseInt(results.response.data.pagenum),
                    error_meg: results.response.message,
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                    error_meg: results.response.message,
                    total_records: 0,
                    total_page: 0,
                    per_page: 0,
                    pagenum: 1,
                    team_members: []
                });
            }
        });
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.pagenationHandle(this.state.pagenum);
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this), timedata);
    }

    deleteTeamMember = (e, memberId = null) => {
        e.preventDefault();
        this.setState({
            success_alert_wrapper_show: false
        })
        let data = {
            team_member_id: memberId,
        }

        if (window.confirm('Are you sure you want delete this team member?')) {
            document.querySelector("body").scrollIntoView();
            AJAX_REQUEST("POST", "distributor/deleteTeamMember", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    this.setState({
                        success_alert_wrapper_show: true,
                        error_meg: results.response.message,
                    })
                    this.timeOut(2000);
                } else {
                    this.setState({
                        success_alert_wrapper_show: false,
                    })
                }
            });
        }

    }

    render() {
        const { error_meg, success_alert_wrapper_show } = this.state;

        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <Fragment>
                            <div className="woocommerce-MyAccount-content inner_content">
                                <AlertWrapperSuccess errors_data={error_meg} success_alert_wrapper_show={success_alert_wrapper_show} />
                                <h2 className=" montserrat page-title">MANAGE TEAM MEMBER
                                <NavLink className="montserrat pull-right" to="/my-account/manage-representative/action/add">Add New</NavLink>
                                </h2>

                                <table className="my_account_orders shop_table_responsive">
                                    <colgroup>
                                        <col width="15%" />
                                        <col width="15%" />
                                        <col width="15%" />
                                        <col width="25%" />
                                        <col width="5%" />
                                        <col width="18%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="order-number"><span className="nobr">Name</span></th>
                                            <th className="order-date"><span className="nobr">Email</span></th>
                                            <th className="order-status text-right"><span className="nobr">Total Sales</span></th>
                                            <th className="order-representative"><span className="nobr">Refer Link</span></th>
                                            <th className="order-total"><span className="nobr">Status</span></th>
                                            <th className="order-actions text-center"><span className="nobr">Action</span></th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.team_members.length <= 0 ? <tr><td className="text-center" colSpan="6">{this.state.error_meg}</td></tr> :
                                                this.state.team_members.map(function (member, key) {
                                                    return (
                                                        <TeamMembersList
                                                            key={key}
                                                            member={member}
                                                            deleteTeamMember={this.deleteTeamMember}
                                                        />
                                                    )
                                                }.bind(this))
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
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default ManageRepresentative;