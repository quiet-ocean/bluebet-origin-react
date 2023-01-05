import {
  getAuthUser,
  testAuth,
  exchangeAuthTokens,
} from "../services/api.service";
import { authenticateSockets } from "../services/websocket.service";
import setAuthToken from "../utils/setAuthToken";
import {
  USER_LOADED,
  WALLET_CHANGE,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  RELOADING_USER,
} from "./types";

// Load user from API
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  console.log("[AUTH] Authenticating user...");

  try {
    const response = await getAuthUser();

    // If auth was successfull, authenticate websockets with the token given
    authenticateSockets(response.token);

    dispatch({
      type: USER_LOADED,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Reload User, don't authenticate sockets
export const reloadUser = () => async dispatch => {
  console.log("[AUTH] Reloading user...");
  dispatch({
    type: RELOADING_USER,
  });

  try {
    const response = await getAuthUser();

    dispatch({
      type: USER_LOADED,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Change wallet amount
export const changeWallet = ({ amount }) => async dispatch => {
  dispatch({
    type: WALLET_CHANGE,
    payload: amount,
  });
};

// Exchange identifier token to auth token
export const exchangeTokens = ({ idToken }) => async dispatch => {
  try {
    const response = await exchangeAuthTokens(idToken);
    dispatch(login({ token: response.token }));
  } catch (error) {
    console.log(error);
    // const apiError = error.response ? error.response.data.error : null;
    // if (apiError) {
    //   dispatch(setAlert(apiError, "Error"));
    // }
    // dispatch({ type: LOGIN_FAIL });
  }
};

// Login User
export const login = ({ token }) => async dispatch => {
  setAuthToken(token);
  try {
    const response = await testAuth();
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: response.data, token },
    });
    dispatch(loadUser());
  } catch (error) {
    console.log(error);
    // const apiError = error.response ? error.response.data.error : null;
    // if (apiError) {
    //   dispatch(setAlert(apiError, "Error"));
    // }
    dispatch({ type: LOGIN_FAIL });
  }
};

// Logout user
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};
