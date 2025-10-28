import React, { useState } from "react";

// Modal Component
const FooterImageModal = ({
  title,
  initialData = { filename: "", image: "", width: "", height: "", status: "active" },
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(initialData);

  // Handle image upload
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((p) => ({ ...p, image: reader.result, filename: file.name }));
    };
    reader.readAsDataURL(file);
  };

  // Handle save
  const handleSave = () => {
    if (!form.image) return alert("Please select an image.");
    if (!form.width || !form.height) return alert("Enter width and height.");
    onSave({
      filename: form.filename,
      image: form.image,
      width: Number(form.width),
      height: Number(form.height),
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="space-y-3">
          {/* Image Upload */}
          <div>
            <label className="text-sm block mb-1">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleFile} className="border rounded p-2 w-full" />
          </div>

          {form.image && (
            <div className="flex items-center gap-3">
              <img src={form.image} alt="preview" className="w-24 h-20 object-cover rounded border" />
              <div>
                <p className="text-sm font-medium">{form.filename || "Uploaded image"}</p>
                <p className="text-xs text-gray-500">Preview of uploaded file</p>
              </div>
            </div>
          )}

          {/* Width + Height */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1">Width (px)</label>
              <input
                type="number"
                value={form.width}
                onChange={(e) => setForm((p) => ({ ...p, width: e.target.value }))}
                className="border rounded p-2 w-full"
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Height (px)</label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))}
                className="border rounded p-2 w-full"
                placeholder="e.g. 400"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm block mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="border rounded p-2 w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const FooterImage = () => {
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const nextId = () => (items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1);

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Footer Images</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          + Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Filename</th>
              <th className="p-2 border">Width</th>
              <th className="p-2 border">Height</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 p-4">
                  No footer images found.
                </td>
              </tr>
            )}
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-gray-50 transition">
                <td className="p-2 border text-center">{it.id}</td>
                <td className="p-2 border text-center">
                  {it.image ? (
                    <img src={it.image} alt={it.filename} className="w-32 h-16 object-cover rounded mx-auto" />
                  ) : (
                    <div className="w-32 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 mx-auto">
                      No preview
                    </div>
                  )}
                </td>
                <td className="p-2 border text-center">{it.filename}</td>
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
                      onClick={() => {
                        setCurrent(it);
                        setEditOpen(true);
                      }}
                      className="px-2 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm("Delete this image?")) return;
                        setItems((prev) => prev.filter((p) => p.id !== it.id));
                      }}
                      className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {createOpen && (
        <FooterImageModal
          title="Create Footer Image"
          onClose={() => setCreateOpen(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, { id: nextId(), ...data }]);
            setCreateOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editOpen && current && (
        <FooterImageModal
          title={`Edit Footer Image #${current.id}`}
          initialData={current}
          onClose={() => {
            setEditOpen(false);
            setCurrent(null);
          }}
          onSave={(data) => {
            setItems((prev) => prev.map((it) => (it.id === current.id ? { ...it, ...data } : it)));
            setEditOpen(false);
            setCurrent(null);
          }}
        />
      )}
    </div>
  );
};

export default FooterImage;
