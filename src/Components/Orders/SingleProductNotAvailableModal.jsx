import React, { Fragment, PureComponent } from 'react';

class SingleProductNotAvailableModal extends PureComponent {
    constructor(props) {
        super(props);
       
    }

    // componentDidUpdate(prevProps, prevState) {
    //     this.setState({ loading: false })
    // }

   

    render() {
        // console.log("props",this.props);
        return (
            <Fragment>
                <div className="modal fade" id="producNotAvailableModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered product_quick_view_modal" role="document">
                        <div className="modal-content">
                            <div className="modal-header cus-modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            
                                <div className="modal-body">
                                    <div className="SingleProductNotAvailableModal">
                                    <p>Bulletproof Vitality for Her is temporarily out of stock. Please hit continue to place your pre-order. Bulletproof Vitality for Her will automatically ship once back in stock.</p> <p className="font-italic">*All bundles will ship without the Bulletproof Vitality for Her and it will ship separately once back in stock.</p>
                                        <a href="#"  data-dismiss="modal" aria-label="Close" className="btn btn-info">Continue</a>
                                    </div>
                                </div>
                              
                        </div>
                    </div>
                </div>
            </Fragment>
            
        );
    }
}

export default SingleProductNotAvailableModal;