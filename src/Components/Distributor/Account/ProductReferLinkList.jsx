import React, { Component, Fragment } from 'react';

class ProductReferLinkList extends Component {
    state = {  }
    render() { 
        return ( <Fragment>
                    <tr>
                        <td>
                            {this.props.link.hasOwnProperty('title') ? this.props.link.title: ''}
                        </td>
                        <td>
                            <a className="word_break" href={this.props.link.hasOwnProperty('refer_link') ? this.props.link.refer_link: ''} target="_blank">{this.props.link.hasOwnProperty('refer_link') ? this.props.link.refer_link: ''}</a>
                            
                        </td>                      
                    </tr>
                </Fragment> );
    }
}
 
export default ProductReferLinkList;