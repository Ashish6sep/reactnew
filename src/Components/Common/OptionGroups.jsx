import React, { Component } from 'react';
import Parser from 'html-react-parser';

class OptionGroups extends Component {
    render() {
        let option = '';
        if((this.props.product_list !== null) && (this.props.product_list.length > 0)){
            this.props.product_list.map(function(data,key){
                option += '<optgroup label="'+data.title+'">';
                if((data.variations !== null) && (data.variations.length > 0)){
                    data.variations.map(function(vdata,key){
                        if(vdata.flavor) {
                            option += '<option value="'+vdata.variation_id+'">'+data.title+' - '+vdata.flavor+', '+vdata.month+'</option>';    
                        } else {
                            option += '<option value="'+vdata.variation_id+'">'+data.title+', '+vdata.month+'</option>';
                        }                        
                    });
                }
                option += '</optgroup>';
            });
        }
        return (
            <select multiple id={this.props.oId} className={this.props.oClass} name={this.props.oName} >
                {Parser(option)}
            </select>
        );
    }
}
 
export default OptionGroups;