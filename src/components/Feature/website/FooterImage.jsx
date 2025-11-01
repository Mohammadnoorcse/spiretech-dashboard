import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../api/axios";

const API_URL = "http://localhost:8000/api/webfooterlogo"; // update for production

// 🔹 Modal Component
const FooterImageModal = ({ title, initialData, onClose, onSave }) => {
  const [form, setForm] = useState(initialData);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((p) => ({
        ...p,
        imagePreview: reader.result,
        imageFile: file,
        filename: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.imageFile && !form.imagePreview)
      return alert("Please select an image.");
    if (!form.width || !form.height) return alert("Enter width and height.");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="space-y-3">
          <div>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="border border-gray-300 outline-none text-sm text-gray-700 p-2 rounded w-full"
            />
          </div>

         {(form.imagePreview || form.image) && (
            <div className="flex items-center gap-3">
                <img
                src={
                    form.imagePreview
                    ? form.imagePreview 
                    : `${import.meta.env.VITE_API_BASE_URL}storage/${form.image}` 
                }
                alt="preview"
                className="w-24 h-20 object-cover rounded border"
                />
                <div>
                <p className="text-sm font-medium">{form.filename}</p>
                <p className="text-xs text-gray-500">Preview of uploaded file</p>
                </div>
            </div>
            )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              
              <input
                type="number"
                placeholder="Width"
                value={form.width}
                onChange={(e) => setForm({ ...form, width: e.target.value })}
                className="border border-gray-300 outline-none text-sm text-gray-700 p-2 rounded w-full"
              />
            </div>
            <div>
              
              <input
                type="number"
                placeholder="Height"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="border border-gray-300 outline-none text-sm text-gray-700 p-2 rounded w-full"
              />
            </div>
          </div>

          <div>
            
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border border-gray-300 outline-none text-sm text-gray-700 p-2 rounded w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Main Component
const FooterImage = () => {
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  // Fetch items
  useEffect(() => {
    api.get('api/webfooterlogo').then((res) => setItems(res.data));
  }, []);

  // Create item
  const createFooterImage = async (data) => {
    const formData = new FormData();
    formData.append("image", data.imageFile);
    formData.append("width", data.width);
    formData.append("height", data.height);
    formData.append("status", data.status);

    const res = await api.post('api/webfooterlogo', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setItems((prev) => [res.data, ...prev]);
    setCreateOpen(false);
  };

  // Update item
  const updateFooterImage = async (data) => {
    const formData = new FormData();
    if (data.imageFile) formData.append("image", data.imageFile);
    formData.append("width", data.width);
    formData.append("height", data.height);
    formData.append("status", data.status);

    const res = await api.post(`api/webfooterlogo/${current.id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setItems((prev) =>
      prev.map((it) => (it.id === current.id ? res.data : it))
    );
    setEditOpen(false);
    setCurrent(null);
  };

  // Delete item
  const deleteFooterImage = async (id) => {
    if (!confirm("Delete this image?")) return;
    await api.delete(`api/webfooterlogo/${id}`);
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Footer Images</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          Create
        </button>
      </div>

      <div className="overflow-x-auto ">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-200 text-center text-sm font-medium">ID</th>
              <th className="p-2 border border-gray-200 text-center text-sm font-medium">Preview</th>
              
              <th className="p-2 border border-gray-200 text-center text-sm font-medium">Width</th>
              <th className="p-2 border border-gray-200 text-center text-sm font-medium">Height</th>
              <th className="p-2 border border-gray-200 text-center text-sm font-medium">Status</th>
              <th className="p-2 border border-gray-200 text-center text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No footer images found.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id}  className="hover:bg-gray-50 ">
                  <td className="p-2 text-sm text-center border border-gray-200">{it.id}</td>
                  <td className="p-2 text-sm text-center border border-gray-200">
                    <img
                      
                      src={`${import.meta.env.VITE_API_BASE_URL}storage/${it.image}`}
                      alt={it.filename}
                      className="w-32 h-16 object-cover mx-auto rounded"
                    />
                  </td>
                  
                  <td className="p-2 text-sm text-center border border-gray-200">{it.width}</td>
                  <td className="p-2 text-sm text-center border border-gray-200">{it.height}</td>
                  <td className="p-2 text-sm text-center border border-gray-200">
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
                  <td className="p-2 border-t border-gray-200 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => {
                          setCurrent(it);
                          setEditOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFooterImage(it.id)}
                        className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs"
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

      {createOpen && (
        <FooterImageModal
          title="Create Footer Image"
          initialData={{
            filename: "",
            image: "",
            width: "",
            height: "",
            status: "active",
          }}
          onClose={() => setCreateOpen(false)}
          onSave={createFooterImage}
        />
      )}

      {editOpen && current && (
        <FooterImageModal
          title={`Edit Footer Image #${current.id}`}
          initialData={current}
          onClose={() => {
            setEditOpen(false);
            setCurrent(null);
          }}
          onSave={updateFooterImage}
        />
      )}
    </div>
  );
};

export default FooterImage;
