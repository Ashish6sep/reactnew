import React, { Fragment, PureComponent } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { AJAX_REQUEST, ENABLE_NEW_LOGIN } from '../../Constants/AppConstants';
import Parser from "html-react-parser";
import ReactImageFallback from "react-image-fallback";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Training extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            content_text: '',
            courseList: [],
            filteredCourseList: [],
            searchName: '',
            message: '',
            error: "",
            content: "",
            video_embed:"",
        }
        document.title = "Training - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getCourseList();
    }

    getCourseList = (e) => {
        AJAX_REQUEST("POST", "training/getCourseList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    content_text: results.response.content_text,
                    courseList: results.response.data,
                    filteredCourseList: results.response.data,
                    message: results.response.message,
                    content: results.response.content,
                    video_embed:results.response.video_embed,
                    loading: false,
                })
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                })
            }
        })
    }

    filteredCourseList = (e) => {
        this.setState({
            searchName: e.target.value,
            filteredCourseList: this.state.courseList.filter(function (course) {
                if (e.target.value === '') {
                    return course;
                } else {
                    let string = course.title.toUpperCase();
                    let substring = e.target.value.toUpperCase();
                    if (string.includes(substring)) {
                        return course;
                    }
                }
            }.bind(this))
        });
    }

    render() {
        return (
            <Fragment>
                <div className={`trainingListContainer ${this.props.auth.showAlertMessage?'user_login_join_video_with_alert':''}`}>
                    {
                        (this.state.loading) ?
                            <div className="loading container full_page_loader"></div>
                            :
                            <Fragment>
                                <div className="container user_login_join_video_margin">
                                    
                                {
                                    ENABLE_NEW_LOGIN?
                                    <div className={`d_embeed_video user_login_join_video`} style={{overflow:'hidden',width:'100%',marginBottom:'25px'}}>
                                        {
                                            (this.state.video_embed != null) && (this.state.video_embed != '')?
                                            <div className="d_embeed_video" style={{overflow:'hidden',width:'100%', marginBottom:'10px'}}>
                                            {Parser(this.state.video_embed)}
                                        </div>
                                            :''
                                        }

                                        {
                                            (this.state.content != null) && (this.state.content != '')?
                                            <Fragment>
                                                {Parser(this.state.content)}
                                            </Fragment>
                                            :''
                                        }
                                    </div>
                                    :''
                                }


                                    {
                                        // Object.values(this.props.auth.user.roles).includes('team_member') ?
                                        //     <Fragment>
                                        //         <div className="row">
                                        //             <div className="col-md-6 montserrat page-title">PRESTIGE LABS CERTIFICATIONS</div>
                                        //         </div>
                                        //     </Fragment>
                                        //     :
                                            <Fragment>
                                                <div className="row">
                                                    <div className="col-md-6 montserrat page-title">Training</div>
                                                    <div className="col-md-6 text-right montserrat page-title">
                                                        <input onChange={this.filteredCourseList} value={this.state.searchName} name="searchName" type="text" className="trainingSearch" placeholder="Search Training" />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12 montserrat">
                                                        <p className="trainingContent">
                                                            {Parser(this.state.content_text)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Fragment>
                                    }

                                    <div className="row">
                                        {
                                            (this.state.filteredCourseList.length <= 0) ?
                                                Parser("<div className='col-md-12 text-danger text-center'>Course list not found.</div>")
                                                :
                                                <Fragment>
                                                    {
                                                        this.state.filteredCourseList.map(function (course, key) {
                                                            return (
                                                                <Fragment key={`cid${course.course_id}`}>
                                                                    {
                                                                        // Object.values(this.props.auth.user.roles).includes('team_member') ?
                                                                        //     <Fragment>
                                                                        //         {
                                                                        //             course.course_id == 17 ?
                                                                        //                 <div className='col-md-4' key={key}>
                                                                        //                     <article>
                                                                        //                         <div className={(course.enrolled_status == 'enrolled') ? "course_grid_price ribbon-enrolled toTitleCase" : "course_grid_price toTitleCase"}>{course.enrolled_status}</div>
                                                                        //                         <div className="trainingThumbImgContainer">
                                                                        //                             <NavLink to={`/training/${course.course_id}`}>
                                                                        //                                 <ReactImageFallback
                                                                        //                                     src={course.hasOwnProperty('large_image') ? course.large_image : null}
                                                                        //                                     fallbackImage={require('../../Assets/images/preloader.gif')}
                                                                        //                                     initialImage={require('../../Assets/images/preloader.gif')}
                                                                        //                                     alt={course.hasOwnProperty('title') ? course.title : null}
                                                                        //                                     className="trainingThumbImg" />
                                                                        //                             </NavLink>
                                                                        //                         </div>
                                                                        //                         <div className="caption">
                                                                        //                             <span className="entry-title-border"></span>
                                                                        //                             <h3 className="entry-title"><NavLink to={`/training/${course.course_id}`} className="" style={{ color: '#000', textDecoration: 'none' }} >{course.hasOwnProperty('title') ? course.title : ""}</NavLink></h3>
                                                                        //                             <p className="ld_course_grid_button"><NavLink to={`/training/${course.course_id}`} className="seeMore" >See more <i className="fa fa-long-arrow-right" aria-hidden="true"></i></NavLink></p>
                                                                        //                         </div>
                                                                        //                     </article>
                                                                        //                 </div>
                                                                        //                 : ''
                                                                        //         }
                                                                        //     </Fragment>
                                                                        //     : 
                                                                            <div className='col-md-4' key={key}>
                                                                                <article>
                                                                                    <div className={(course.enrolled_status == 'enrolled') ? "course_grid_price ribbon-enrolled toTitleCase" : "course_grid_price toTitleCase"}>{course.enrolled_status}</div>
                                                                                    <div className="trainingThumbImgContainer">
                                                                                        <NavLink to={`/training/${course.course_id}`}>
                                                                                            <ReactImageFallback
                                                                                                src={course.hasOwnProperty('large_image') ? course.large_image : null}
                                                                                                fallbackImage={require('../../Assets/images/preloader.gif')}
                                                                                                initialImage={require('../../Assets/images/preloader.gif')}
                                                                                                alt={course.hasOwnProperty('title') ? course.title : null}
                                                                                                className="trainingThumbImg" />
                                                                                        </NavLink>
                                                                                    </div>
                                                                                    <div className="caption">
                                                                                        <span className="entry-title-border"></span>
                                                                                        <h3 className="entry-title"><NavLink to={`/training/${course.course_id}`} className="" style={{ color: '#000', textDecoration: 'none' }} >{course.hasOwnProperty('title') ? course.title : ""}</NavLink></h3>
                                                                                        <p className="ld_course_grid_button"><NavLink to={`/training/${course.course_id}`} className="seeMore" >See more <i className="fa fa-long-arrow-right" aria-hidden="true"></i></NavLink></p>
                                                                                    </div>
                                                                                </article>
                                                                            </div>

                                                                    }
                                                                </Fragment>


                                                            )
                                                        }.bind(this))
                                                    }
                                                </Fragment>
                                        }

                                    </div>
                                </div>
                            </Fragment>
                    }

                </div>
            </Fragment>
        );
    }
}

Training.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps, null)(Training));