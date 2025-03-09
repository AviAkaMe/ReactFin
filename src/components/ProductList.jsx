import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { db } from "../firebaseConfig"
import { collection, getDocs } from "firebase/firestore"
import { setProducts } from "../redux/productReducer"
import { addToCart } from "../redux/cartReducer"

const ProductList = ({ filters }) => {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products || [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"))
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        dispatch(setProducts(productList))
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [dispatch])

  // apply filters to the product list
  const filteredProducts = products.filter((product) => {
    const matchesCategory = filters.category ? product.category === filters.category : true
    const matchesPrice = product.price >= 1 && product.price <= filters.price[1]
    const matchesTitle = filters.title ? product.title.toLowerCase().includes(filters.title.toLowerCase()) : true
    return matchesCategory && matchesPrice && matchesTitle
  })

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      ...product,
      quantity: 1, // just add 1 at a time
      total: product.price,
    }))
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px", width: "100%" }}>
      <h3>Available Products</h3>
      {filteredProducts.length === 0 ? (
        <p>No matching products found.</p>
      ) : (
        filteredProducts.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px auto", width: "80%", borderRadius: "8px" }}>
            <h4>{product.title} - ${product.price}</h4>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>In Stock:</strong> {product.inStock}</p>
            <img src={product.imageUrl} alt={product.title} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            <p>{product.description}</p>

            {/* add to cart button (disabled if no stock) */}
            {product.inStock > 0 ? (
              <button onClick={() => handleAddToCart(product)} style={{ padding: "10px", background: "blue", color: "white", border: "none", cursor: "pointer" }}>
                Add to Cart
              </button>
            ) : (
              <button disabled style={{ padding: "10px", background: "gray", color: "white", border: "none", cursor: "not-allowed" }}>
                Out of Stock
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default ProductList