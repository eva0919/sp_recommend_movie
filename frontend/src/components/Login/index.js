import React from "react";
import Button from '@material-ui/core/Button';
// import {connect} from "react-redux"; import {bindActionCreators} from
// "redux"; import {getMovieList, getMovieLabel} from
// "../../actions/dramas_actions"; import "./dramas.css";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            email: "",
            password: "",
            submitType: ""
        }
        this.loginHandler = this
            .loginHandler
            .bind(this);
        this.signupHandler = this
            .signupHandler
            .bind(this);
        this.handleEmailChange = this
            .handleEmailChange
            .bind(this);
        this.handlePasswordChange = this
            .handlePasswordChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);

    }
    loginHandler() {
        this.setState({open: true, submitType: "login"})
    }
    signupHandler() {
        this.setState({open: true, submitType: "signup"})
    }
    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }
    handleSubmit(event) {
        if (this.state.submitType === "login") {
            this
                .props
                .loginAction({email: this.state.email, password: this.state.password})
        } else if (this.state.submitType === "signup") {
            this
                .props
                .signupAction({email: this.state.email, password: this.state.password})
        }
        this.setState({open: false, submitType: ""})
        event.preventDefault();
    }
    render() {

        const loginComponent = this.state.open
            ? (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Email:
                            <input type="text" value={this.state.email} onChange={this.handleEmailChange}/>
                        </label>
                        <label>
                            Password:
                            <input
                                type="text"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}/>
                        </label>
                        <input type="submit" value="Submit"/>
                    </form>
                </div>
            )
            : null
        return <div style={{
            float: "right"
        }}>
            <Button color="primary" onClick={this.loginHandler}>Login</Button>
            {"/"}
            <Button onClick={this.signupHandler}>Sign Up</Button>
            {loginComponent}
        </div>
    }
}

// function mapStateToProps(state) {     return {page_data: state.page}; }
// function mapDispatchToProps(dispatch) {     return {         actions:
// bindActionCreators({             getMovieList,             getMovieLabel },
// dispatch)     }; } export default connect(mapStateToProps,
// mapDispatchToProps)(Login);

export default Login;