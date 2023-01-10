import React, { Component, Fragment } from 'react';
import VariationsList from './VariationsList'

class AllProductsVariationList extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            global:'global',
            product_wise_commission :{
                id:{
                    product_id:'',
                    global:'global',
                    save_subs_type:'save_subs_type',
                    save_subs_commission:'save_subs_commission',
                    variations:{
                        id:{
                            variation_id:'',
                            type:'',
                            commission:''
                        },
                    }
                }
            }
        }
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    changeHandlerGlobal=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
        const val = e.target.value;
        const name_one = e.currentTarget.dataset.name;

        const name =[name_one]['global'];
    }

    render() { 
        return ( <div className="panel panel-default">
                    <div className="panel-heading">{this.props.product.hasOwnProperty('title') ? this.props.product.title: ''}</div>
                    <div className="panel-body">
                        <div className="section_blog">
                            <label>Product Global : </label>
                            <input 
                                    onChange={this.changeHandlerGlobal} 
                                    name={`product_wise_commission[${this.props.product.product_id}]["global"]`} type="text" 
                                    value={this.state.product_wise_commission[this.props.product.product_id['global']]} className="" 
                                    data-name={`product_wise_commission[${this.props.product.product_id}]["global"]`}
                            />
                            %
                        </div>
                        <div className="section_blog">
                            <label>Global Commission : </label>
                            <span>
                                <input onChange={this.changeHandler} type="radio" name="" value="" id="" /> Flat
                                <input onChange={this.changeHandler} name="" type="text" id="" value="" className="regular-text" />
                            </span>

                            <span>
                                <input onChange={this.changeHandler} type="radio" name="" value="ratio" id="" /> Percentage
                                <input onChange={this.changeHandler} name="" type="text" id="" value="" className="regular-text" />%
                            </span>
                        </div>
                        <div className="section_blog">
                            <label>Team Member Global Subscription Commission : </label>
                            <span className="form_check_inline">
                                <input onChange={this.changeHandler} type="radio" name="" value="" /> Recurring      
                            </span>
                            <span className="form_check_inline">
                                <input onChange={this.changeHandler} type="radio" name="" value="" /> One-Time           
                            </span>
                        </div>
                        <table className="roboto table table-bordered product_variable_table">
                            <colgroup>
                                <col width="30%" />
                                <col width="30%" />
                                <col width="40%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th className="" colSpan="2">Variation(s)</th>
                                    <th className="text-center">Commission</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.product.variations.length <= 0 ? this.state.error_meg:
                                    this.props.product.variations.map(function(variation,key){
                                        return(
                                            <VariationsList
                                                    key             = {key}
                                                    variation       ={variation}
                                            />
                                        )
                                    })
                                }
                            </tbody>
                        </table>    
                    </div>
                </div>);
    }
}
 
export default AllProductsVariationList;