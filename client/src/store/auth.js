import axios from 'axios';
import history from '../data/history';

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const SET_AUTH = 'SET_AUTH'

/**
 * ACTION CREATORS
 */
const setAuth = auth => ({type: SET_AUTH, auth})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  const token = window.localStorage.getItem(TOKEN)
  if (token) {
    const res = await axios.get('/auth/me', {
      headers: {
        authorization: token
      }
    })
    return dispatch(setAuth(res.data))
  }
}

export const authenticate = (username, password, method) => async dispatch => {
  try {
    const res = await axios.post(`/auth/${method}`, {username, password})
    window.localStorage.setItem(TOKEN, res.data.token)
    dispatch(me())
  } catch (authError) {
    return dispatch(setAuth({error: authError}))
  }
}



export const updateHighScore = async (score) => {
  const token = window.localStorage.getItem(TOKEN)
  let user = '';
  if (token) {
    user = await axios.get('/auth/me', {
      headers: {
        authorization: token
      }
    })
  }
  const userId = user.data.id;
  return await axios.post('/auth/highscore', {
      score,
      userId
    });
 }

 export const fetchHighScore = async () => {
  const token = window.localStorage.getItem(TOKEN)
  let user = '';
  if (token) {
    user = await axios.get('/auth/me', {
      headers: {
        authorization: token
      }
    })
  }
  return user.data.highscore;
 }

export const logout = () => {
  window.localStorage.removeItem(TOKEN)
  history.push('/login')
  return {
    type: SET_AUTH,
    auth: {}
  }
}

/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth
    default:
      return state
  }
}
