import React, { Fragment, PureComponent } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Parser from 'html-react-parser';
import { AJAX_REQUEST } from '../../Constants/AppConstants';
import classnames from 'classnames';
import serialize from 'form-serialize';
import TrainingAnswer from './TrainingAnswer';
import LessionSideBar from './LessonSideBar';

class TrainingQuiz extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            quiz_title: '',
            quiz_total: '',
            questions: [],
            show_start_quiz: true,
            question_start_show: false,
            current_question: 1,
            answer_process_show: false,
            result_show: false,
            question_answer_show: false,
            next_quiz_show: false,
            finish_quiz_show: false,
            progress: 0,
            start_time: 0,
            end_time: 0,
            no_of_correct_answers: 0,
            total_points: 0,
            total_points_gained: 0,
            total_points_gained_percent: '0.00',
            time: '00:00:00',
            answered_questions: [],
            error: '',
            lesson_id: this.props.match.params.lesson_id,
            filteredCourseDetailsList: [],
        }
    }

    componentDidMount() {
        this.getQuizDetails();
        this.getCourseDetailsList();
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            this.getCourseDetailsList();
        }
    }

    getCourseDetailsList = (e) => {
        let data = { course_id: this.props.match.params.course_id }
        AJAX_REQUEST("POST", "training/getCourseDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
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

    getQuizDetails = (e) => {
        this.setState({ loading: true });
        document.querySelector("body").scrollIntoView();
        AJAX_REQUEST("POST", "training/getQuizDetails", { course_id: this.props.match.params.course_id, quiz_id: this.props.match.params.quiz_id }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    quiz_title: results.response.data.quiz_title,
                    quiz_total: parseInt(results.response.data.quiz_total),
                    questions: results.response.data.questions,
                    loading: false,
                });
                document.title = results.response.data.quiz_title;
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                })
            }
        });
    }

    startQuiz = () => {
        this.setState({
            show_start_quiz: false,
            question_start_show: true,
            current_question: 1,
            answer_process_show: false,
            result_show: false,
            question_answer_show: false,
            next_quiz_show: true,
            finish_quiz_show: false,
            start_time: performance.now(),
        });
    }

    nextQuestion = () => {
        if (this.state.current_question == (this.state.quiz_total - 1)) {
            this.setState({
                show_start_quiz: false,
                question_start_show: true,
                current_question: this.state.current_question + 1,
                answer_process_show: false,
                result_show: false,
                question_answer_show: false,
                next_quiz_show: false,
                finish_quiz_show: true,
            });
        } else {
            this.setState({
                show_start_quiz: false,
                question_start_show: true,
                current_question: this.state.current_question + 1,
                answer_process_show: false,
                result_show: false,
                question_answer_show: false,
                next_quiz_show: true,
                finish_quiz_show: false,
            });
        }
    }

    submitQuiz = (e) => {
        e.preventDefault();
        const form = document.querySelector('#quiz_form');
        const data = serialize(form, { hash: true });
        if (data.answers) {
            this.setState({
                show_start_quiz: false,
                question_start_show: false,
                current_question: 1,
                answer_process_show: true,
                result_show: false,
                question_answer_show: false,
                next_quiz_show: false,
                finish_quiz_show: false,
                end_time: performance.now(),
                error: '',
            });

            data.miliseconds_time = performance.now() - this.state.start_time;

            let sinterval = setInterval(function () {
                if (this.state.progress > 90) {
                    setTimeout(function () {
                        this.setState({
                            progress: 95
                        })
                        clearInterval(sinterval);
                    }.bind(this), 100)
                } else {
                    this.setState({
                        progress: this.state.progress + 2
                    })
                }
            }.bind(this), 100);

            AJAX_REQUEST("POST", "training/generateQuizResult", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    this.setState({
                        progress: 100,
                        no_of_correct_answers: results.response.data.no_of_correct_answers,
                        total_points: results.response.data.total_points,
                        total_points_gained: results.response.data.total_points_gained,
                        total_points_gained_percent: results.response.data.total_points_gained_percent,
                        time: results.response.data.time,
                        answered_questions: results.response.data.questions,
                        error: ''
                    });
                    setTimeout(function () {
                        this.setState({
                            show_start_quiz: false,
                            question_start_show: false,
                            current_question: 1,
                            answer_process_show: false,
                            result_show: true,
                            question_answer_show: false,
                            next_quiz_show: false,
                            finish_quiz_show: false,
                        });
                    }.bind(this), 100)
                } else {
                    this.setState({
                        error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                        show_start_quiz: true,
                        question_start_show: false,
                        current_question: 1,
                        answer_process_show: false,
                        result_show: false,
                        question_answer_show: false,
                        next_quiz_show: false,
                        finish_quiz_show: false,
                        start_time: 0,
                        end_time: 0,
                        progress: 0,
                    })
                    setTimeout(function () {
                        this.setState({
                            error: ''
                        });
                    }.bind(this), 5000)
                }
            });
        } else {
            this.setState({
                error: Parser("<p className='text-danger'>Please submit at least one question answer</p>")
            })
        }
    }

    viewQuestion = () => {
        this.setState({
            question_answer_show: !this.state.question_answer_show,
        });
    }

    restartQuiz = () => {
        this.setState({
            show_start_quiz: true,
            question_start_show: false,
            current_question: 1,
            answer_process_show: false,
            result_show: false,
            question_answer_show: false,
            next_quiz_show: false,
            finish_quiz_show: false,
            start_time: 0,
            end_time: 0,
            progress: 0,
        });
    }

    render() {
        const course_id = this.props.match.params.course_id;
        const quiz_id = this.props.match.params.quiz_id;
        const lesson_id = this.props.match.params.lesson_id;
        const current_question = this.state.current_question;
        const progress = this.state.progress;
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading container full_page_loader"></div>
                        :
                        <Fragment>
                            <div className="trainingListContainer">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-7 montserrat page-title">
                                            Quiz
                                <ul className="trainingBreadcrumb">
                                                <li><NavLink to="/training" className="" >Training</NavLink></li>
                                                <li><a href="javascript:void(0)" className="" >{this.state.quiz_title}</a></li>
                                            </ul>
                                        </div>
                                        <div className="col-md-5 text-right montserrat page-title">
                                            <input type="text" className="trainingSearch" placeholder="Search Training" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='col-md-8'>
                                            <div className="montserrat trainingVideo">
                                                <div className="trainingVideoTitle">
                                                    <form id="quiz_form" method="POST" onSubmit={this.submitQuiz}>
                                                        <input type="hidden" name="course_id" value={course_id} />
                                                        <input type="hidden" name="quiz_id" value={quiz_id} />
                                                        <input type="hidden" name="lesson_id" value={lesson_id} />
                                                        {this.state.quiz_title}
                                                        {
                                                            this.state.error != '' ?
                                                                <Fragment>{this.state.error}</Fragment>
                                                                :
                                                                ''
                                                        }
                                                        {
                                                            this.state.show_start_quiz ?
                                                                <div className="QuizQuestionStart">
                                                                    <button type="button" className="seeMore StartQuizBtn" onClick={this.startQuiz}>Start Quiz</button>
                                                                </div>
                                                                : ''
                                                        }

                                                        {
                                                            this.state.question_start_show ?
                                                                <div className="QuizQuestionStart">
                                                                    <div className="QuizQuestionWrapper">
                                                                        <div className="QuizQuestionSl">
                                                                            <span className="totalQuestion">Question {this.state.current_question} of {this.state.quiz_total}</span>
                                                                            <span>{this.state.current_question}. Question</span>

                                                                            {
                                                                                this.state.questions.length <= 0 ? <p className="text-center">No Question Found</p> :
                                                                                    this.state.questions.map(function (question, key) {
                                                                                        return (
                                                                                            <Fragment key={'p' + key + question.question_no}>
                                                                                                {
                                                                                                    question.question_type == 'single' ?
                                                                                                        <Fragment key={key + question.question_no}>
                                                                                                            <div className={classnames("question", { 'displayNone': (question.question_no != current_question) })}>{Parser(question.question)}</div>
                                                                                                            <div className={classnames("questionList", { 'displayNone': (question.question_no != current_question) })}>
                                                                                                                <ul>
                                                                                                                    {
                                                                                                                        question.answers.map(function (qq, key2) {
                                                                                                                            return (
                                                                                                                                <li key={'qq' + question.question_no + key2}>
                                                                                                                                    <div className="form-check">
                                                                                                                                        <input className="form-check-input" type="radio" name={'answers[' + question.question_id + '][]'} id={'qq' + question.question_no + key2} value={qq} />
                                                                                                                                        <label className="form-check-label" htmlFor={'qq' + question.question_no + key2}> {qq} </label>
                                                                                                                                    </div>
                                                                                                                                </li>
                                                                                                                            )
                                                                                                                        })
                                                                                                                    }
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        </Fragment>
                                                                                                        :
                                                                                                        <Fragment key={key + question.question_no}>
                                                                                                            <div className={classnames("question", { 'displayNone': (question.question_no != current_question) })}>{Parser(question.question)}</div>
                                                                                                            <div className={classnames("questionList", { 'displayNone': (question.question_no != current_question) })}>
                                                                                                                <ul>
                                                                                                                    {
                                                                                                                        question.answers.map(function (qq, key2) {
                                                                                                                            return (
                                                                                                                                <li key={'qq' + question.question_no + key2}>
                                                                                                                                    <div className="form-check">
                                                                                                                                        <input className="form-check-input" type="checkbox" name={'answers[' + question.question_id + '][]'} id={'qq' + question.question_no + key2} value={qq} />
                                                                                                                                        <label className="form-check-label" htmlFor={'qq' + question.question_no + key2}> {qq} </label>
                                                                                                                                    </div>
                                                                                                                                </li>
                                                                                                                            )
                                                                                                                        })
                                                                                                                    }
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        </Fragment>
                                                                                                }
                                                                                            </Fragment>
                                                                                        )
                                                                                    })
                                                                            }

                                                                            {
                                                                                this.state.next_quiz_show ?
                                                                                    <a className="pull-right seeMore" href="javascript:void(0)" onClick={this.nextQuestion}>Next</a>
                                                                                    : ''
                                                                            }
                                                                            {
                                                                                this.state.finish_quiz_show ?
                                                                                    <input type="submit" className="pull-right seeMore" href="javascript:void(0)" value="Finish Quiz" />
                                                                                    : ''
                                                                            }
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                : ''
                                                        }

                                                        {
                                                            this.state.answer_process_show ?
                                                                <div className="QuizQuestionLoader">
                                                                    <h3>Results</h3>
                                                                    <p className="result_in_progress">Quiz complete. Reslts are being recorded.</p>
                                                                    <div className="progress">
                                                                        <div className="progress-bar" role="progressbar" style={{ width: progress + "%" }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                                : ''
                                                        }

                                                        {
                                                            this.state.result_show ?
                                                                <div className="QuizQuestionResults">
                                                                    <h3>Results</h3>
                                                                    <span>{this.state.no_of_correct_answers} of {this.state.quiz_total} questions answered correctly</span>
                                                                    <span>Your time: {this.state.time}</span>
                                                                    <p>You have reached {this.state.total_points_gained} of {this.state.total_points} point(s), ({this.state.total_points_gained_percent}%)</p>
                                                                    <a className="seeMore" href="javascript:void(0)" onClick={this.restartQuiz}>Restart Quiz</a>
                                                                    <a className="seeMore" href="javascript:void(0)" onClick={this.viewQuestion}>View questions</a>
                                                                </div>
                                                                : ''
                                                        }

                                                        {
                                                            this.state.question_answer_show ?
                                                                <div className="QuizQuestionViews">
                                                                    {
                                                                        this.state.answered_questions.length <= 0 ? <p className="text-center">No Question Found</p> :
                                                                            this.state.answered_questions.map(function (answered_question, key) {
                                                                                return (
                                                                                    <Fragment key={'ap' + key + answered_question.question_no}>
                                                                                        {
                                                                                            <Fragment key={key + answered_question.question_no}>
                                                                                                <div className="QuizQuestionSl">
                                                                                                    <span>{answered_question.question_no}. Question</span>
                                                                                                    <div className="question">{Parser(answered_question.question)}</div>
                                                                                                    <div className="questionList">
                                                                                                        <ul>
                                                                                                            {
                                                                                                                answered_question.answers.map(function (qq, key2) {
                                                                                                                    return (
                                                                                                                        <TrainingAnswer question={qq}
                                                                                                                            all_questions={answered_question.answers}
                                                                                                                            question_answers={answered_question.question_answers} correct_answer={answered_question.correct_answer} type={answered_question.question_type} key={Math.random()} />
                                                                                                                    )
                                                                                                                }.bind(this))
                                                                                                            }
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Fragment>
                                                                                        }
                                                                                    </Fragment>
                                                                                )
                                                                            }.bind(this))
                                                                    }
                                                                </div>
                                                                : ''
                                                        }
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <LessionSideBar course_id={this.props.match.params.course_id} lesson_id={this.state.lesson_id} lessionList={this.state.filteredCourseDetailsList} />
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

export default TrainingQuiz;