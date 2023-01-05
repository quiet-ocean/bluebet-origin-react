import {
  USER_LOADED,
  RELOADING_USER,
  WALLET_CHANGE,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/types";
import cutDecimalPoints from "../utils/cutDecimalPoints";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: true,
  user: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: payload.user,
      };
    case RELOADING_USER:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: true,
        // user: null
      };
    case WALLET_CHANGE:
      return {
        ...state,
        user: {
          ...state.user,
          wallet:
            state.user.wallet + payload < 0
              ? 0
              : parseFloat(cutDecimalPoints(state.user.wallet + payload)),
          wager:
            payload < 0
              ? state.user.wager + Math.abs(payload)
              : state.user.wager,
        },
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        isLoading: true,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};
