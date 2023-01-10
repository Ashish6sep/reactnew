import React, { Component, Fragment } from 'react';

class UserCountry extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    render() { 
            if(this.props.selectedCountryId===this.props.userCountry.id){
                return ( 
                    <option selected value={this.props.userCountry.hasOwnProperty('id') ? this.props.userCountry.id: ''}>
                        {this.props.userCountry.hasOwnProperty('name') ? this.props.userCountry.name: ''}
                    </option>
                    );
            }
            else{
                return ( 
                    <option value={this.props.userCountry.hasOwnProperty('id') ? this.props.userCountry.id: ''}>
                        {this.props.userCountry.hasOwnProperty('name') ? this.props.userCountry.name: ''}
                    </option>
                    );
            }
        
    }
}
 
export default UserCountry;