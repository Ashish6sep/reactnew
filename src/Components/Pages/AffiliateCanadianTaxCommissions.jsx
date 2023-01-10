import React,{PureComponent,Fragment} from 'react';
import $ from 'jquery';
import Parser from 'html-react-parser';
import classnames from 'classnames';

class AffiliateCanadianTaxCommissions extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
        document.title = "Canadian Tax Commissions- Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.setState({loading: false})
    }

    render() {
        const { server_message, success_alert_wrapper_show, errors, isLoading, captchaCode } = this.state;
        const errors_data = server_message;
        return (
                <Fragment>
                    {
                        (this.state.loading)?
                        <div className="loading container full_page_loader"></div>
                        :
                        <Fragment>
                            <div className="site-main">   
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <main className="site-content terms_and_condition">
                                                <div className="page-content entry-content mb-5 text-justify">
                                                    <div className="montserrat page-title">Notice to Levy Canadian Tax on Commissions paid to Registered Canadian Affiliate</div>
                                                    <p>
                                                        I attest that I am an authorized representative and I am providing this Notice to GLS Labs LLC, a Texas limited liability company d/b/a/ Prestige Labs (the “Company”) pursuant to the Affiliate Agreement between the Company and Affiliate to advise them that the Affiliate is registered under Part IX of the Excise Tax Act and therefore is a Registered Canadian Affiliate (“Affiliate”), as that term is defined in the Affiliate Agreement.   
                                                    </p>

                                                    <p>
                                                        I acknowledge that it is the responsibility of the Registered Canadian Affiliate to determine if they should be collecting the Goods & Services Tax, Harmonized Sales Tax and/or Provincial Sales Tax (“Canadian Tax”) on commissions paid by the Company (the “Commissions”), to advise the Company if they are required to pay the Canadian Tax on the Commissions and to provide the Company with the information required to facilitate the payment of the Canadian Tax.  
                                                    </p>

                                                    <p>
                                                        The purpose of this Notice is to facilitate the collection of the Canadian Tax on the Commissions by the Registered Canadian Affiliate.  It does not, in any way, transfer the obligations regarding the collection of the Canadian Tax on the Commissions from the Registered Canadian Affiliate to the Company and the Company will be held harmless for any and all losses, damages and/or liabilities related thereto. For greater certainty, the Indemnification Clause of the Affiliate Agreement applies in this context. 
                                                    </p>

                                                    <p>
                                                        Although Commissions may be paid more than monthly, I acknowledge that the Canadian Tax on Commissions will be calculated and paid out once a month and that I have access to the calculation and payment of Canadian Sales Tax at <a href="mailto:billing@prestigelabs.com"><strong><u>billing@prestigelabs.com</u></strong></a>. 
                                                    </p>
                                                </div>
                                                <div className="page-content entry-content mb-5">&nbsp;</div>
                                            </main>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    }
                </Fragment>
        );
    }
}

export default AffiliateCanadianTaxCommissions;