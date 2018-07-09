import {
    LOGIN,
    LOGOUT,
    SIGNUP
} from "../actions/types";

export default function dramasReducer(
    state = {
        session: ""
    },
    action
) {
    switch (action.type) {
        case LOGIN:
            return { ...state,
                session: action.payload.session
            };
        case LOGOUT:
            return { ...state,
                session: ""
            };
        case SIGNUP:
            return state;
        default:
            return state;
    }
}