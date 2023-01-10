import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { AJAX_REQUEST, CURRENCY_FORMAT } from '../../../../Constants/AppConstants';

class TeamMembersList extends Component {
    state = {}

    render() {
        return (<Fragment>
            <tr className="order">
                <td className="order-number" data-title="Name">
                    <NavLink className="" to={`/my-account/manage-representative/${this.props.member.hasOwnProperty('team_member_id') ? this.props.member.team_member_id : ''} `}>{this.props.member.hasOwnProperty('name') ? this.props.member.name : ''} </NavLink>
                </td>
                <td className="order-date" data-title="Email">
                    {this.props.member.hasOwnProperty('email') ? this.props.member.email : ''}
                </td>
                <td className="order-status text-right" data-title="Total Sales">
                    {this.props.member.hasOwnProperty('total_sales') ? CURRENCY_FORMAT(this.props.member.total_sales) : ''}
                </td>
                <td className="order-representative" data-title="Refer Link">
                    <div style={{ wordWrap: "break-word" }}>
                        <a href={this.props.member.hasOwnProperty('refer_link') ? this.props.member.refer_link : ''}>{this.props.member.hasOwnProperty('refer_link') ? this.props.member.refer_link : ''}</a>
                    </div>
                </td>
                <td className="order-total" data-title="Status">
                    {this.props.member.hasOwnProperty('status') ? this.props.member.status : ''}
                </td>
                <td className="order-actions mob_order_action_inline" data-title="Action">
                    <NavLink title="Edit" className="order_actions_edit" to={`/my-account/manage-representative/action/edit/${this.props.member.hasOwnProperty('team_member_id') ? this.props.member.team_member_id : ''} `}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></NavLink>
                    <span>|</span>
                    <NavLink className="" to={`/my-account/manage-representative/action/customer_handover/${this.props.member.hasOwnProperty('team_member_id') ? this.props.member.team_member_id : ''} `}>Reassign</NavLink>
                    {
                        (this.props.member.deletable_status == 1) ?
                            <Fragment>
                                <span>|</span>
                                <NavLink title="Delete" onClick={(e) => this.props.deleteTeamMember(e, this.props.member.team_member_id)} to="#" className="order_actions_edit"><i className="fa fa-trash text-danger" aria-hidden="true"></i></NavLink>
                            </Fragment>
                            : ''
                    }

                </td>
            </tr>
        </Fragment>);
    }
}

export default TeamMembersList;