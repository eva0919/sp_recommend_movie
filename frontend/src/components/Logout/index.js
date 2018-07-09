import React from "react";

// import {connect} from "react-redux"; import {bindActionCreators} from
// "redux"; import {getMovieList, getMovieLabel} from
// "../../actions/dramas_actions"; import "./dramas.css";

class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this
            .logout
            .bind(this);

    }
    logout() {
        this
            .props
            .logoutAction();
    }

    render() {
        return <div style={{
            float: "right"
        }}>
            <button onClick={this.logout}>Logout</button>
        </div>
    }
}

// function mapStateToProps(state) {     return {page_data: state.page}; }
// function mapDispatchToProps(dispatch) {     return {         actions:
// bindActionCreators({             getMovieList,             getMovieLabel },
// dispatch)     }; } export default connect(mapStateToProps,
// mapDispatchToProps)(Login);

export default Logout;