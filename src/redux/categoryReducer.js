// action types
const SET_CATEGORIES = "SET_CATEGORIES"

// action creator
export const setCategories = (categories) => ({
  type: SET_CATEGORIES,
  payload: categories,
})

// initial state
const initialState = []

// reducer function
const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return [...action.payload]
    default:
      return state
  }
}

export default categoryReducer
