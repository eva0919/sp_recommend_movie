import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createStore, applyMiddleware} from "redux";
import reduxThunk from "redux-thunk";
import injectTapEventPlugin from "react-tap-event-plugin";

import reducers from "./reducers";
import Home from "./components/Home"

injectTapEventPlugin();
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const App = () => {
  return <Home/>;
};

ReactDOM.render(
  <Provider store={store}>
  <App/>
</Provider>, document.getElementById("app"));
