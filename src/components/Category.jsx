import React, { useState, useEffect } from "react";

import api from "../api/axios";

// ======================= Modal Component =======================
const Modal = ({
  title,
  initialData = { name: "", status: "Active", image: "" },
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [preview, setPreview] = useState(`${import.meta.env.VITE_API_BASE_URL}${initialData.image}` || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="border p-2 rounded w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <input
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded mt-2"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================= Main Category Component =======================
const Category = () => {

  const [categories, setCategories] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  

  //  Load categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("api/category");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Create category
  const handleCreate = async (data) => {
    try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("status", data.status === "Active" ? 1 : 0);
        if (data.image) formData.append("image", data.image);

        await api.post("api/category", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        setCreateModalOpen(false);
        fetchCategories();
        } catch (error) {
        console.error("Error creating category:", error);
    }
  };

  // Update category
  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("status", data.status === "Active" ? 1 : 0);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await api.post(`api/category/${currentCategory.id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`api/category/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Category</h1>
        <button
          className="px-4 py-1 bg-[#45AEF1] text-white rounded-md hover:bg-[#3791d5]"
          onClick={() => setCreateModalOpen(true)}
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300">ID</th>
              <th className="p-2 border border-gray-300">Image</th>
              <th className="p-2 border border-gray-300">Name</th>
              <th className="p-2 border border-gray-300">Status</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300">{cat.id}</td>
                <td className="p-2 border border-gray-300">
                  {cat.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${cat.image}`}
                      alt={cat.name}
                      className="w-12 h-12 object-cover rounded mx-auto"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="p-2 border border-gray-300">{cat.name}</td>
                <td className="p-2 border border-gray-300">
                  {cat.status === 1 ? "Active" : "Inactive"}
                </td>
                <td className="p-2 border border-gray-300 flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => {
                      setCurrentCategory({
                        ...cat,
                        status: cat.status === 1 ? "Active" : "Inactive",
                      });
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {createModalOpen && (
        <Modal
          title="Create Category"
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreate}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && currentCategory && (
        <Modal
          title="Edit Category"
          initialData={currentCategory}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default Category;
