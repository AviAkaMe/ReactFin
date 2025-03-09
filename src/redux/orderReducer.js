// action types
const SET_ORDERS = "SET_ORDERS"

// action creator
export const setOrders = (orders) => ({
  type: SET_ORDERS,
  payload: orders,
})

// initial state
const initialState = []

// reducer function
const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return [...action.payload]
    default:
      return state
  }
};

export default orderReducer