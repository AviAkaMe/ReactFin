import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AdminWelcome from "./AdminWelcome"
import UserWelcome from "./UserWelcome"

const Welcome = () => {
  const { user, role } = useSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/") // redirect to login if not authenticated
    }
  }, [user, navigate])

  if (!role) return <p>Loading...</p>

  return role === "admin" ? <AdminWelcome /> : <UserWelcome />
}

export default Welcome