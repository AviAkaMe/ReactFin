import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../redux/userReducer"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebaseConfig"
import { doc, getDoc } from "firebase/firestore"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const role = userDoc.data().role

        dispatch(setUser(user, role))

        navigate("/welcome")
      } else {
        setError("No user data found")
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
      <div style={{ padding: "2rem", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", textAlign: "center", width: "400px" }}>
        <h2 style={{ whiteSpace: "nowrap" }}>Next Generation E-Commerce</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <label>User Name</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: "100%", padding: "8px", margin: "5px 0" }} 
          />
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: "100%", padding: "8px", margin: "5px 0" }} 
          />
          <button 
            type="submit" 
            style={{ width: "100%", padding: "10px", marginTop: "10px", background: "#007BFF", color: "white", border: "none", cursor: "pointer" }}>
            Login
          </button>
        </form>
        
        {/* Signup Link */}
        <p style={{ marginTop: "10px" }}>New user? <Link to="/signup">Register</Link></p>
      </div>
    </div>
  )
}

export default Login