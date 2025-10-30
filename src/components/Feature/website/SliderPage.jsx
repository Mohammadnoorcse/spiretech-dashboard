import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
// Modal component
const SliderModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({ image: "", status: "active" });

  React.useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ image: "", status: "active" });
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, image: file });
  };

  const handleSaveClick = () => {
    const formData = new FormData();

    // Only append image if it's a File
    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    // Always send status
    formData.append("status", form.status);

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Slider Form</h2>
        <div className="mb-4">
          <label className="text-sm block mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 text-sm rounded w-full"
          />

          {form.image && (
            <div className="flex items-center gap-3 mt-2">
              <img
              src={
                form.image instanceof File
                  ? URL.createObjectURL(form.image) 
                  : `${import.meta.env.VITE_API_BASE_URL}/${form.image}` 
              }
              alt="preview"
              className="w-24 h-20 object-cover rounded border"
            />
              <div>
                <p className="text-sm font-medium">Preview</p>
                <p className="text-xs text-gray-500">
                  {form.image instanceof File
                    ? form.image.name
                    : "Existing Image"}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main page
const SliderPage = () => {
  const [sliders, setSliders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);

  // Fetch sliders from API
  const fetchSliders = async () => {
    try {
      const { data } = await api.get("/api/homesliders");
      setSliders(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchSliders();
  }, []);

  const handleCreate = () => {
    setEditingSlider(null);
    setIsModalOpen(true);
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/homesliders/${id}`);
      fetchSliders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (formData) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editingSlider) {
        await api.post(
          `/api/homesliders/${editingSlider.id}?_method=PUT`,
          formData,
          config
        );
      } else {
        await api.post("/api/homesliders", formData, config);
      }
      setIsModalOpen(false);
      fetchSliders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sliders</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Slider
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">S/N</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {sliders.map((slider, index) => (
            <tr key={slider.id}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2 text-center">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/${slider.image}`}
                  alt="slider"
                  className="w-20 h-12 object-cover mx-auto"
                />
              </td>
              <td className="border p-2 text-center">{slider.status}</td>
              <td className="border p-2 text-center flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(slider)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slider.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SliderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingSlider}
      />
    </div>
  );
};

export default SliderPage;
