import React, { Component, Fragment } from 'react';

class DistributorAgreement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true
        }
        document.title = "Affiliate Agreement - Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        this.setState({
            loading:false
        });
    }

    render() { 
        return (
            <Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <main className="w9taxform_wrapper">    
                                <h3 className="w9taxform page-title">Affiliate Agreement</h3>
                                <p><b>Please give Docusign 30seconds to load</b></p>
                                <iframe id="dswpf" src="https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=9c964af5-cca5-4002-bd87-4352407d0edd" width="100%" height="1500"></iframe>
                            </main>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
 
export default DistributorAgreement;