import React, { PureComponent, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from "jquery";
import history from '../../history';
import Parser from 'html-react-parser';
import { AJAX_PUBLIC_REQUEST, AJAX_REQUEST, ENABLE_AFFILIATE_REQUEST, CUSTOMER_URL, GET_STORAGE } from '../../Constants/AppConstants';
import { logout } from '../../Store/actions/loginActions';

class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showusermenu: false,
            page: '',
            training_url: 'https://prestigelabs.mykajabi.com/offers/Na7LT2mg',
            menus: []
        }

        setInterval(function () {
            if (this.props.auth) {
                if (this.props.auth.user) {
                    if (this.props.auth.user.remember) {
                        AJAX_REQUEST("POST", "user/updateAccessToken", {}).then(results => {
                            if (parseInt(results.response.code) === 1000) {
                                // console.log(results.response.code);
                            }
                        });
                    }
                }
            }
        }.bind(this), 540000);
    }

    onCliclActiveMob = (e) => {
        const elements = document.querySelectorAll('.mob_site_content ul li');
        [].forEach.call(elements, function (el) {
            el.classList.remove("active");
        });
        e.currentTarget.classList.add('active');
    }

    onCliclActive = (e) => {
        const elements = document.querySelectorAll('.menu-main-menu-container ul li');
        [].forEach.call(elements, function (el) {
            el.classList.remove("active");
        });
        e.currentTarget.classList.add('active');
    }

    showMenu = () => {
        this.setState({
            showusermenu: this.state.showusermenu ? false : true
        });
    }

    showMobSideMenu = () => {
        $("body").toggleClass("current", 1000);
    }

    componentDidMount() {
        AJAX_PUBLIC_REQUEST("POST", "menu/getMenuInfo", { type: 'primary' }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let training_url = results.response.additional_data && results.response.additional_data.training_url ? results.response.additional_data.training_url : this.state.training_url;
                this.setState({
                    menus: results.response.data,
                    training_url: training_url
                });
            }
        });
        AJAX_PUBLIC_REQUEST("POST", "page/getContactInfo", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    page: results.response.data,
                });
            } else {
                // console.log(results.response.message);
            }
        });
    }

    logout = (e) => {
        e.preventDefault();
        AJAX_REQUEST("POST", "user/logout", {}).then(results => {
            if (parseInt(results.response.code) === 1000) { } else {
                // console.log(results.response.message);
            }
        });
        this.props.logout();
    }

    render() {
        const { user } = this.props.auth;
        const email = this.state.page.hasOwnProperty('email') ? Parser(this.state.page.email) : '';
        const phone = this.state.page.hasOwnProperty('phone') ? Parser(this.state.page.phone) : '';

        let settings = null;
        if (GET_STORAGE("settings")) {
            settings = JSON.parse(GET_STORAGE("settings"));
        }

        let meal_menu_active = false;
        let enable_new_signup = true;
        // if(settings && settings.enable_new_signup == "yes"){
        //     enable_new_signup = true;
        // }
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
            <React.Fragment>
                <header className="montserrat site-header">
                    <div className="mob_menu_wrapper d-sm-block d-md-none">
                        <div className="site_menu_wrapper_inner">
                            <div className="mob_site_menu" onClick={this.showMobSideMenu}>
                                <ul className="mob_site_content">
                                    {
                                        (this.state.menus.length <= 0) ? null :
                                            this.state.menus.map(function (menu, key) {
                                                if ((user.roles != undefined) && Object.values(user.roles).includes('master_affiliate') && !Object.values(user.roles).includes('distributor')) {
                                                    if ((menu.url === '') || (menu.url === '/') || (menu.url === '/meals')) {
                                                        
                                                    } else {
                                                        if (menu.type === "external") {
                                                            if(menu.manual_position != 'last'){
                                                                return (<li key={'ddm' + key}><a target={menu.open_new_tab== "yes"?"_blank":"_self"} className={`menu_item${history.location.pathname === menu.url ? ' active' : ''}`} href={menu.url}><span>{menu.label}</span></a></li>)
                                                            }
                                                        } else {
                                                            if (menu.url === "/my-account") {
                                                                return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to="/my-affiliate-account" exact><span>{enable_new_signup?'Master Affiliate Dashboard':'Master Affiliate Panel'}</span></NavLink></li>)
                                                            } else {
                                                                return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>{menu.label}</span></NavLink></li>)
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (menu.type === "external") {
                                                        if(menu.manual_position != 'last'){
                                                            return (<li key={'ddm' + key}><a target={menu.open_new_tab== "yes"?"_blank":"_self"} className={`menu_item${history.location.pathname === menu.url ? ' active' : ''}`} href={menu.url}><span>{menu.label}</span></a></li>)
                                                        }
                                                    } else {
                                                        if (menu.url === "/my-account") {
                                                            if ((user.roles != undefined) && Object.values(user.roles).includes('distributor')) {
                                                                return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>{enable_new_signup?'Affiliate Dashboard':'Affiliate Panel'}</span></NavLink></li>)
                                                            } else {
                                                                return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>Team Member Panel</span></NavLink></li>)
                                                            }
                                                        } else {
                                                            if(menu.url === '/meals'){
                                                                if(meal_menu_active){
                                                                    return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>{menu.label}</span></NavLink></li>)
                                                                }else{
                                                                    return null;
                                                                }
                                                            }else{
                                                                return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>{menu.label}</span></NavLink></li>)
                                                            }
                                                        }
                                                    }
                                                }
                                            })
                                    }

                                    {
                                        (this.props.auth.isAuthenticated && (user.roles != undefined) && Object.values(user.roles).includes('distributor') && Object.values(user.roles).includes('master_affiliate')) ?
                                        <li key={Math.random()}><NavLink activeClassName="active" className="menu_item" to="/my-affiliate-account"><span>{enable_new_signup?'Master Affiliate Dashboard':'Master Affiliate Panel'}</span></NavLink></li>
                                            : ''
                                    }

                                    {
                                        (this.props.auth.isAuthenticated && (user.roles != undefined) && Object.values(user.roles).includes('customer')) ?
                                            <li key={Math.random()}><a className="menu_item" href={CUSTOMER_URL + 'serviceLogin?token=' + user.token}><span>{enable_new_signup?'My Orders':'My Account'}</span></a></li>
                                            : ''
                                    }

                                    {
                                        (this.props.auth.isAuthenticated && (Object.values(user.roles).includes('master_affiliate') || Object.values(user.roles).includes('distributor'))) ?
                                            <li key={Math.random()}><a className="menu_item" href={this.state.training_url} target='_blank'><span>Training</span></a></li>
                                            : ''
                                    }

                                    {
                                        (this.props.auth.isAuthenticated && Object.values(user.roles).includes('team_member')) ?
                                            <li key={Math.random()}><a className="menu_item" href={this.state.training_url} target='_blank'><span>Training</span></a></li>
                                            : ''
                                    }

                                    {
                                        (this.state.menus.length <= 0) ? null :
                                        this.state.menus.map(function (menu, key) {
                                            if (menu.type === "external") {
                                                if(menu.manual_position == 'last'){
                                                    return (<li key={'ddm' + key}><a target={menu.open_new_tab== "yes"?"_blank":"_self"} className={`menu_item${history.location.pathname === menu.url ? ' active' : ''}`} href={menu.url}><span>{menu.label}</span></a></li>)
                                                }
                                            }
                                        })
                                    }

                                    {
                                        this.props.auth.isAuthenticated && this.props.auth.user.activate_meal ?
                                            <li key={Math.random()} className="pull-right"><NavLink activeClassName="active" className="menu_item" to="/activate-meal"><span>Activate Meal</span></NavLink></li>
                                            : ''
                                    }

                                    {
                                        ENABLE_AFFILIATE_REQUEST ?
                                            <Fragment>
                                                {
                                                    (this.props.auth.isAuthenticated && Object.values(user.roles).includes('distributor') && !Object.values(user.roles).includes('master_affiliate')) ?
                                                        <li key={Math.random()} className="pull-right"><NavLink activeClassName="active" className="menu_item" to="/affiliate-request"><span>Refer Friends to Join Prestige Labs</span></NavLink></li>
                                                        : ''
                                                }
                                            </Fragment>
                                            : ''
                                    }
                                </ul>
                            </div>
                            <div className="mob_main_user" onClick={this.showMenu}>
                                {
                                    this.state.showusermenu ?
                                        <div className="mob_main_user_wrapper">
                                            <ul>
                                                {
                                                    (user.roles != undefined) && Object.values(user.roles).includes('master_affiliate') && !Object.values(user.roles).includes('distributor') ?
                                                        <li><NavLink to="/my-affiliate-account">{enable_new_signup?'Affiliate Dashboard':'Affiliate Panel'}</NavLink></li>
                                                        :
                                                        <li><NavLink to="/my-account">{enable_new_signup?'Affiliate Dashboard':'Affiliate Panel'}</NavLink></li>
                                                }

                                            </ul>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            <NavLink to="/cart"><div className="mob_main_cart"></div></NavLink>
                        </div>

                        <div className="clearfix"></div>
                        <p className="mob_text_order topemailphonecolor">Reach us at <a href={`mailto:${email}`}>{email}</a> or <a href={`tel:${phone}`}>{phone}</a></p>
                        <div className="mob_header_logo">
                            {
                                (user.roles != undefined) && Object.values(user.roles).includes('master_affiliate') && !Object.values(user.roles).includes('distributor') ?
                                    <NavLink to="/my-affiliate-account" exact strict>
                                        <img src={require("../../Assets/images/prestigelabs-logo.png")} alt="Prestige Labs" />
                                    </NavLink>
                                    :
                                    <NavLink to="/" exact strict>
                                        <img src={require("../../Assets/images/prestigelabs-logo.png")} alt="Prestige Labs" />
                                    </NavLink>
                            }
                        </div>
                        <div className="clearfix"></div>
                    </div>

                    <div className="hide_small_screen">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="logo-wrapper">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="site-logo">
                                                    {
                                                        (user.roles != undefined) && Object.values(user.roles).includes('master_affiliate') && !Object.values(user.roles).includes('distributor') ?
                                                            <NavLink title="Prestige Labs" activeClassName='active' to="/my-affiliate-account" exact>
                                                                <img src={require("../../Assets/images/cropped-logo-1.png")} className="attachment-full size-full" alt="" title="" />
                                                            </NavLink>
                                                            :
                                                            <NavLink title="Prestige Labs" activeClassName='active' to="/" exact>
                                                                <img src={require("../../Assets/images/cropped-logo-1.png")} className="attachment-full size-full" alt="" title="" />
                                                            </NavLink>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="top-header distributorTopHeader">
                                                    <div className="header-top  header_contact">
                                                        <div className="pull-right top-widgets-right">
                                                            {
                                                                (this.props.auth.isAuthenticated) ?
                                                                    <div className="montserrat welcome-login">
                                                                        <span>Welcome</span><strong>
                                                                            <NavLink to="/my-account/edit-account" style={{ paddingLeft: '0px' }}>{this.props.auth.user.first_name}</NavLink>
                                                                        </strong>
                                                                        <a onClick={this.logout} title="Prestige Labs" href="javascript.void(0)" >Logout</a>
                                                                    </div>
                                                                    : ""
                                                            }

                                                            <div className="top-widgets-date-time topemailphonecolor">
                                                                Reach us at <a href={`mailto:${email}`}>{email}</a> or <a href={`tel:${phone}`}>{phone}</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <section id="nav-for-scroll">
                            <div className="site_menu">
                                <div className="header-logo-fix">
                                    {
                                        (user.roles != undefined) && Object.values(user.roles).includes('master_affiliate') && !Object.values(user.roles).includes('distributor') ?
                                            <NavLink to="/my-affiliate-account" exact strict>
                                                <img src={require("../../Assets/images/logo_fix.png")} alt="Prestige  Labs" title="" />
                                            </NavLink>
                                            :
                                            <NavLink to="/" exact strict>
                                                <img src={require("../../Assets/images/logo_fix.png")} alt="Prestige  Labs" title="" />
                                            </NavLink>
                                    }
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <nav className="primary-nav">
                                                {
                                                    this.props.auth.isAuthenticated ?
                                                        <Fragment>
                                                            {
                                                                ((user.new_agreement_required == "yes") && Object.values(user.roles).includes('distributor')) ? '' :
                                                                    // user.new_agreement_required=="no"?
                                                                    <div className="menu-main-menu-container">
                                                                        <ul id="menu-main-menu" className="menu">
                                                                            {
                                                                                (this.state.menus.length <= 0) ? null :
                                                                                    this.state.menus.map(function (menu, key) {

                                                                                        if ((user.roles != undefined) && Object.values(user.roles).includes('master_affiliate') && !Object.values(user.roles).includes('distributor')) {
                                                                                            if ((menu.url === '') || (menu.url === '/') || (menu.url === '/meals')) {

                                                                                            } else {
                                                                                                if (menu.type === "external") {
                                                                                                    if(menu.manual_position != 'last'){
                                                                                                        return (<li key={'ddm' + key}><a target={menu.open_new_tab== "yes"?"_blank":"_self"} className={`menu_item${history.location.pathname === menu.url ? ' active' : ''}`} href={menu.url}><span>{menu.label}</span></a></li>)
                                                                                                    }
                                                                                                } else {
                                                                                                    if (menu.url === "/my-account") {
                                                                                                        return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to="/my-affiliate-account" exact><span>{enable_new_signup?'Master Affiliate Dashboard':'Master Affiliate Panel'}</span></NavLink></li>)
                                                                                                    } else {
                                                                                                        return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>{menu.label}</span></NavLink></li>)
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        } else {
                                                                                            if (menu.type === "external") {
                                                                                                if(menu.manual_position != 'last'){
                                                                                                    return (<li key={'ddm' + key}><a target={menu.open_new_tab== "yes"?"_blank":"_self"} className={`menu_item${history.location.pathname === menu.url ? ' active' : ''}`} href={menu.url}><span>{menu.label}</span></a></li>)
                                                                                                }
                                                                                            } else {
                                                                                                if (menu.url === "/my-account") {
                                                                                                    if ((user.roles != undefined) && Object.values(user.roles).includes('distributor')) {
                                                                                                        return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>{enable_new_signup?'Affiliate Dashboard':'Affiliate Panel'}</span></NavLink></li>)
                                                                                                    } else {
                                                                                                        return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>Team Member Panel</span></NavLink></li>)
                                                                                                    }
                                                                                                } else {
                                                                                                    if(menu.url === "/meals"){
                                                                                                        if(meal_menu_active){
                                                                                                            return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>{menu.label}</span></NavLink></li>)
                                                                                                        }else{
                                                                                                            return null
                                                                                                        }
                                                                                                    }else{
                                                                                                        return (<li key={'ddm' + key}><NavLink activeClassName="active" className="menu_item" to={menu.url} exact><span>{menu.label}</span></NavLink></li>)
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }

                                                                                    })
                                                                            }

                                                                            {
                                                                                (this.props.auth.isAuthenticated && Object.values(user.roles).includes('distributor') && Object.values(user.roles).includes('master_affiliate')) ?
                                                                                    <li key={Math.random()}><NavLink activeClassName="active" className="menu_item" to="/my-affiliate-account"><span>{enable_new_signup?'Master Affiliate Dashboard':'Master Affiliate Panel'}</span></NavLink></li>
                                                                                    : ''
                                                                            }

                                                                            {
                                                                                (this.props.auth.isAuthenticated && Object.values(user.roles).includes('customer')) ?
                                                                                    <li key={Math.random()}><a className="menu_item" href={CUSTOMER_URL + 'serviceLogin?token=' + user.token}><span>{enable_new_signup?'My Orders':'My Account'}</span></a></li>
                                                                                    : ''
                                                                            }

                                                                            {
                                                                                (this.props.auth.isAuthenticated && (Object.values(user.roles).includes('master_affiliate') || Object.values(user.roles).includes('distributor'))) ?
                                                                                <li key={Math.random()}><a className="menu_item" href={this.state.training_url} target='_blank'><span>Training</span></a></li>
                                                                                    : ''
                                                                            }

                                                                            {
                                                                                (this.props.auth.isAuthenticated && Object.values(user.roles).includes('team_member')) ?
                                                                                    <li key={Math.random()}><a className="menu_item" href={this.state.training_url} target='_blank'><span>Training</span></a></li>
                                                                                    : ''
                                                                            }

                                                                            {
                                                                                (this.state.menus.length <= 0) ? null :
                                                                                this.state.menus.map(function (menu, key) {
                                                                                    if (menu.type === "external") {
                                                                                        if(menu.manual_position == 'last'){
                                                                                            return (<li key={Math.random()}><a target={menu.open_new_tab== "yes"?"_blank":"_self"} className={`menu_item${history.location.pathname === menu.url ? ' active' : ''}`} href={menu.url}><span>{menu.label}</span></a></li>)
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }

                                                                            {
                                                                                this.props.auth.isAuthenticated && this.props.auth.user.activate_meal ?
                                                                                    <li key={Math.random()} className="pull-right"><NavLink activeClassName="active" className="menu_item" to="/activate-meal"><span>Activate Meal</span></NavLink></li>
                                                                                    : ''
                                                                            }

                                                                            {
                                                                                ENABLE_AFFILIATE_REQUEST ?
                                                                                    <Fragment>
                                                                                        {
                                                                                            (this.props.auth.isAuthenticated && Object.values(user.roles).includes('distributor') && !Object.values(user.roles).includes('master_affiliate')) ?
                                                                                                <li key={Math.random()} className="pull-right"><NavLink activeClassName="active" className="menu_item" to="/affiliate-request"><span>Refer Friends to Join Prestige Labs</span></NavLink></li>
                                                                                                : ''
                                                                                        }
                                                                                    </Fragment>
                                                                                    : ''
                                                                            }

                                                                        </ul>
                                                                    </div>
                                                                // :''
                                                            }
                                                        </Fragment>
                                                        : ''
                                                }

                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </header>
            </React.Fragment>
        );
    }
}

Header.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps, { logout })(Header));