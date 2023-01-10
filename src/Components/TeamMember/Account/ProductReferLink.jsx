import React, { Component, Fragment } from 'react';
import { AJAX_REQUEST, GET_STORAGE } from "../../../Constants/AppConstants";
import ProductReferLinkList from "./ProductReferLinkList";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ProductReferLink extends Component {
    constructor(props){
        super(props);
        let settings = null;
        if (GET_STORAGE("settings")) {
            settings = JSON.parse(GET_STORAGE("settings"));
        }

        this.state={
            links                   :[],
            meal                    :[],
            error_meg               :'',
            loading                 :true,
            meal_menu_public        :settings && settings.meal_menu_public == "yes"?true:false
        }
        document.title = "Product Refer Link -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getAllReferLinks();       
    }

    getAllReferLinks=()=>{
        AJAX_REQUEST("POST","team_member/getProductReferLinks",{}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    links               :results.response.data.supplement,
                    meal               :results.response.data.meal?results.response.data.meal:[],
                    error_meg             :results.response.message,
                    loading                 :false
                });	
            } 
            else{
                this.setState({
                    error_meg                   :results.response.message,
                    loading                 :false
                })
            }          
        });
    }

    render() { 

        let settings = null;
        if (GET_STORAGE("settings")) {
            settings = JSON.parse(GET_STORAGE("settings"));
        }

        let meal_menu_active = false;
        let enable_new_signup = false;
        if(settings && settings.enable_new_signup == "yes"){
            enable_new_signup = true;
        }
        if(settings && settings.meal_menu_public == "yes"){
            meal_menu_active = true;
        }else{
            if(this.props){
                if(this.props.auth){
                    if(this.props.auth.user){
                        if(this.props.auth.user.meal_menu_activated){
                            meal_menu_active = true;
                        }
                    }
                }
            }
        }

        return ( 
            <Fragment>
                {
                        this.state.loading ? 
                        <div className="loading"></div>
                        :
                    <Fragment>
            <div className="woocommerce-MyAccount-content inner_content member_tab_wrapper">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">SUPPLEMENT REFER LINK</a>
                    </li>
                    {
                        meal_menu_active?
                        <li class="nav-item">
                            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">MEALS REFER LINK</a>
                        </li>
                        :''
                    }
                </ul>

                <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <table className="my_account_orders">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Refer Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.links.length <= 0 ? <tr><td className="text-center" colSpan="2">{this.state.error_meg}</td></tr>:
                                this.state.links.map(function(link,key){
                                return(
                                <ProductReferLinkList
                                        key         ={key}
                                        link       ={link}
                                />
                                )
                                })
                            }
                        </tbody>
                    </table>
            
                </div>
                {
                    meal_menu_active?
                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                        <table className="my_account_orders">
                            <thead>
                                <tr>
                                    <th>Meal Plan</th>
                                    <th>Refer Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.meal.length <= 0 ? <tr><td className="text-center" colSpan="2">{this.state.error_meg}</td></tr>:
                                    this.state.meal.map(function(link,key){
                                    return(
                                    <ProductReferLinkList
                                            key         ={key}
                                            link       ={link}
                                    />
                                    )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    :''
                }
            </div>

            </div>
            </Fragment>
            }
        </Fragment>
        );
    }
}


ProductReferLink.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps)(ProductReferLink);