import React, { useState, useEffect } from "react";
import api from "../../../api/axios"; // your axios instance

// Modal Component for Create / Edit
const HeaderImageModal = ({ title, initialData = {}, onClose, onSave }) => {
  const [form, setForm] = useState({
    file: null,
    filename: initialData.filename || "",
    image: initialData.image || "",
    width: initialData.width || "",
    height: initialData.height || "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, file, filename: file.name, image: URL.createObjectURL(file) }));
  };

  const handleSave = () => {
    if (!form.width || !form.height) return alert("Width and Height are required.");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="flex flex-col gap-3">
          <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" />
          {form.image && (
            <div className="flex gap-3 items-center">
              <img src={form.image} alt="preview" className="w-28 h-20 object-cover rounded border" />
              <div>
                <div className="text-sm font-medium">{form.filename}</div>
                <div className="text-xs text-gray-500">Preview of uploaded file</div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Width"
              value={form.width}
              onChange={(e) => setForm((p) => ({ ...p, width: e.target.value }))}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Height"
              value={form.height}
              onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))}
              className="border p-2 rounded"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const HeaderImage = () => {
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  // Fetch from Laravel API
  const fetchImages = async () => {
    try {
      const res = await api.get("/api/featurelogo");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Create
  const handleCreate = async (form) => {
    try {
      const fd = new FormData();
      fd.append("image", form.file);
      fd.append("filename", form.filename);
      fd.append("width", form.width);
      fd.append("height", form.height);

      const res = await api.post("/api/featurelogo", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setItems((prev) => [res.data, ...prev]);
      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    }
  };

  // Update
  const handleUpdate = async (form) => {
    try {
      const fd = new FormData();
      if (form.file) fd.append("image", form.file);
      fd.append("filename", form.filename);
      fd.append("width", form.width);
      fd.append("height", form.height);

      const res = await api.post(`/api/featurelogo/${current.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setItems((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
      setEditOpen(false);
      setCurrent(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update image.");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api.delete(`/api/featurelogo/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete image.");
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-lg font-bold">Header Images</h1>
        <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600">
          Create
        </button>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-300">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Filename</th>
              <th className="p-2 border">Width</th>
              <th className="p-2 border">Height</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No header images yet.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="hover:bg-gray-50">
                  <td className="p-2 border border-gray-300  text-center">{it.id}</td>
                  <td className="p-2 border border-gray-300  text-center">
                    {it.image_path ? (
                      <img src={`${import.meta.env.VITE_API_BASE_URL}storage/${it.image_path}`}  alt={it.filename} className="w-40 h-16 object-cover rounded mx-auto" />
                    ) : (
                      <div className="w-40 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 mx-auto">No preview</div>
                    )}
                  </td>
                  <td className="p-2 border border-gray-300 text-center">{it.filename}</td>
                  <td className="p-2 border border-gray-300 text-center">{it.width}</td>
                  <td className="p-2 border border-gray-300 text-center">{it.height}</td>
                  <td className="p-2 w-full h-full border-t border-gray-300  text-center flex justify-center items-center gap-2">
                    <button onClick={() => { setCurrent(it); setEditOpen(true); }} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs">Edit</button>
                    <button onClick={() => handleDelete(it.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {createOpen && <HeaderImageModal title="Create Header Image" onClose={() => setCreateOpen(false)} onSave={handleCreate} />}
      {editOpen && current && <HeaderImageModal title={`Edit Header Image #${current.id}`} initialData={current} onClose={() => { setEditOpen(false); setCurrent(null); }} onSave={handleUpdate} />}
    </div>
  );
};

export default HeaderImage;
