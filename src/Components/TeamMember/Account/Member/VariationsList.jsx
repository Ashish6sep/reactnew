import React, { Component, Fragment } from 'react';

class VariationsList extends Component {
    constructor(props) {
        super(props);
        this.state = {  
        }
    }
    render() { 
        if(this.props.variation.flavor ===null ||this.props.variation.variation_id === null){
            return ( 
                <Fragment>
                    <tr className="inactive">
                        <td colSpan="2">
                        {this.props.variation.hasOwnProperty('month') ? this.props.variation.month: ''}
                            {' ('}
                            {this.props.variation.hasOwnProperty('price') ? this.props.variation.price: ''}
                            {' )'}
                        </td>
                        <td>
                            <input type="radio" name="" value="" id="" />Flat 
                            <input name="" type="text" id="" value="" className="" />
                            <input type="radio" name="" value="ratio" id="" />Percentage 
                            <input name="" type="text" id="" value="" className="" />%
                        </td>
                    </tr>
                </Fragment> 
            );
        }
        else{
            return ( 
                <Fragment>
                    <tr className="inactive">
                        <td>
                            {this.props.variation.hasOwnProperty('flavor') ? this.props.variation.flavor: ''}
                            {' ('}
                            {this.props.variation.hasOwnProperty('price') ? this.props.variation.price: ''}
                            {' )'}
                        </td>
                        <td>
                        {this.props.variation.hasOwnProperty('month') ? this.props.variation.month: ''}
                            {' ('}
                            {this.props.variation.hasOwnProperty('price') ? this.props.variation.price: ''}
                            {' )'}
                        </td>
                        <td>
                            <input type="radio" name="" value="" id="" />Flat 
                            <input name="" type="text" id="" value="" className="" />
                            <input type="radio" name="" value="ratio" id="" />Percentage 
                            <input name="" type="text" id="" value="" className="" />%
                        </td>
                    </tr>
                </Fragment> 
            );
        }
        
    }
}
 
export default VariationsList;