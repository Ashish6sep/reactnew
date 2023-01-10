import React, { Fragment, PureComponent } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class Navigation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
        }
    }

    expandToggle = (e) => {
        this.setState({ expand: !this.state.expand })
    }

    componentDidMount() {
        this.checkParentLesson();
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            this.checkParentLesson();
        }
    }

    checkParentLesson = () => {
        let lesson = this.props.lesson;
        lesson.child.forEach(function (child, index) {
            if (child.lesson_id == this.props.lesson_id) {
                this.setState({ expand: true })
            }
        }.bind(this));
    }

    render() {
        let lesson = this.props.lesson;
        return (
            <Fragment key={Math.random()}>
                <div className="lesson_topics_list_wrapper">
                    <div className=
                        {
                            (lesson.is_completed == 'yes') ?
                                (this.state.expand) ?
                                    "list_arrow flippable lesson_completed expand"
                                    :
                                    "list_arrow flippable lesson_completed"
                                :
                                (this.state.expand) ?
                                    "list_arrow flippable lesson_incomplete expand"
                                    :
                                    "list_arrow flippable lesson_incomplete"
                        }
                    >
                    </div>
                    <div className="list_lessons">
                        <div className="lesson">
                            {
                                (lesson.child.length > 0) ?
                                    <a onClick={this.expandToggle} className="" href="javascript:void(0)">{lesson.lesson_title}</a>
                                    :
                                    <NavLink onClick={this.expandToggle} className="" to={`/training/lesson/${this.props.course_id}/${lesson.lesson_id}`}>{lesson.lesson_title}</NavLink>
                            }
                        </div>
                        <div className={(this.state.expand) ? "flip learndash_topic_widget_list displayShow" : "flip learndash_topic_widget_list displayNone"}>
                            <ul>
                                {
                                    (lesson.child.length > 0) ?
                                        <Fragment key={Math.random}>
                                            {
                                                lesson.child.map(function (child, index) {
                                                    return (
                                                        <li className="" key={index}>
                                                            <span className="topic_item">
                                                                <NavLink to={`/training/lesson/${this.props.course_id}/${child.lesson_id}`} className={(child.is_completed == 'yes') ? "topic-completed" : "topic-notcompleted"}>
                                                                    <span>{child.lesson_title}</span>
                                                                </NavLink>
                                                            </span>
                                                        </li>
                                                    )
                                                }.bind(this))
                                            }
                                        </Fragment>
                                        : ""
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Navigation;