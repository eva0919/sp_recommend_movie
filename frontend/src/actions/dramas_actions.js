import axios from "axios";
import Cookies from "universal-cookie";

import * as Types from "./types";
/* EXAMPLE
export function getDramas() {
  return function _(dispatch) {
    axios({
        method: "GET",
        url: `/api/dramas`,
        params: {}
      })
      .then(response => {
        const result = response.data.data;
        dispatch({
          type: GET_DRAMAS,
          payload: result
        });
      })
      .catch(response => {});
  };
}
*/

export function signup(data) {
  const requestConfig = {
    method: "POST",
    url: `/api/signup`,
    params: {
      email: data.email,
      password: data.password
    }
  }
  return function _(dispatch) {
    axios(requestConfig).then(response => {
        const result = response.data.data;
        dispatch({
          type: Types.SIGNUP,
          payload: result
        });
      })
      .catch(defaultCatchHandler);
  }
}

export function login(data, callback) {
  const requestConfig = {
    method: "POST",
    url: `/api/login`,
    data: {
      email: data.email,
      password: data.password
    }
  }
  return function _(dispatch) {
    axios(requestConfig).then(response => {
        const cookies = new Cookies();
        cookies.set('session', response.data.session, {
          path: '/'
        });
        const result = response.data;
        if (callback) {
          callback()
        }
        dispatch({
          type: Types.LOGIN,
          payload: result
        });
      })
      .catch(defaultCatchHandler);
  }
}

export function logout(callback) {
  const cookies = new Cookies();
  const session = cookies.get('session') === "undefined" ? "" :
    cookies.get('session');
  const requestConfig = {
    method: "POST",
    url: `/api/logout`,
    headers: {
      session: session
    }
  }
  return function _(dispatch) {
    axios(requestConfig).then(response => {
        cookies.remove("session");
        const result = response.data.data;
        if (callback) {
          callback()
        }
        dispatch({
          type: Types.LOGOUT,
          payload: result
        });
      })
      .catch(defaultCatchHandler);
  }
}

export function getMovieList() {
  const cookies = new Cookies();
  const session = typeof cookies.get('session') === "undefined" ? "" :
    cookies.get('session');
  const requestConfig = {
    method: "GET",
    url: `/api/movie_list`,
    headers: {
      session: session
    }
  }
  return function _(dispatch) {
    axios(requestConfig).then(response => {
        // console.log(response.data);
        const result = response.data.result;
        dispatch({
          type: Types.GET_MOVIE_LIST,
          payload: result
        });
      })
      .catch(defaultCatchHandler);
  }
}

export function getMovieLabel() {
  const requestConfig = {
    method: "GET",
    url: `/api/movie_label`,
  }
  return function _(dispatch) {
    axios(requestConfig).then(response => {
        // console.log(response.data);
        const result = response.data.result;
        dispatch({
          type: Types.GET_MOVIE_LABEL,
          payload: result
        });
      })
      .catch(defaultCatchHandler);
  }
}


export function updateRatings(data, callback) {
  const cookies = new Cookies();
  const session = typeof cookies.get('session') === "undefined" ? "" :
    cookies.get('session');
  const requestConfig = {
    method: "PUT",
    url: `/api/my_movies`,
    headers: {
      session: session
    },
    data: {
      MovieID: parseInt(data.movieID),
      Ratings: parseFloat(data.ratings)
    }
  }
  return function _(dispatch) {
    axios(requestConfig).then(response => {
        console.log(response)
        // const result = response.data.data;
        if (callback) {
          callback()
        }
        dispatch({
          type: Types.UPDATE_MOVIE_RATINGS,
          payload: data.selectedMovie
        });
      })
      .catch(defaultCatchHandler);
  }
}

function defaultCatchHandler(response) {
  console.log(response)
}