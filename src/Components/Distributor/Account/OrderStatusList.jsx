import React, { PureComponent, Fragment } from 'react';

class OrderStatusList extends PureComponent {
    constructor(props){
        super(props)
        this.state = { }
    }
    render() { 
        return (
            <Fragment>
                <option value={this.props.status}>{this.props.status}</option> 
            </Fragment> 
        );
    }
}
 
export default OrderStatusList;