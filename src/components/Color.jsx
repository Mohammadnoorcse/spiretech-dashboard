import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";
// Modal for Color
const ColorModal = ({ title, initialData = { name: "", price: "" }, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Color Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="border p-2 rounded w-full"
          />
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

// Main Color Component
const Color = () => {
  const [colors, setColors] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/color"; // Laravel API

  // Fetch colors from API
  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const res = await api.get('/api/color');
      setColors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create color
  const handleCreate = async (data) => {
    try {
      await api.post('/api/color', data);
      setCreateModalOpen(false);
      fetchColors();
    } catch (err) {
      console.error(err);
    }
  };

  // Update color
  const handleUpdate = async (data) => {
    try {
      await api.put(`/api/color/${currentColor.id}`, data);
      setEditModalOpen(false);
      fetchColors();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete color
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this color?")) return;
    try {
      await api.delete(`/api/color/${id}`);
      fetchColors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Color</h1>
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
              <th className="p-2 border border-gray-300">Color Name</th>
              <th className="p-2 border border-gray-300">Price</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color.id} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300">{color.id}</td>
                <td className="p-2 border border-gray-300">{color.name}</td>
                <td className="p-2 border border-gray-300">{color.price}</td>
                <td className="p-2 border border-gray-300 flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => {
                      setCurrentColor(color);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(color.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {createModalOpen && <ColorModal title="Create Color" onClose={() => setCreateModalOpen(false)} onSave={handleCreate} />}
      {editModalOpen && currentColor && <ColorModal title="Edit Color" initialData={currentColor} onClose={() => setEditModalOpen(false)} onSave={handleUpdate} />}
    </div>
  );
};

export default Color;
