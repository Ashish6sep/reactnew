import React, { Component, Fragment } from 'react';

class W9TaxForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
        }
        document.title = "W-9 Form - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.setState({ 
            loading:false
        })
    }

    render() { 
        return (
            <Fragment>
            {
                this.state.loading ? 
                <div className="loading container full_page_loader"></div>
                :
            <Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <main className="w9taxform_wrapper">    
                                <h3 className="w9taxform page-title">W-9 Form</h3>
                                <p><b>Please give Docusign 30 seconds to load</b></p>
                                <iframe id="dswpf" src="https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=4960dd04-297a-4e32-ba27-ab41ef76bfc6" width="100%" height="1500"></iframe>
                            </main>
                        </div>
                    </div>
                </div>
            </Fragment>
            }
            </Fragment>
        );
    }
}
 
export default W9TaxForm;