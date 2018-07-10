import {
    LOGIN,
    LOGOUT,
    SIGNUP
} from "../actions/types";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function systemReducer(
    state = {
        isLogin: typeof cookies.get('session') === "undefined" ? false : true
    },
    action
) {
    switch (action.type) {
        case LOGIN:
            return { ...state,
                isLogin: true
            };
        case LOGOUT:
            return { ...state,
                isLogin: false
            };
        case SIGNUP:
            return { ...state,
                isLogin: true
            };
        default:
            return state;
    }
}