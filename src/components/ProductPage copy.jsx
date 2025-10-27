import React, { useState } from "react";
import ProductList from "./ProductList";
import EditProduct from "./EditProduct";

const ProductPage = () => {
const [products, setProducts] = useState([
    { id: 1, name: "Minimal Leather Bag", sku: "LB-001", price: 79.0, stock: 12, category: "Bags", img: "https://picsum.photos/200?1" },
    { id: 2, name: "Running Sneakers", sku: "SN-532", price: 129.99, stock: 5, category: "Shoes", img: "https://picsum.photos/200?2" },
    { id: 3, name: "Classic Watch", sku: "WT-110", price: 199.0, stock: 0, category: "Accessories", img: "https://picsum.photos/200?3" },
    { id: 4, name: "Denim Jacket", sku: "JK-220", price: 99.5, stock: 21, category: "Clothing", img: "https://picsum.photos/200?4" },
    { id: 5, name: "Bluetooth Speaker", sku: "SP-75", price: 59.99, stock: 8, category: "Electronics", img: "https://picsum.photos/200?5" },
    { id: 6, name: "Sunglasses", sku: "SG-12", price: 25.0, stock: 40, category: "Accessories", img: "https://picsum.photos/200?6" },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  const handleUpdate = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {!editingProduct ? (
        <ProductList products={products} onEdit={handleEdit} />
      ) : (
        <div>
          <button
            onClick={handleCancel}
            className="mb-4 px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            ← Back to List
          </button>
          <EditProduct existingProduct={editingProduct} onSave={handleUpdate} />
        </div>
      )}
    </div>
  );
};

export default ProductPage;
