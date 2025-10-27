import React, { useState } from "react";

/**
 * HeaderImage Component
 * - Table: ID | Preview | Filename | Width | Height | Actions
 * - Create / Edit modal with image upload (base64 preview) + width/height inputs
 * - Uses Tailwind CSS classes
 */

const HeaderImageModal = ({ title, initialData = { filename: "", image: "", width: "", height: "" }, onClose, onSave }) => {
  const [form, setForm] = useState(initialData);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((p) => ({ ...p, image: reader.result, filename: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // basic validation
    if (!form.image) return alert("Please choose an image.");
    if (!form.width || !form.height) return alert("Please enter width and height.");
    onSave({
      filename: form.filename,
      image: form.image,
      width: Number(form.width),
      height: Number(form.height),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <div className="flex flex-col gap-3">
          <label className="text-sm">Choose Image</label>
          <input type="file" accept="image/*" onChange={handleFile} className="border p-2 rounded" />

          {form.image && (
            <div className="flex gap-3 items-center">
              <img src={form.image} alt="preview" className="w-28 h-20 object-cover rounded border" />
              <div>
                <div className="text-sm font-medium">{form.filename || "Uploaded image"}</div>
                <div className="text-xs text-gray-500">Preview of uploaded file</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1">Width (px)</label>
              <input
                type="number"
                min="0"
                value={form.width}
                onChange={(e) => setForm((p) => ({ ...p, width: e.target.value }))}
                className="border p-2 rounded w-full"
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Height (px)</label>
              <input
                type="number"
                min="0"
                value={form.height}
                onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))}
                className="border p-2 rounded w-full"
                placeholder="e.g. 400"
              />
            </div>
          </div>
        </div>

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

const HeaderImage = () => {
  const [items, setItems] = useState([
    // sample data
    {
      id: 1,
      filename: "hero-1.jpg",
      image: "",
      width: 1200,
      height: 400,
    },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  // helper to generate next id
  const nextId = () => (items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1);

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Header Images</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          Create
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
              <th className="p-2 border">Width (px)</th>
              <th className="p-2 border">Height (px)</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No header images yet.
                </td>
              </tr>
            )}
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{it.id}</td>
                <td className="p-2 border text-center">
                  {it.image ? (
                    <img src={it.image} alt={it.filename} className="w-40 h-16 object-cover rounded mx-auto" />
                  ) : (
                    <div className="w-40 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 mx-auto">
                      No preview
                    </div>
                  )}
                </td>
                <td className="p-2 border text-center">{it.filename}</td>
                <td className="p-2 border text-center">{it.width}</td>
                <td className="p-2 border text-center">{it.height}</td>
                <td className="p-2 border text-center">
                  <div className="flex items-center justify-center gap-2">
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
                        if (!confirm("Delete this header image?")) return;
                        setItems((prev) => prev.filter((p) => p.id !== it.id));
                      }}
                      className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        // apply dimension example (maybe copy to clipboard)
                        const dims = `${it.width}x${it.height}`;
                        navigator.clipboard?.writeText(dims);
                        alert(`Copied dimensions ${dims} to clipboard.`);
                      }}
                      className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
                    >
                      Copy Size
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
        <HeaderImageModal
          title="Create Header Image"
          initialData={{ filename: "", image: "", width: "", height: "" }}
          onClose={() => setCreateOpen(false)}
          onSave={(data) => {
            const newItem = { id: nextId(), ...data };
            setItems((p) => [...p, newItem]);
            setCreateOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editOpen && current && (
        <HeaderImageModal
          title={`Edit Header Image #${current.id}`}
          initialData={current}
          onClose={() => {
            setEditOpen(false);
            setCurrent(null);
          }}
          onSave={(data) => {
            setItems((p) => p.map((it) => (it.id === current.id ? { ...it, ...data } : it)));
            setEditOpen(false);
            setCurrent(null);
          }}
        />
      )}
    </div>
  );
};

export default HeaderImage;
