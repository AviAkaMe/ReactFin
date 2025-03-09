import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { db } from "../firebaseConfig"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { setCustomers } from "../redux/customerReducer"

const Customers = () => {
  const dispatch = useDispatch()
  const customers = useSelector((state) => state.customers)
  const [expandedRows, setExpandedRows] = useState({})
  const [customerOrders, setCustomerOrders] = useState({})

  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"))
      const allUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      const customersList = allUsers.filter((user) => user.role === "user")

      customersList.forEach((customer) => {
        if (customer.joinedAt?.toDate) {
          customer.joinedAt = customer.joinedAt.toDate().toISOString()
        }
      })

      dispatch(setCustomers(customersList))
    } catch (error) {
      console.error("Error fetching customers:", error)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [dispatch])

  const fetchOrdersForUser = async (customerId) => {
    try {
      const userOrdersRef = doc(db, "orders", customerId)
      const docSnap = await getDoc(userOrdersRef)

      if (docSnap.exists()) {
        setCustomerOrders((prev) => ({
          ...prev,
          [customerId]: docSnap.data().orders || [],
        }))
      } else {
        setCustomerOrders((prev) => ({
          ...prev,
          [customerId]: [],
        }))
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const toggleRow = (customerId) => {
    setExpandedRows((prev) => {
      const isExpanded = !prev[customerId]

      if (isExpanded && !customerOrders[customerId]) {
        fetchOrdersForUser(customerId)
      }

      return {
        ...prev,
        [customerId]: isExpanded,
      }
    })
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Customers</h2>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table
          style={{
            width: "90%",
            margin: "20px auto",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ background: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "10px" }}>Full Name</th>
              <th style={{ padding: "10px" }}>Joined At</th>
              <th style={{ padding: "10px" }}>Products Bought</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <React.Fragment key={customer.id}>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {customer.joinedAt
                      ? new Date(customer.joinedAt).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => toggleRow(customer.id)}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        background: expandedRows[customer.id] ? "red" : "blue",
                        color: "white",
                        border: "none",
                      }}
                    >
                      {expandedRows[customer.id] ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {/* Nested Orders Table for Each User */}
                {expandedRows[customer.id] && (
                  <tr>
                    <td colSpan="3">
                      {customerOrders[customer.id] ? (
                        customerOrders[customer.id].length > 0 ? (
                          <table
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                              background: "#f9f9f9",
                            }}
                          >
                            <thead>
                              <tr style={{ background: "#e4e4e4" }}>
                                <th style={{ padding: "5px" }}>Product</th>
                                <th style={{ padding: "5px" }}>Quantity</th>
                                <th style={{ padding: "5px" }}>Total Price</th>
                                <th style={{ padding: "5px" }}>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {customerOrders[customer.id].map((order, index) =>
                                order.items.map((item, itemIndex) => (
                                  <tr key={`${index}-${itemIndex}`} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td style={{ padding: "5px" }}>{item.title}</td>
                                    <td style={{ padding: "5px" }}>{item.quantity}</td>
                                    <td style={{ padding: "5px" }}>${item.totalPrice.toFixed(2)}</td>
                                    <td style={{ padding: "5px" }}>
                                      {new Date(item.date).toLocaleDateString("en-GB")}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        ) : (
                          <p>No purchases yet.</p>
                        )
                      ) : (
                        <p>Loading purchases...</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Customers
