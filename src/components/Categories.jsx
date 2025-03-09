import React, { useState, useEffect } from "react"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { useDispatch, useSelector } from "react-redux"
import { setCategories } from "../redux/categoryReducer"
import { db } from "../firebaseConfig"

const Categories = () => {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.categories || [])
  const [newCategory, setNewCategory] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, "categories"))
      const categoriesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      dispatch(setCategories(categoriesList))
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [dispatch])

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return
    
    try {
      const docRef = await addDoc(collection(db, "categories"), { name: newCategory })

      dispatch(setCategories([...categories, { id: docRef.id, name: newCategory }]))

      setNewCategory("")
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, "categories", categoryId))

      const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
      dispatch(setCategories(updatedCategories))
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const handleUpdateCategory = async (categoryId, oldName) => {
    const newName = prompt("Enter new category name:", oldName)
    if (!newName || newName.trim() === "") return

    try {
      const categoryRef = doc(db, "categories", categoryId)
      await updateDoc(categoryRef, { name: newName })

      const updatedCategories = categories.map((cat) =>
        cat.id === categoryId ? { ...cat, name: newName } : cat
      )
      dispatch(setCategories(updatedCategories))
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Categories</h2>

      {loading ? <p>Loading categories...</p> : (
        <div style={{ marginBottom: "20px" }}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px auto",
                width: "350px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}>
                <span>{category.name}</span>

                <div>
                  {/* Update Button */}
                  <button onClick={() => handleUpdateCategory(category.id, category.name)}
                    style={{
                      marginRight: "5px",
                      backgroundColor: "#007BFF",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}>
                    Update
                  </button>

                  {/* Delete Button */}
                  <button onClick={() => handleDeleteCategory(category.id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No categories added yet.</p>
          )}
        </div>
      )}

      {/* Add Category */}
      <div>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          style={{ padding: "10px", width: "200px", marginRight: "10px" }}
        />
        <button onClick={handleAddCategory} style={{
          backgroundColor: "green",
          color: "white",
          border: "none",
          padding: "10px 15px",
          cursor: "pointer",
        }}>
          Add
        </button>
      </div>
    </div>
  )
}

export default Categories