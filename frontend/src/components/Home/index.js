import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Cookies from "universal-cookie";

import {
    getMovieList,
    getMovieLabel,
    login,
    signup,
    logout,
    updateRatings
} from "../../actions/dramas_actions";
import Mymovie from "../Mymovie";
import Recommend from "../Recommend";
import Login from "../Login";
import Logout from "../Logout";
import Rating from "../Recommend/rating.js"

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ratingOpen: false,
            ratingMovie: null
        }
        this.selectedMovie = this
            .selectedMovie
            .bind(this)
        this.ratingClose = this
            .ratingClose
            .bind(this)
    }
    componentDidMount() {
        this
            .props
            .actions
            .getMovieLabel();
        this
            .props
            .actions
            .getMovieList();
    }
    selectedMovie(value) {
        console.log(value);
        this.setState({ratingMovie: value, ratingOpen: true})
    }
    ratingClose() {
        this.setState({ratingMovie: null, ratingOpen: false})
    }
    callbackUpdate = (data) => {
        this
            .props
            .actions
            .updateRatings(data, this.props.actions.getMovieList);
    }
    callbackLogout = () => {
        this
            .props
            .actions
            .logout(this.props.actions.getMovieList)
    }
    callbackLogin = (data) => {
        this
            .props
            .actions
            .login(data, this.props.actions.getMovieList)
    }
    render() {
        // console.log(this.props);
        const cookies = new Cookies();
        const SessionComponent = typeof cookies.get('session') === "undefined"
            ? (<Login
                loginAction={this.callbackLogin}
                signupAction={this.props.actions.signup}/>)
            : (<Logout logoutAction={this.callbackLogout}/>);
        return (
            <div>
                {SessionComponent}
                <Mymovie
                    my_movie_list={this.props.page_data.my_movie_list}
                    movie_label={this.props.page_data.movie_label}/>
                <Recommend
                    recommend_list={this
                    .props
                    .page_data
                    .recommend_list
                    .slice(0, 20)}
                    movie_label={this.props.page_data.movie_label}
                    selectedMovie={this.selectedMovie}/>
                <Rating
                    selectedMovie={this.state.ratingMovie}
                    updateAction={this.callbackUpdate}
                    onClose={this.ratingClose}
                    open={this.state.ratingOpen}/>
            </div>
        )

    }
}

Home.propTypes = {};

Home.defaultProps = {
    page_data: {},
    system_data: {}
};

function mapStateToProps(state) {
    return {page_data: state.page, system_data: state.system};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getMovieList,
            getMovieLabel,
            login,
            signup,
            logout,
            updateRatings
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);