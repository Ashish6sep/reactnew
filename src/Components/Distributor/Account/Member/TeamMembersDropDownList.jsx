import React, { Component, Fragment } from 'react';

class TeamMembersDropDownList extends Component {
    constructor(props) {
        super(props);
        this.state = { 

        }
        
    }
    render() { 
        if(this.props.member.hasOwnProperty('team_member_id')){
            
            return (
                <Fragment>
                    <option value={this.props.member.hasOwnProperty('team_member_id') ? this.props.member.team_member_id: ''}>
                        {this.props.member.hasOwnProperty('name') ? this.props.member.name: ''}
                    </option>
                </Fragment>
            );
        }
        
        
    }
}
 
export default TeamMembersDropDownList;