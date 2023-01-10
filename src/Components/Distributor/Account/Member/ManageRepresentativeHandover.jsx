import React, { Component,Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import $ from 'jquery';
import select2 from 'select2';
import 'select2/dist/css/select2.min.css';
import { AJAX_REQUEST } from "../../../../Constants/AppConstants";
import TeamMembersDropDownList from './TeamMembersDropDownList';
import AlertWrapper from '../../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../../Common/AlertWrapperSuccess';
import serialize from 'form-serialize';
import history from '../../../../history';

class ManageRepresentativeHandover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team_members        :[],
            message             :'',
            error_meg           :'',
            team_member_id      :'',
            current_member_id   :this.props.match.params.id,
            team_member_id      :'',
            current_team_member:[],
            current_team_member_name:'',
            errors_data:'',
            loading         :true,
            updating: false,
            isFormValid:true,
            success_alert_wrapper_show:false,
        }
        document.title = "Re-Assign Team Member -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST","distributor/getTeamMemberListOption",{cur_team_member_id:this.props.match.params.id}).then(results => {
            if(parseInt(results.response.code)===1000) {
                let current_team_member_name = '';
                if(results.response.data.current_team_member.length > 0){
                    current_team_member_name = results.response.data.current_team_member[0].name;
                }
                this.setState({
                    team_members                    :results.response.data.team_members,
                    current_team_member             :results.response.data.current_team_member,
                    current_team_member_name        :current_team_member_name,
                    error_meg                       :results.response.message,
                    loading         :false,
                });	
            } 
            else{
                this.setState({
                    error_meg                       :results.response.message,
                    loading         :false,
                })
            }          
        });
        
    }

    componentDidUpdate(){
        $("#e1").select2();
    }

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this),timedata);
    }

    submitForm = (e) => {
        e.preventDefault();
        this.setState({updating: true,error_meg:'',message:'',isLoading:true});
        let steam_name = '';
        const form = document.querySelector('#update_reassign_team_form');
        const data = serialize(form, { hash: true });
        const team_members = this.state.team_members;
        const selected_team_m = team_members.filter(el => el.team_member_id === data.reassign_to);
        if(selected_team_m.length > 0){
            steam_name = selected_team_m[0].name;
        }

        AJAX_REQUEST("POST","distributor/reassignTeamMember",data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    isFormValid                 :true,
                    // current_team_member_name    :steam_name,
                    updating                      :false,
                    success_alert_wrapper_show  :true,
                    message                     :results.response.message,
                    isLoading:false,
                });
                this.timeOut(5000);
            }
            else{
                this.setState({
                    updating                      :false,
                    isFormValid                 :false,
                    errors_data                 :results.response.message,
                    success_alert_wrapper_show  :false,
                    isLoading:false,
                });
            }          
        });
        
    }

    render() { 
        const { current_team_member_name, team_members, current_member_id, errors_data, success_alert_wrapper_show, updating, message } = this.state;
        return ( 
            <Fragment>
            {
                    this.state.loading ? 
                    <div className="loading"></div>
                    :
                <Fragment>
                <div className="woocommerce-MyAccount-content inner_content">

                    <h2 className=" montserrat page-title">CUSTOMER REASSIGN TO ANOTHER TEAM MEMBER <NavLink className="montserrat pull-right" to="/my-account/manage-representative">Manage</NavLink></h2>
                    <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                    <AlertWrapperSuccess errors_data={message} success_alert_wrapper_show={success_alert_wrapper_show}/>

                    <form id="update_reassign_team_form" onSubmit={this.submitForm} method="post">

                        <div className="form-row reassign_container">
                            <div className="form-group col-md-6">
                                <label>Current Team Member</label>
                                <div className="current_tam_member_name">
                                    <b>{ current_team_member_name }</b>
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="account_email">Reassign To <span className="required">*</span></label>
                                <select id="e1" className="form-control" name="reassign_to" >
                                    <option value="0">Affiliate Itself</option>
                                    {
                                        team_members.length <= 0 ? this.state.error_meg:
                                        team_members.map(function(member,key){
                                            return(
                                                <TeamMembersDropDownList
                                                    key                 ={key}
                                                    member              ={member}
                                                />
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <input name="current_member_id" value={current_member_id} type="hidden" />
                        </div>
                        <div>                
                            <button type="submit" disabled={this.state.isLoading} className="roboto_condensed cus_button" name="update_customer_handover">
                            {updating?"Updating...":"Update"}
                            </button>
                        </div>
                    </form>                             
                </div>
                </Fragment>
            }
            </Fragment>
        );
    }
}
 
export default ManageRepresentativeHandover;