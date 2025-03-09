import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { logoutUser } from "../redux/userReducer"
import { auth } from "../firebaseConfig"
import { useNavigate } from "react-router-dom"
import Categories from "./Categories"
import Products from "./Products"
import Customers from "./Customers"
import Statistics from "./Statistics"

const AdminWelcome = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState("categories")

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
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      minHeight: "100vh",
      width: "100vw",
      paddingTop: "20px",
      overflowY: "auto",
    }}>
      <div style={{ width: "50%", minWidth: "400px" }}>
        <h2>Welcome, Admin!</h2>

        {/* logout button */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
            width: "100%",
            borderRadius: "5px"
          }}>
          Logout
        </button>

        {/* admin navigation */}
        <nav style={{ marginTop: "20px" }}>
          <button onClick={() => setActivePage("categories")} style={{ margin: "5px" }}>Categories</button>
          <button onClick={() => setActivePage("products")} style={{ margin: "5px" }}>Products</button>
          <button onClick={() => setActivePage("customers")} style={{ margin: "5px" }}>Customers</button>
          <button onClick={() => setActivePage("statistics")} style={{ margin: "5px" }}>Statistics</button>
        </nav>

        {/* page content */}
        <div style={{ marginTop: "20px" }}>
          {activePage === "categories" && <Categories />}
          {activePage === "products" && <Products />}
          {activePage === "customers" && <Customers />}
          {activePage === "statistics" && <Statistics />}
        </div>
      </div>
    </div>
  )
}

export default AdminWelcome