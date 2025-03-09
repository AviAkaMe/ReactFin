import { createStore, combineReducers } from "redux"
import userReducer from "./userReducer"
import categoryReducer from "./categoryReducer"
import productReducer from "./productReducer"
import customerReducer from "./customerReducer"
import cartReducer from "./cartReducer"
import orderReducer from "./orderReducer"

const rootReducer = combineReducers({
  user: userReducer,
  categories: categoryReducer,
  products: productReducer,
  customers: customerReducer,
  cart: cartReducer,
  orders: orderReducer,
})

const store = createStore(rootReducer)

export default store
