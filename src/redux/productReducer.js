// action types
const SET_PRODUCTS = "SET_PRODUCTS"
const ADD_PRODUCT = "ADD_PRODUCT"
const UPDATE_PRODUCT = "UPDATE_PRODUCT"
const DELETE_PRODUCT = "DELETE_PRODUCT"

// action creators
export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products,
})

export const addProduct = (product) => ({
  type: ADD_PRODUCT,
  payload: product,
})

export const updateProduct = (productId, updatedData) => ({
  type: UPDATE_PRODUCT,
  payload: { productId, updatedData },
})

export const deleteProduct = (productId) => ({
  type: DELETE_PRODUCT,
  payload: productId,
})

// initial state
const initialState = []

// reducer function
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return [...action.payload]

    case ADD_PRODUCT:
      return [...state, action.payload]

    case UPDATE_PRODUCT:
      return state.map((product) =>
        product.id === action.payload.productId
          ? { ...product, ...action.payload.updatedData }
          : product
      )

    case DELETE_PRODUCT:
      return state.filter((product) => product.id !== action.payload)

    default:
      return state
  }
}

export default productReducer

