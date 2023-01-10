import React, { Component,Fragment } from 'react';

class TeamMemberLists extends Component {
    constructor(props){
        super(props)
        this.state = { }
    }
    render() { 
        return ( 
            <Fragment>
                <option value={this.props.disTeamMember.hasOwnProperty('team_member_id') ? this.props.disTeamMember.team_member_id: ''}>{this.props.disTeamMember.hasOwnProperty('name') ? this.props.disTeamMember.name: ''}</option> 
            </Fragment> 
        );
    }
} 
export default TeamMemberLists;