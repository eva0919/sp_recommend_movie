import {
  combineReducers
} from "redux";
import pageReducer from "./page_reducer";
import systemReducer from "./system_reducer";

const rootReducer = combineReducers({
  page: pageReducer,
  system: systemReducer
});

export default rootReducer;