// action types
const ADD_TO_CART = "ADD_TO_CART"
const REMOVE_FROM_CART = "REMOVE_FROM_CART"
const UPDATE_CART_QUANTITY = "UPDATE_CART_QUANTITY"
const CLEAR_CART = "CLEAR_CART"

// action creators
export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
})

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
})

export const updateCartQuantity = (productId, quantity) => ({
  type: UPDATE_CART_QUANTITY,
  payload: { productId, quantity },
})

export const clearCart = () => ({
  type: CLEAR_CART,
})

// initial state
const initialState = []

// reducer function
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingProduct = state.find((item) => item.id === action.payload.id)
      if (existingProduct) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
      }
      return [...state, { ...action.payload, quantity: 1, total: action.payload.price }]

    case REMOVE_FROM_CART:
      return state.filter((item) => item.id !== action.payload)

    case UPDATE_CART_QUANTITY:
      return state.map((item) =>
        item.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity, total: action.payload.quantity * item.price }
          : item
      )

    case CLEAR_CART:
      return []

    default:
      return state
  }
}

export default cartReducer

