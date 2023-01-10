import React, { Component, Fragment } from 'react';

class UserState extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    render() { 
                if(this.props.selectedStateId ===this.props.userState.code){
                   return ( <Fragment>
                    <option selected value={this.props.userState.hasOwnProperty('code') ? this.props.userState.code: ''}>{this.props.userState.hasOwnProperty('name') ? this.props.userState.name: ''}</option>
                </Fragment> ); 
                }
                else{
                    return ( <Fragment>
                        <option value={this.props.userState.hasOwnProperty('code') ? this.props.userState.code: ''}>{this.props.userState.hasOwnProperty('name') ? this.props.userState.name: ''}</option>
                    </Fragment> );
                }
        
    }
}
 
export default UserState;