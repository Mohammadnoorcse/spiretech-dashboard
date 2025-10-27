import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import EditProduct from "./EditProduct";
import api from "../api/axios";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => setEditingProduct(product);
  const handleCancel = () => setEditingProduct(null);

  const handleUpdate = async (formData, productId) => {
    if (!productId) return console.error("Product ID missing!");

    try {
      const res = await api.post(`/api/products/${productId}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === res.data.id ? res.data : p))
      );
      setEditingProduct(null);
      alert("✅ Product updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Failed to update product!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Product deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete product!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {!editingProduct ? (
        <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <div>
          <button
            onClick={handleCancel}
            className="mb-4 px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            ← Back to List
          </button>
          <EditProduct
            existingProduct={editingProduct}
            productId={editingProduct.id}
            onSave={handleUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPage;
