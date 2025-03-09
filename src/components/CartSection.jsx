import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { db, auth } from "../firebaseConfig"
import { arrayUnion, doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { clearCart, updateCartQuantity, removeFromCart } from "../redux/cartReducer"
import { updateProduct } from "../redux/productReducer"

const CartSection = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart || [])
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleQuantityChange = (productId, newQuantity, inStock) => {
    if (newQuantity < 1 || newQuantity > inStock) return
    dispatch(updateCartQuantity(productId, newQuantity))
  }

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const handleOrderNow = async () => {
    if (!cartItems || cartItems.length === 0) {
      console.error("Cannot place order: Cart is empty.")
      return
    }

    try {
      const currentUser = auth.currentUser
      if (!currentUser || !currentUser.uid) {
        console.error("Error: No authenticated user found!");
        return
      }

      const userId = currentUser.uid
      const userRef = doc(db, "users", userId)
      const userSnap = await getDoc(userRef)

      let userName = "Anonymous"
      if (userSnap.exists()) {
        const userData = userSnap.data()
        userName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
      } else {
        console.warn(`No Firestore user document found for UID: ${userId}`)
      }

      const orderData = {
        title: "Order",
        items: cartItems.map((item) => ({
          productId: item.id,
          title: item.title || "Unknown Item",
          quantity: item.quantity || 1,
          totalPrice: item.price * (item.quantity || 1),
          date: new Date().toISOString(),
        })),
      }

      const userOrdersRef = doc(db, "orders", userId)

      await setDoc(
        userOrdersRef,
        { orders: arrayUnion(orderData) },
        { merge: true }
      )

      for (const item of cartItems) {
        const productRef = doc(db, "products", item.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data()
          const currentStock = productData.inStock || 0
          const newStock = Math.max(0, currentStock - item.quantity)

          await updateDoc(productRef, {
            inStock: newStock,
            boughtBy: arrayUnion({
              name: userName,
              quantity: item.quantity,
              date: new Date().toISOString(),
            }),
          })

          dispatch(updateProduct(item.id, { inStock: newStock }))
        } else {
          console.warn(`Product ${item.title} not found in Firestore!`)
        }
      }

      dispatch(clearCart())
    } catch (error) {
      console.error("Error placing order:", error)
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", width: "100%" }}>
      <h3>My Cart</h3>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
              <h4>{item.name}</h4>
              <p>Price: ${item.price}</p>
              <p>In Stock: {item.inStock}</p>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.inStock)}
                  disabled={item.quantity <= 1}
                  style={{ padding: "5px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.inStock)}
                  disabled={item.quantity >= item.inStock}
                  style={{ padding: "5px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
                >
                  +
                </button>
              </div>
              <p>Total: ${item.price * item.quantity}</p>
              <button
                onClick={() => handleRemoveItem(item.id)}
                style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", marginTop: "5px" }}
              >
                Remove
              </button>
            </div>
          ))}

          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
          <button
            onClick={handleOrderNow}
            style={{
              padding: "10px",
              background: "blue",
              color: "white",
              border: "none",
              cursor: "pointer",
              width: "100%",
              marginTop: "10px",
            }}
          >
            Order Now
          </button>
        </>
      )}
    </div>
  )
}

export default CartSection
