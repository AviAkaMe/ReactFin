import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebaseConfig"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

const Signup = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [allowOrdersVisibility, setAllowOrdersVisibility] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        allowOrdersVisibility,
        role: isAdmin ? "admin" : "user",
        joinedAt: serverTimestamp(),
      })
      
      navigate("/welcome")
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", width: "100vw" }}>
      <div style={{ padding: "2rem", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", textAlign: "center", width: "400px" }}>
        <h2>New User Registration</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {/* signup form */}
        <form onSubmit={handleSignup}>
          <label>First Name</label>
          <input type="text" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />
          <label>Last Name</label>
          <input type="text" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />
          <label>User Name</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />
          <div style={{ textAlign: "left", margin: "5px 0" }}>
            <input type="checkbox" checked={allowOrdersVisibility} onChange={(e) => setAllowOrdersVisibility(e.target.checked)} />
            <label style={{ marginLeft: "5px" }}>Allow others to see my orders</label>
          </div>
          <button type="submit" style={{ width: "100%", padding: "10px", marginTop: "10px", background: "#007BFF", color: "white", border: "none", cursor: "pointer" }}>Create</button>
        </form>
        
        {/* login link */}
        <p style={{ marginTop: "10px" }}>Already have an account? <Link to="/">Login</Link></p>
      </div>

      {/* admin checkbox outside the box for testing */}
      <div style={{ marginTop: "10px" }}>
        <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
        <label style={{ marginLeft: "5px" }}>Create as Admin (For Testing)</label>
      </div>
    </div>
  )
}

export default Signup