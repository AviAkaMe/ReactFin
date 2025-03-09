// action types
const SET_USER = "SET_USER"
const UPDATE_USER = "UPDATE_USER"
const LOGOUT_USER = "LOGOUT_USER"

// action creators
export const setUser = (user, role) => ({
  type: SET_USER,
  payload: { 
    user: user ? { uid: user.uid, email: user.email } : null,
    role: role || "",
  },
})

export const logoutUser = () => ({
  type: LOGOUT_USER,
})

export const updateUser = (updatedData) => ({
  type: UPDATE_USER,
  payload: updatedData,
})

// initial state
const initialState = {
  user: null,
  role: "",
}

// reducer function
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role || "",
      }

    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }

    case LOGOUT_USER:
      return initialState

    default:
      return state
  }
}

export default userReducer