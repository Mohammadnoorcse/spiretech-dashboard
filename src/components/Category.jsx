import React, { useState } from "react";

// Modal Component
const Modal = ({ title, initialData = { name: "", status: "Active", image: "" }, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
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
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <input type="file" onChange={handleImageChange} className="border p-2 rounded w-full" />
          {formData.image && (
            <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover rounded mt-2" />
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => onSave(formData)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Category Component
const Category = () => {

  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", status: "Active", image: "" },
    { id: 2, name: "Fashion", status: "Inactive", image: "" },
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Category</h1>
        <button className="px-4 py-1 bg-[#45AEF1] text-white rounded-md hover:bg-[#3791d5]" onClick={() => setCreateModalOpen(true)}>
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
                    <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded mx-auto" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="p-2 border border-gray-300">{cat.name}</td>
                <td className="p-2 border border-gray-300">{cat.status}</td>
                <td className="p-2 border border-gray-300 flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => {
                      setCurrentCategory(cat);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => setCategories(categories.filter((c) => c.id !== cat.id))}
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
          onSave={(data) => {
            setCategories([...categories, { id: categories.length + 1, ...data }]);
            setCreateModalOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && currentCategory && (
        <Modal
          title="Edit Category"
          initialData={currentCategory}
          onClose={() => setEditModalOpen(false)}
          onSave={(data) => {
            setCategories(categories.map((c) => (c.id === currentCategory.id ? { ...c, ...data } : c)));
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Category;
