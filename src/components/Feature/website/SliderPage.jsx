import React, { useState } from "react";

// Modal for Slider
const SliderModal = ({
  title,
  initialData = { image: "", status: "active" },
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(initialData);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((p) => ({ ...p, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.image) return alert("Please select an image.");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="space-y-3">
          {/* Image Upload */}
          <div>
            <label className="text-sm block mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="border rounded p-2 w-full"
            />
          </div>

          {form.image && (
            <div className="flex items-center gap-3">
              <img
                src={form.image}
                alt="preview"
                className="w-40 h-20 object-cover rounded border"
              />
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-sm block mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border rounded p-2 w-full"
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

// Main Slider Page
const SliderPage = () => {
  const [sliders, setSliders] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const nextId = () =>
    sliders.length ? Math.max(...sliders.map((s) => s.id)) + 1 : 1;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-700">Slider Management</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          + Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Preview</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500 italic">
                  No sliders found.
                </td>
              </tr>
            )}
            {sliders.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border text-center">{s.id}</td>
                <td className="p-3 border text-center">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={`slider-${s.id}`}
                      className="w-40 h-20 object-cover rounded mx-auto"
                    />
                  ) : (
                    <div className="w-40 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 mx-auto">
                      No preview
                    </div>
                  )}
                </td>
                <td className="p-3 border text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      s.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setCurrent(s);
                        setEditOpen(true);
                      }}
                      className="px-2 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm("Delete this slider?")) return;
                        setSliders((prev) => prev.filter((i) => i.id !== s.id));
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
        <SliderModal
          title="Create Slider"
          onClose={() => setCreateOpen(false)}
          onSave={(data) => {
            setSliders((prev) => [...prev, { id: nextId(), ...data }]);
            setCreateOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editOpen && current && (
        <SliderModal
          title={`Edit Slider #${current.id}`}
          initialData={current}
          onClose={() => {
            setEditOpen(false);
            setCurrent(null);
          }}
          onSave={(data) => {
            setSliders((prev) =>
              prev.map((s) => (s.id === current.id ? { ...s, ...data } : s))
            );
            setEditOpen(false);
            setCurrent(null);
          }}
        />
      )}
    </div>
  );
};

export default SliderPage;
