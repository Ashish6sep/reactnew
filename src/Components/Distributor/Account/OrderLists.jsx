import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TeamMemberLists from './TeamMemberLists';

class OrderLists extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error_meg_dtm: '',
            active_team_member: {
                full_name: "-------",
                id: ""
            },
            changed_team_member: '',
            team_member_id: '',
            member_edit_meg: '',
            edit_form_show: false,
            show_edit_form_button: true,
            update_loading: false
        }
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        if (this.props.order.hasOwnProperty('active_team_member')) {
            this.setState({
                active_team_member: this.props.order.active_team_member
            });
        }
    }

    openEditOption = (e) => {
        this.setState({
            edit_form_show: true,
            show_edit_form_button: false
        });
    }

    closeEditOption = (e) => {
        this.setState({
            edit_form_show: false,
            show_edit_form_button: true
        });
    }

    selectedMember = (event) => {
        const memberId = event.target.value;
        this.setState({
            changed_team_member: memberId
        });
    }

    update = (e) => {
        const id = e.currentTarget.dataset.row_id;
        this.setState({
            update_loading: true
        });
        // this.props.updateMember(id);
        const data = { order_id: this.props.order.order_id, team_member_id: this.state.changed_team_member }

        AJAX_REQUEST("POST", "order/assignTeamMember", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    active_team_member: results.response.data,
                    member_edit_meg: results.response.message,
                    changed_team_member: '',
                    edit_form_show: false,
                    show_edit_form_button: true,
                    update_loading: false
                });
            }
            else {
                alert(results.response.message);
                this.setState({
                    edit_form_show: false,
                    show_edit_form_button: true,
                    update_loading: false
                });
            }
        });
    }

    render() {
        const { user } = this.props.auth;
        return (
            <Fragment>
                <tr className="order">
                    <td className="order-number" data-title="Order">
                        <NavLink to={`/my-account/view-order/${this.props.order.hasOwnProperty('order_id') ? this.props.order.order_id : ''} `}> {'#'}{this.props.order.hasOwnProperty('order_id') ? this.props.order.order_id : ''}
                        </NavLink>
                    </td>
                    <td className="order-date" data-title="Date">
                        <time dateTime="2018-12-14T02:41:13+00:00">
                            {this.props.order.hasOwnProperty('date') ? this.props.order.date : ''}
                        </time>
                    </td>
                    <td className="order-status toTitleCase" data-title="Status">
                        {this.props.order.hasOwnProperty('status') ? this.props.order.status : ''}
                    </td>
                    <td className="order-status toTitleCase" data-title="Order Type">
                        {(this.props.order.order_type == 'supplement') ? 'Product' : 'Meal'}
                    </td>
                    {
                        user.sales_agent_feature === "enable" ?
                            <Fragment>
                                <td className="order-representative" data-title="Team Member">
                                    {
                                        this.state.show_edit_form_button ?
                                            <div className="team_member_action" id={'remove_parent' + this.props.order.order_id}>
                                                <span className="rsp_name">
                                                    {this.state.active_team_member.full_name}
                                                </span>
                                                <span title="Edit" style={{ cursor: 'pointer' }} onClick={this.openEditOption} id={this.props.order.order_id} data-row_id={this.props.order.order_id} className="order-rsp-change member_edit"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></span>
                                            </div>
                                            : null
                                    }

                                    {
                                        this.state.edit_form_show ?
                                            <div className="team_member_edit">
                                                <select onChange={this.selectedMember} data-the_order_id={this.props.order.order_id} className="cus_field" name="team_member_id">
                                                    <option value="">Select One</option>
                                                    {
                                                        this.props.dist_team_members.length <= 0 ? null :
                                                            this.props.dist_team_members.map(function (disTeamMember, key) {
                                                                return (
                                                                    <TeamMemberLists
                                                                        key={key}
                                                                        disTeamMember={disTeamMember}
                                                                    />
                                                                )
                                                            })
                                                    }
                                                </select>
                                                <div className="">
                                                    <span onClick={this.update} data-row_id={this.props.order.order_id} className="roboto_condensed wc-forward team_update_btn">{this.state.update_loading ? "UPDATEING..." : "UPDATE"}</span>
                                                    <span style={{ cursor: 'pointer' }} onClick={this.closeEditOption} id={this.props.order.order_id} data-row_id={this.props.order.order_id} className="roboto_condensed member_edit_cancel">Cancel</span>
                                                </div>
                                            </div>
                                            : null
                                    }

                                </td>
                            </Fragment>
                            :
                            <Fragment>
                                <td>-------</td>
                            </Fragment>
                    }
                    <td className="affiliate_order toTitleCase text-center" data-title="Is Referer">
                        {this.props.order.is_affiliate_sale}
                    </td>
                    <td className="order-total" data-title="Total">
                        <span>
                            {this.props.order.hasOwnProperty('total') ? CURRENCY_FORMAT(this.props.order.total) : ''} &nbsp;
                        </span>
                        {this.props.order.hasOwnProperty('items') ? this.props.order.items : ''}
                    </td>

                    <td className="order-actions" data-title="&nbsp;">
                        <NavLink className="roboto_condensed wc-forward" to={`/my-account/view-order/${this.props.order.hasOwnProperty('order_id') ? this.props.order.order_id : ''} `}>View</NavLink>
                    </td>
                </tr>
            </Fragment>
        );
    }
}


OrderLists.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps)(OrderLists);