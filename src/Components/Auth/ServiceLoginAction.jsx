import React, { Component } from 'react';
import PropTypes from "prop-types";
import { API_KEY, USER, GET_STORAGE, CUSTOMER_URL } from '../../Constants/AppConstants';
import history from '../../history';

class ServiceLoginAction extends Component {
    constructor (props){
        super(props)
        this.state = {
            api_key: API_KEY,
            token:'',
            redirect:''
        }
    }

    componentDidMount(){
        const url = new URL(window.location.href);
        const token = url.searchParams.get("token");
        const redirect = url.searchParams.get("redirect");
        this.setState({
            token,
            redirect
        });
        this.makeLoad(token);
    }

    checkToken = (token) => {
        let data = {
            'user_token':token
        };
        // let data = new FormData();
        // data.append('api_key', this.state.api_key);
        // data.append('user_token', token);
        this.props.serviceLoginRequest(data).then(results => {
                if(results.response.code===1000){
                    const url = new URL(window.location.href);
                    const redirect = url.searchParams.get("redirect");
                    // if(Object.values(results.response.data.roles).includes('customer') && !Object.values(results.response.data.roles).includes('distributor')){
                    //     this.props.serviceLogout();
                    //     if(redirect){
                    //         window.location.href = CUSTOMER_URL+'serviceLogin?token='+results.response.data.token+'&redirect='+redirect;
                    //     }else{
                    //         window.location.href = CUSTOMER_URL+'serviceLogin?token='+results.response.data.token;
                    //     }
                    // }else{
                        if(redirect){
                            window.location.href = redirect;
                        }else{
                            history.push('/my-account');
                        }
                    // }
                } else {
                    history.push('/login');
                }            
            }
        );
    }

    makeLoad = (token) => {
        const local_data = JSON.parse(GET_STORAGE(USER));
        if(local_data){
            if(local_data.token === token){
                const url = new URL(window.location.href);
                const redirect = url.searchParams.get("redirect");
                if(Object.values(local_data.roles).includes('customer') && !Object.values(local_data.roles).includes('distributor')){
                    this.props.serviceLogout();
                    if(redirect){
                        window.location.href = CUSTOMER_URL+'serviceLogin?token='+local_data.token+'&redirect='+redirect;
                    }else{
                        window.location.href = CUSTOMER_URL+'serviceLogin?token='+local_data.token;
                    }
                }else{
                    if(redirect){
                        window.location.href = redirect;
                    }else{
                        history.push('/my-account');
                    }
                }
            }else{
                this.props.serviceLogout();
                this.checkToken(token);
            }
        }else{
            this.checkToken(token);
        }
    }

    render() { 
        return (<div className="loading"></div>);
    }
}

ServiceLoginAction.propTypes = {
    serviceLoginRequest:PropTypes.func.isRequired,
    serviceLogout:PropTypes.func.isRequired
}
 
export default ServiceLoginAction;