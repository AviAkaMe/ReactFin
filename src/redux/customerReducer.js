// action types
const SET_CUSTOMERS = "SET_CUSTOMERS"

// action creator
export const setCustomers = (customers) => ({
  type: SET_CUSTOMERS,
  payload: customers,
})

// initial state
const initialState = []

// reducer function
const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CUSTOMERS:
      return [...action.payload]
    default:
      return state
  }
}

export default customerReducer