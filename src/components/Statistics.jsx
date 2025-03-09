import React, { useEffect, useState } from "react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
import { useDispatch, useSelector } from "react-redux"
import { db } from "../firebaseConfig"
import { collection, getDocs } from "firebase/firestore"
import { setOrders } from "../redux/orderReducer"
import { setCustomers } from "../redux/customerReducer"

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Statistics = () => {
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.orders)
  const customers = useSelector((state) => state.customers)
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "orders"))
        const ordersList = querySnapshot.docs.flatMap(doc => doc.data().orders.map(order => ({
          ...order,
          customerId: doc.id // store the user ID as part of each order
        })))
        dispatch(setOrders(ordersList))
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
      setLoading(false)
    };

    fetchOrders()
  }, [dispatch])

  // fetch customers (no admins)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"))
        const usersList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.role !== "admin")
        dispatch(setCustomers(usersList))
      } catch (error) {
        console.error("Error fetching customers:", error)
      }
    };

    fetchCustomers()
  }, [dispatch])

  // prepare pie data
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productSales[item.title] = (productSales[item.title] || 0) + item.quantity;
    });
  });

  const pieChartData = {
    labels: Object.keys(productSales),
    datasets: [{
      label: "Total Sold",
      data: Object.values(productSales),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
    }]
  }

  // prepare bar data
  const filteredOrders = selectedCustomer 
    ? orders.filter(order => order.customerId === selectedCustomer)
    : [];

  const customerPurchases = {}
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      customerPurchases[item.title] = (customerPurchases[item.title] || 0) + item.quantity
    })
  })

  const barChartData = {
    labels: Object.keys(customerPurchases),
    datasets: [{
      label: `Products Bought by ${customers.find(c => c.id === selectedCustomer)?.firstName || "User"}`,
      data: Object.values(customerPurchases),
      backgroundColor: "#36A2EB"
    }]
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h3>Statistics Page</h3>

      {loading ? <p>Loading data...</p> : (
        <>
          {/* pie chart */}
          <h4>Total Sold Products</h4>
          <Pie data={pieChartData} />

          {/* dropdown to Select customer */}
          <h4>Product Quantity per Customer</h4>
          <select onChange={(e) => setSelectedCustomer(e.target.value)} value={selectedCustomer}>
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </select>

          {/* bar chart */}
          {selectedCustomer && Object.keys(customerPurchases).length > 0 ? (
            <Bar data={barChartData} />
          ) : selectedCustomer ? (
            <p>No purchases found for this customer.</p>
          ) : (
            <p>Select a customer to view their purchases.</p>
          )}
        </>
      )}
    </div>
  )
}

export default Statistics
