import React, { useEffect, useState } from "react"
import { auth, db } from "../firebaseConfig"
import { doc, getDoc } from "firebase/firestore"

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const user = auth.currentUser
        if (!user || !user.uid) {
          console.error("No authenticated user found!")
          setLoading(false)
          return;
        }

        const userId = user.uid;

        const userOrdersRef = doc(db, "orders", userId)
        const docSnap = await getDoc(userOrdersRef)

        if (docSnap.exists()) {
          setOrders(docSnap.data().orders || [])
        } else {
          console.warn("No orders found in Firestore!")
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
      setLoading(false)
    };

    fetchOrders()
  }, [])

  return (
    <div style={{ textAlign: "center", padding: "20px", width: "100%" }}>
      <h3>My Orders</h3>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={{ width: "80%", margin: "20px auto", borderCollapse: "collapse", border: "1px solid #ccc", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "10px" }}>Title</th>
              <th style={{ padding: "10px" }}>Quantity</th>
              <th style={{ padding: "10px" }}>Total Price</th>
              <th style={{ padding: "10px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) =>
              order.items.map((item, itemIndex) => (
                <tr key={`${index}-${itemIndex}`} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{item.title}</td>
                  <td style={{ padding: "10px" }}>{item.quantity}</td>
                  <td style={{ padding: "10px" }}>${item.totalPrice.toFixed(2)}</td>
                  <td style={{ padding: "10px" }}>{new Date(item.date).toLocaleDateString("en-GB")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default MyOrders
