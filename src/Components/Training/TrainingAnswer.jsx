import React, { PureComponent } from 'react';

class TrainingAnswer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() {

        const current_question = this.props.question.trim();
        if(this.props.correct_answer.includes(current_question)){
            if(this.props.question_answers.includes(current_question)){
                return (
                    <li className="text-success" key={Math.random()}>
                        <div className="form-check">
                            <input className="form-check-input" type={this.props.type=='single'?'radio':'checkbox'} name={Math.random()}   defaultChecked />
                            <label className="form-check-label" htmlFor="exampleRadios2"> {current_question} </label>
                        </div>
                    </li>
                );
            }else{
                return (
                    <li className="text-success" key={Math.random()}>
                        <div className="form-check">
                            <input className="form-check-input" type={this.props.type=='single'?'radio':'checkbox'} name={Math.random()}   />
                            <label className="form-check-label" htmlFor="exampleRadios2"> {current_question} </label>
                        </div>
                    </li>
                );
            }
        }else{
            let ans_found = false;
            this.props.question_answers.map(function (my_answer, key2) {
                if(current_question == my_answer.trim()){
                    ans_found = true;
                }
            }.bind(this))
            if(ans_found){
                return (
                    <li className="text-danger" key={Math.random()}>
                        <div className="form-check">
                            <input className="form-check-input" type={this.props.type=='single'?'radio':'checkbox'} name={Math.random()} id="exampleRadios1"  defaultChecked />
                            <label className="form-check-label" htmlFor="exampleRadios1"> {current_question} </label>
                        </div>
                    </li>
                );
            }else{
                return (
                    <li>
                        <div className="form-check" key={Math.random()}>
                            <input className="form-check-input" type={this.props.type=='single'?'radio':'checkbox'} name={Math.random()} id="exampleRadios3"  />
                            <label className="form-check-label" htmlFor="exampleRadios3"> {current_question} </label>
                        </div>
                    </li>
                );
            }
        }
    }
}
 
export default TrainingAnswer;