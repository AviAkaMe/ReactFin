import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { db } from "../firebaseConfig"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { setProducts, addProduct, deleteProduct, updateProduct } from "../redux/productReducer"
import { setCategories } from "../redux/categoryReducer"

const Products = () => {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products || [])
  const categories = useSelector((state) => state.categories || [])

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    category: "",
    imageUrl: "",
    description: "",
    inStock: 0,
    boughtBy: [],
  })

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"))
      const categoryList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setCategories(categoryList))
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

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

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [dispatch])

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category) return

    try {
      const docRef = await addDoc(collection(db, "products"), newProduct)
      dispatch(addProduct({ id: docRef.id, ...newProduct }))
      setNewProduct({ title: "", price: "", category: "", imageUrl: "", description: "", inStock: 0, boughtBy: [] })
      setShowForm(false)
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      const productRef = doc(db, "products", editingProduct.id)
      await updateDoc(productRef, editingProduct);

      dispatch(updateProduct(editingProduct.id, editingProduct))
      setEditingProduct(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId))
      dispatch(deleteProduct(productId))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "20px", width: "100%" }}>
      <h2>Products</h2>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{ marginBottom: "10px", padding: "10px", background: "green", color: "white", border: "none", cursor: "pointer" }}>
            Add Product
          </button>
        )}

        {showForm && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
            width: "400px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            <h3>{editingProduct ? "Update Product" : "Add a New Product"}</h3>
            <input
              type="text"
              placeholder="Title"
              value={editingProduct ? editingProduct.title : newProduct.title}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, title: e.target.value })
                  : setNewProduct({ ...newProduct, title: e.target.value })
              }
              style={{ marginBottom: "5px", width: "100%" }}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                  : setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
              style={{ marginBottom: "5px", width: "100%" }}
            />
            <textarea
              placeholder="Description"
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, description: e.target.value })
                  : setNewProduct({ ...newProduct, description: e.target.value })
              }
              style={{ marginBottom: "5px", width: "100%", height: "60px" }}
            />
            <input
              type="number"
              placeholder="Price"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, price: e.target.value })
                  : setNewProduct({ ...newProduct, price: e.target.value })
              }
              style={{ marginBottom: "5px", width: "100%" }}
            />
            <input
              type="number"
              placeholder="In Stock"
              value={editingProduct ? editingProduct.inStock : newProduct.inStock}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, inStock: Number(e.target.value) })
                  : setNewProduct({ ...newProduct, inStock: Number(e.target.value) })
              }
              style={{ marginBottom: "5px", width: "100%" }}
            />
            <select
              value={editingProduct ? editingProduct.category : newProduct.category}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, category: e.target.value })
                  : setNewProduct({ ...newProduct, category: e.target.value })
              }
              style={{ marginBottom: "5px", width: "100%" }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <button
              onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
              style={{ marginTop: "10px", padding: "10px", background: "blue", color: "white", border: "none", cursor: "pointer", width: "100%" }}>
              {editingProduct ? "Update Product" : "Save Product"}
            </button>
          </div>
        )}

        {/* Display products */}
        {products.map((product) => (
          <div key={product.id} style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px auto",
            width: "400px",
            borderRadius: "8px"
          }}>
            <h4>{product.title} - ${product.price}</h4>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>In Stock:</strong> {product.inStock}</p>

            {/* Bought By Table */}
            <h5 style={{ marginTop: "10px" }}>Bought By:</h5>
            {product.boughtBy && product.boughtBy.length > 0 ? (
              <table style={{ width: "100%", marginTop: "10px", border: "1px solid black", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#e4e4e4" }}>
                    <th style={{ padding: "5px" }}>Name</th>
                    <th style={{ padding: "5px" }}>Qty</th>
                    <th style={{ padding: "5px" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {product.boughtBy
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort orders by date (newest first)
                    .map((buyer, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: "5px" }}>{buyer.name}</td>
                        <td style={{ padding: "5px" }}>{buyer.quantity}</td>
                        <td style={{ padding: "5px" }}>{new Date(buyer.date).toLocaleDateString("en-GB")}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No purchases yet.</p>
            )}

            <img src={product.imageUrl} alt={product.title} style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }} />
            <p>{product.description}</p>

            <button onClick={() => {
              setEditingProduct(product)
              setShowForm(true)
            }}
              style={{ backgroundColor: "orange", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
              Update
            </button>


            <button onClick={() => handleDeleteProduct(product.id)} style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", marginLeft: "5px" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
