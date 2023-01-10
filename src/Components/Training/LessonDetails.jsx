import React, { Fragment, PureComponent } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { AJAX_REQUEST } from '../../Constants/AppConstants';
import Parser from "html-react-parser";
import LessionSideBar from './LessonSideBar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import history from '../../history';

class LessonDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            course_id: this.props.match.params.course_id,
            lesson_id: this.props.match.params.lesson_id,
            previous_id: 0,
            next_id: 0,
            lesson_title: '',
            lessonDescription: '',
            quizzes: [],

            course_title: '',
            courseDetailsList: [],
            filteredCourseDetailsList: [],
            searchName: '',
            message: '',
            error: "",
        }
    }

    componentDidMount() {
        this.getLessonDetailsList();
        this.getCourseDetailsList();
        // if(Object.values(this.props.auth.user.roles).includes('team_member') && (this.props.match.params.course_id !=17)){
        //     history.push('/training');
        // }
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            this.setState({ lesson_id: this.props.match.params.lesson_id, })
            this.getLessonDetailsList(this.props.match.params.lesson_id);
            this.getCourseDetailsList();
        }
    }

    getLessonDetailsList = (lesson_id = null) => {
        document.querySelector("body").scrollIntoView();
        let data = {
            course_id: this.state.course_id,
            lesson_id: (lesson_id == null) ? this.state.lesson_id : lesson_id
        }
        AJAX_REQUEST("POST", "training/getLessonDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    previous_id: results.response.data.previous_id,
                    next_id: results.response.data.next_id,
                    lesson_title: results.response.data.title,
                    lessonDescription: results.response.data.description,
                    quizzes: results.response.data.quizzes,
                    message: results.response.message,
                    loading: false,
                })
                document.title = results.response.data.title + " - Prestige Labs";;
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                })
            }
        })
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
                })
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
        return (
            <Fragment>
                <div className="trainingListContainer">
                    {
                        (this.state.loading) ?
                            <div className="loading container"></div>
                            :
                            <Fragment>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-7 montserrat page-title">
                                            {this.state.lesson_title}
                                            <ul className="trainingBreadcrumb">
                                                <li><NavLink to="/training" className="" >Training</NavLink></li>
                                                <li><NavLink to={`/training/${this.state.course_id}`} className="" >{this.state.course_title}</NavLink></li>
                                                <li><a href="javascript:void(0)" className="" >{this.state.lesson_title}</a></li>
                                            </ul>
                                        </div>
                                        <div className="col-md-5 text-right montserrat page-title">
                                            <input onChange={this.filteredCourseDetailsList} value={this.state.searchName} name="searchName" type="text" className="trainingSearch" placeholder="Search Lesson" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='col-md-8'>
                                            <div className="montserrat trainingVideo">
                                                {/* <div className="trainingVideoTitle">
                                                    Supplement Selling Secret Overview
                                                </div> */}
                                                <div className="">
                                                    {Parser(this.state.lessonDescription)}
                                                </div>
                                            </div>
                                            {
                                                (this.state.quizzes.length > 0) ?
                                                    <Fragment>
                                                        <div className="montserrat quizzes">
                                                            <table className="table table-bordered">
                                                                <colgroup>
                                                                    <col width="15%" />
                                                                    <col width="85%" />
                                                                </colgroup>
                                                                <thead>
                                                                    <tr>
                                                                        <th className="text-center">Quizzes</th>
                                                                        <th className="text-right">Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        this.state.quizzes.map(function (quizze, qKey) {
                                                                            return (
                                                                                <tr key={qKey}>
                                                                                    <td className="text-center">{Number(qKey) + 1}</td>
                                                                                    <td>
                                                                                        <div className={(quizze.is_completed == 'yes') ? "quizzesTitle quizzesTitleCompleted" : "quizzesTitle"}>
                                                                                            <NavLink to={`/training/quiz/${this.state.course_id}/${this.state.lesson_id}/${quizze.quiz_id}`} className="" >{quizze.quiz_title}</NavLink>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }.bind(this))
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </Fragment>
                                                    : ""

                                            }

                                            <div className="montserrat trainingVideoNextPrev">
                                                {
                                                    (this.state.previous_id > 0) ?
                                                        <Fragment>
                                                            <div className="pull-left">
                                                                <NavLink className="" to={`/training/lesson/${this.state.course_id}/${this.state.previous_id}`}><i className="fa fa-long-arrow-left" aria-hidden="true"></i> Previous Topic</NavLink>
                                                            </div>
                                                        </Fragment>
                                                        : ""
                                                }

                                                {
                                                    (this.state.next_id > 0) ?
                                                        <Fragment>
                                                            <div className="pull-right">
                                                                <NavLink className="" to={`/training/lesson/${this.state.course_id}/${this.state.next_id}`}>Next Topic <i className="fa fa-long-arrow-right" aria-hidden="true"></i></NavLink>
                                                            </div>
                                                        </Fragment>
                                                        : ""
                                                }
                                                <div className="clearfix"></div>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <LessionSideBar course_id={this.state.course_id} lesson_id={this.state.lesson_id} lessionList={this.state.filteredCourseDetailsList} />
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

LessonDetails.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps, null)(LessonDetails));