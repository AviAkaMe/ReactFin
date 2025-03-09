import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { logoutUser } from "../redux/userReducer"
import { auth } from "../firebaseConfig"
import { useNavigate } from "react-router-dom"
import ProductsCustomer from "./ProductsCustomer"
import MyOrders from "./MyOrders"
import MyAccount from "./MyAccount"

const UserWelcome = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState("products") // default to products

  const handleLogout = async () => {
    try {
      await auth.signOut()
      dispatch(logoutUser())
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div 
      style={{ 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        textAlign: "center", 
        minHeight: "100vh",
        width: "100vw",
        paddingTop: "20px",
        overflowY: "auto",
      }}
    >
      <div style={{ width: "50%", minWidth: "400px" }}>
        <h2>Hello User!</h2>
        <button 
          onClick={handleLogout} 
          style={{ 
            marginTop: "10px", 
            padding: "10px", 
            background: "red", 
            color: "white", 
            border: "none", 
            cursor: "pointer" 
          }}
        >
          Logout
        </button>
        
        {/* navigation menu */}
        <nav style={{ marginTop: "20px" }}>
          <button onClick={() => setActivePage("products")} style={{ margin: "5px" }}>Products</button>
          <button onClick={() => setActivePage("orders")} style={{ margin: "5px" }}>My Orders</button>
          <button onClick={() => setActivePage("account")} style={{ margin: "5px" }}>My Account</button>
        </nav>
        
        {/* page content */}
        <div style={{ marginTop: "20px", width: "100%", maxWidth: "800px" }}>
          {activePage === "products" && <ProductsCustomer />}
          {activePage === "orders" && <MyOrders />}
          {activePage === "account" && <MyAccount />}
        </div>
      </div>
    </div>
  )
}

export default UserWelcome