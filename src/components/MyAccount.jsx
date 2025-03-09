import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { db, auth } from "../firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { updatePassword } from "firebase/auth"
import { setUser, updateUser } from "../redux/userReducer"

const MyAccount = () => {
  const dispatch = useDispatch()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [allowOrders, setAllowOrders] = useState(false)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const email = auth.currentUser?.email
  const uid = auth.currentUser?.uid

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) {
        console.error("No authenticated user found!")
        setLoading(false)
        return
      }

      try {
        const userRef = doc(db, "users", uid)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const data = userDoc.data()
          setFirstName(data.firstName || "")
          setLastName(data.lastName || "")
          setAllowOrders(data.allowOrders || false)

          dispatch(setUser(data, data.role || ""))
        } else {
          console.warn("No user document found in Firestore.")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }

      setLoading(false)
    }

    fetchUserData()
  }, [dispatch, uid, email])

  const handleSaveChanges = async () => {
    if (!uid) return
    setSaving(true)
    setMessage("")

    try {
      const userRef = doc(db, "users", uid)
      await updateDoc(userRef, {
        firstName,
        lastName,
        allowOrders,
      })

      dispatch(updateUser({ firstName, lastName, allowOrders }))

      if (password.trim() !== "") {
        const user = auth.currentUser
        await updatePassword(user, password)
        setMessage("Changes & Password updated successfully!")
      } else {
        setMessage("Changes saved successfully!")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage("❌ Failed to save changes.")
    }

    setSaving(false)
  }

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
      <div style={{ textAlign: "center", padding: "20px", maxWidth: "400px", width: "100%", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
        <h2>My Account</h2>

        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />

        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />

        <label>User Name (Email):</label>
        <input
          type="email"
          value={email}
          readOnly
          style={{ width: "100%", padding: "8px", margin: "5px 0", backgroundColor: "#f0f0f0" }}
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password (optional)"
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />

        <label>
          <input
            type="checkbox"
            checked={allowOrders}
            onChange={() => setAllowOrders(!allowOrders)}
          />
          Allow others to see my orders
        </label>

        <button
          onClick={handleSaveChanges}
          style={{ width: "100%", padding: "10px", marginTop: "10px", background: "green", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && <p style={{ marginTop: "10px", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
      </div>
    </div>
  )
}

export default MyAccount