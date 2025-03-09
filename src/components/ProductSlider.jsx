import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { db } from "../firebaseConfig"
import { collection, getDocs } from "firebase/firestore"
import { setCategories } from "../redux/categoryReducer"

const ProductSlider = ({ onFilterChange }) => {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.categories || [])

  const [selectedCategory, setSelectedCategory] = useState("")
  const [maxPrice, setMaxPrice] = useState(10000)
  const [title, setTitle] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"))
        const categoryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        dispatch(setCategories(categoryList))
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [dispatch])

  const handleFilterChange = () => {
    onFilterChange({ category: selectedCategory, price: [1, maxPrice], title })
  }

  const handleClearFilters = () => {
    setSelectedCategory("")
    setMaxPrice(10000)
    setTitle("")
    onFilterChange({ category: "", price: [1, 10000], title: "" })
  }

  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "8px",
      width: "100%",
      textAlign: "center",
      marginBottom: "20px",
    }}>

      {/* filters row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        {/* category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ flex: 1, padding: "5px" }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        {/* max price slider */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <label>Max Price: {maxPrice}</label>
          <input
            type="range"
            min="1"
            max="10000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        {/* title search box */}
        <input
          type="text"
          placeholder="Search by title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "5px" }}
        />
      </div>

      {/* buttons row */}
      <div>
        <button
          onClick={handleFilterChange}
          style={{
            backgroundColor: "blue",
            color: "white",
            border: "none",
            padding: "8px",
            cursor: "pointer",
            marginRight: "10px",
          }}>
          Apply
        </button>

        <button
          onClick={handleClearFilters}
          style={{
            backgroundColor: "gray",
            color: "white",
            border: "none",
            padding: "8px",
            cursor: "pointer",
          }}>
          Clear
        </button>
      </div>
    </div>
  )
}

export default ProductSlider