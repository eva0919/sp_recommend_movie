import React from "react";

class Mymovie extends React.Component {
    render() {
        const {my_movie_list, movie_label} = this.props;
        console.log(my_movie_list);
        let nodes = null;
        if (Object.keys(movie_label).length > 0) {
            nodes = Object
                .keys(my_movie_list)
                .map(key => {
                    return <div >{movie_label[key]}
                        : {my_movie_list[key]}</div>
                })
        }
        let title = "";
        if (nodes && nodes.length > 0) {
            title = "My Rated Movies"
        }
        return (
            <div
                style={{
                margin: 20,
                maxHeight: 500,
                overflowY: "scroll"
            }}>
                <h3>{title}</h3>
                {nodes}
            </div>
        )
    }
}

Mymovie.defaultProps = {
    my_movie_list: {
        recommend_list: [],
        my_movie_list: [],
        movie_label: []
    },
    movie_label: {}
};

export default Mymovie;