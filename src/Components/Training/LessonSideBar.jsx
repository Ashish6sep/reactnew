import React, { Fragment, PureComponent } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { AJAX_REQUEST } from '../../Constants/AppConstants';
import Parser from "html-react-parser";
import Navigation from './Navigation';

class LessionSideBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            expand: true,
        }
    }

    componentDidMount() {
        this.setState({ loading: false })
    }

    render() {

        return (
            <div className="course-navigation-aside">
                <h3 className="montserrat course-navigation-aside-title">Course Navigation</h3>
                {
                    (this.state.loading) ?
                        <div className="loading container"></div>
                        :
                        <Fragment>
                            <div className="learndash_navigation_lesson_topics_list">
                                {
                                    (this.props.lessionList.length > 0) ?
                                        <Fragment>
                                            {
                                                this.props.lessionList.map(function (lesson, key) {
                                                    return (
                                                        <Navigation key={key} lesson={lesson} course_id={this.props.course_id} lesson_id={this.props.lesson_id} />
                                                    )
                                                }.bind(this))
                                            }
                                        </Fragment>
                                        : ""
                                }
                            </div>
                        </Fragment>
                }
            </div>
        );
    }
}

export default LessionSideBar;