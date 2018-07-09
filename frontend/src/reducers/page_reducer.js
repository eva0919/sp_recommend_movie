import {
    GET_MOVIE_LIST,
    UPDATE_MOVIE_RATINGS,
    GET_MOVIE_LABEL
} from "../actions/types";

export default function dramasReducer(
    state = {
        recommend_list: [],
        my_movie_list: [],
        movie_label: [],
    },
    action
) {
    // console.log(action);
    switch (action.type) {
        case GET_MOVIE_LIST:
            return { ...state,
                recommend_list: action.payload.RecommendList || [],
                my_movie_list: action.payload.MyMovie || []
            };
        case UPDATE_MOVIE_RATINGS:
            return { ...state,
                // recommend_list: action.payload.recommend_list,
                my_movie_list: { ...state.my_movie_list,
                    ...action.payload
                }
            };
        case GET_MOVIE_LABEL:
            return { ...state,
                movie_label: action.payload || []
            }
        default:
            return state;
    }
}