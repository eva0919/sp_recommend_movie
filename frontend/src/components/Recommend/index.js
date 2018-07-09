import React from "react";
import Button from '@material-ui/core/Button';
// import {connect} from "react-redux"; import {bindActionCreators} from
// "redux"; import {getMovieList, getMovieLabel} from
// "../../actions/dramas_actions";
import "./recommend.css";

const styles = {
  recommendList: {
    width: "500px",
    border: "1px solid #333"
  }
}

class Dramas extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick(value) {
    console.log(value);
    this
      .props
      .selectedMovie(value);
  }
  render() {
    // console.log(this.props);
    const {recommend_list, movie_label} = this.props;
    let nodes = null;
    // console.log(recommend_list); console.log(movie_label);
    if (Object.keys(movie_label).length > 0) {
      nodes = recommend_list.map(map => {
        if (movie_label[map.ID]) {
          return <Button onClick={this
            .handleClick
            .bind(this, map)}>{movie_label[map.ID]}</Button>
        }
        return
      })
    }
    return <div
      style={{
      height: 500,
      overflowY: "scroll",
      marginTop: 50
    }}>
      <hr/>
      <h3>Recommend Movie List</h3>
      {nodes}
    </div>
  }
}

Dramas.propTypes = {};

Dramas.defaultProps = {
  recommend_list: [],
  movie_label: []
};

// function mapStateToProps(state) {   return {page_data: state.page}; }
// function mapDispatchToProps(dispatch) {   return {     actions:
// bindActionCreators({       getMovieList,       getMovieLabel     }, dispatch)
//   }; }

export default Dramas;