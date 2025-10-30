import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

// 🔹 Reusable Modal Component
const HeaderImageModal = ({ title, initialData, onClose, onSave }) => {
  const [form, setForm] = useState(
    initialData || { imageFile: null, width: "", height: "", status: "active" }
  );
  const [preview, setPreview] = useState(initialData?.image? `${import.meta.env.VITE_API_BASE_URL}/${initialData?.image}` : "");

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!form.imageFile && !preview) return alert("Please upload an image.");
    if (!form.width || !form.height) return alert("Enter width and height.");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {/* Upload Input */}
        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 text-sm rounded w-full"
            />
          </div>

          {preview && (
            <div className="flex items-center gap-3">
              <img
                src={preview}
                alt="preview"
                className="w-24 h-20 object-cover rounded border"
              />
              <div>
                <p className="text-sm font-medium">Preview of uploaded image</p>
                <p className="text-xs text-gray-500">{form.imageFile?.name || "Existing Image"}</p>
              </div>
            </div>
          )}

          {/* Width & Height */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1">Width (px)</label>
              <input
                type="number"
                value={form.width}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, width: e.target.value }))
                }
                className="border border-gray-300 p-2 text-sm rounded w-full"
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Height (px)</label>
              <input
                type="number"
                value={form.height}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, height: e.target.value }))
                }
                className="border border-gray-300 p-2 text-sm rounded w-full"
                placeholder="e.g. 400"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm block mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
              className="border border-gray-300 p-2 text-sm rounded w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Main Component
const HeaderImage = () => {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data 
  const fetchData = async () => {
    try {
      const res = await api.get("api/webheaderlogos");
      setItems(res.data || []);
      
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  

  // Create New
  const handleCreate = async (form) => {
    try {
      const data = new FormData();
      data.append("image", form.imageFile);
      data.append("width", form.width);
      data.append("height", form.height);
      data.append("status", form.status);

      await api.post("api/webheaderlogos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Create Error:", err);
    }
  };

  // Update
  const handleUpdate = async (id, form) => {
    try {
      const data = new FormData();
      if (form.imageFile) data.append("image", form.imageFile);
      data.append("width", form.width);
      data.append("height", form.height);
      data.append("status", form.status);

      await api.post(`api/webheaderlogos/${id}?_method=PUT`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditItem(null);
      fetchData();
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.delete(`api/webheaderlogos/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Header Images</h1>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditItem(null);
          }}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          + Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-300">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Preview", "Width", "Height", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="p-2 border border-gray-300 text-center font-medium"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 p-4">
                  No header images found.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="hover:bg-gray-50 transition">
                  <td className="p-2 border text-center">{it.id}</td>
                  <td className="p-2 border text-center">
                    {it.image ? (
                      <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${it.image}`}
                        // src={it.image}
                        alt=""
                        className="w-32 h-16 object-cover rounded mx-auto"
                      />
                    ) : (
                      <div className="w-32 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 mx-auto">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="p-2 border text-center">{it.width}</td>
                  <td className="p-2 border text-center">{it.height}</td>
                  <td className="p-2 border text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        it.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {it.status}
                    </span>
                  </td>
                  <td className="p-2 border text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditItem(it)}
                        className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(it.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {(modalOpen || editItem) && (
        <HeaderImageModal
          title={editItem ? `Edit Header Image #${editItem.id}` : "Create Header Image"}
          initialData={editItem}
          onClose={() => {
            setModalOpen(false);
            setEditItem(null);
          }}
          onSave={(form) => {
            if (editItem) handleUpdate(editItem.id, form);
            else handleCreate(form);
          }}
        />
      )}
    </div>
  );
};

export default HeaderImage;
