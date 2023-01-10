import React, { Fragment, PureComponent } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { AJAX_REQUEST } from '../../Constants/AppConstants';
import Parser from "html-react-parser";
import ReactImageFallback from "react-image-fallback";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import history from '../../history';

class CourseDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            course_id: this.props.match.params.course_id,
            course_title: '',
            enrolled_status: '',
            courseDetailsList: [],
            filteredCourseDetailsList: [],
            searchName: '',
            message: '',
            error: "",
            expand: true,
            certificate_link: ''
        }
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getCourseDetailsList();
        // if(Object.values(this.props.auth.user.roles).includes('team_member') && (this.props.match.params.course_id !=17)){
        //     history.push('/training');
        // }
    }

    expandAll = (e) => {
        this.setState({ expand: true })
    }

    collapseAll = (e) => {
        this.setState({ expand: false })
    }

    getCourseDetailsList = (e) => {
        let data = { course_id: this.state.course_id }
        AJAX_REQUEST("POST", "training/getCourseDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    enrolled_status: results.response.data.enrolled_status,
                    course_title: results.response.data.title,
                    courseDetailsList: results.response.data.lessons,
                    filteredCourseDetailsList: results.response.data.lessons,
                    message: results.response.message,
                    loading: false,
                    certificate_link: results.response.data.certificate_link
                })
                document.title = results.response.data.title + " - Prestige Labs";;
            } else if (parseInt(results.response.code) === 4004) {
                history.push('/training');
                // window.location.href = BASE_URL + 'training';
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                })
            }
        })
    }

    filteredCourseDetailsList = (e) => {
        this.setState({
            searchName: e.target.value,
            filteredCourseDetailsList: this.state.courseDetailsList.filter(function (lesson) {
                if (e.target.value === '') {
                    return lesson;
                } else {
                    let string = lesson.lesson_title.toUpperCase();
                    let substring = e.target.value.toUpperCase();
                    if (string.includes(substring)) {
                        return lesson;
                    }
                }
            }.bind(this))
        });
    }


    render() {
        const certificate_link = this.state.certificate_link
        return (
            <Fragment>
                <div className="trainingListContainer">
                    {
                        (this.state.loading) ?
                            <div className="loading container full_page_loader"></div>
                            :
                            <Fragment>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-7 montserrat page-title">
                                            {Parser(this.state.course_title)}
                                            <ul className="trainingBreadcrumb">
                                                <li>
                                                    {
                                                        // Object.values(this.props.auth.user.roles).includes('team_member') ?
                                                        // <NavLink to="/training" className="" >PRESTIGE LABS CERTIFICATIONS</NavLink>
                                                        // :
                                                        <NavLink to="/training" className="" >Training</NavLink>
                                                    }
                                                </li>
                                                <li><a href="javascript:void(0)" className="" >{Parser(this.state.course_title)}</a></li>
                                            </ul>
                                        </div>
                                        <div className="col-md-5 text-right montserrat page-title">
                                            <input onChange={this.filteredCourseDetailsList} value={this.state.searchName} name="searchName" type="text" className="trainingSearch" placeholder="Search Lessons" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='col-md-12'>
                                            <div className="learndash_course_content_header" style={{ marginLeft: '0px' }}>
                                                <h4 className="pull-left learndash_course_content_title toTitleCase"> Course Status: {this.state.enrolled_status}
                                                    {
                                                        (certificate_link != '') ?
                                                            <span><br /><br /><a className="seeMore" href={certificate_link} target="_blank">PRINT YOUR CERTIFICATE</a><br /></span>
                                                            : ''
                                                    }
                                                </h4>

                                                <div className="pull-right expand_collapse">
                                                    <a href="javascript:void(0)" onClick={this.expandAll}>Expand All</a>|
                                                    <a href="javascript:void(0)" onClick={this.collapseAll}>Collapse All</a>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="learndash_lessons">
                                                <div className="lessons_list">
                                                    <div className="lessons_list_sample">
                                                        <table className={(this.state.expand) ? "table table-striped" : "table table-striped CollapseAll"}>
                                                            <colgroup>
                                                                <col width="15%" />
                                                                <col width="70%" />
                                                                <col width="15%" />
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <th className="text-center">Lessons</th>
                                                                    <th></th>
                                                                    <th className="text-right">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {
                                                                    (this.state.filteredCourseDetailsList.length <= 0) ?
                                                                        Parser("<tr><td colspan='3' className='text-danger text-center'>Lesson not found.</td></tr>")
                                                                        :
                                                                        <Fragment>
                                                                            {
                                                                                this.state.filteredCourseDetailsList.map(function (course, key) {
                                                                                    return (
                                                                                        <tr key={key}>
                                                                                            <td className="text-center">{Number(key) + 1}</td>
                                                                                            <td>

                                                                                                {
                                                                                                    (course.child.length > 0) ?
                                                                                                        <Fragment>
                                                                                                            <h3>{course.lesson_title}</h3>
                                                                                                            <div className="lessonList">
                                                                                                                <ul>
                                                                                                                    {
                                                                                                                        course.child.map(function (child, index) {
                                                                                                                            return (
                                                                                                                                <li key={index}>
                                                                                                                                    <NavLink to={`/training/lesson/${this.state.course_id}/${child.lesson_id}`} className={(child.is_completed == 'yes') ? "completed" : ""} aria-current="page"><i className="fa fa-check-circle" aria-hidden="true"></i>{child.lesson_title}</NavLink>
                                                                                                                                </li>
                                                                                                                            )
                                                                                                                        }.bind(this))
                                                                                                                    }
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        </Fragment>
                                                                                                        :
                                                                                                        <Fragment>
                                                                                                            <h3><NavLink to={`/training/lesson/${this.state.course_id}/${course.lesson_id}`}>{course.lesson_title}</NavLink></h3>
                                                                                                        </Fragment>
                                                                                                }

                                                                                            </td>
                                                                                            <td className={(course.is_completed == 'yes') ? "text-right statusIco completed" : "text-right statusIco"}><i className="fa fa-shopping-bag" aria-hidden="true"></i></td>
                                                                                        </tr>
                                                                                    )
                                                                                }.bind(this))
                                                                            }
                                                                        </Fragment>
                                                                }

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                    }

                </div>
            </Fragment>
        );
    }
}

CourseDetails.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps, null)(CourseDetails));