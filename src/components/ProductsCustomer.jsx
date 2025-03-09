import React, { useState } from "react"
import CartSection from "./CartSection"
import ProductSlider from "./ProductSlider"
import ProductList from "./ProductList"

const ProductsCustomer = () => {
  const [filters, setFilters] = useState({ category: "", price: [1, 10000], title: "" })

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%" }}>
      <h2>Products</h2>

      <div style={{ display: "flex", justifyContent: "space-between", width: "90%", gap: "20px" }}>
        {/* Left Side: Cart Section */}
        <div style={{ width: "30%" }}>
          <CartSection />
        </div>

        {/* Right Side: Slider & Products */}
        <div style={{ width: "65%" }}>
          <ProductSlider onFilterChange={setFilters} />
          <ProductList filters={filters} />
        </div>
      </div>
    </div>
  )
}

export default ProductsCustomer