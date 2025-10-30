import React, { useState } from "react";

// Modal Component
const SocialMediaModal = ({
  title,
  initialData = { name: "", url: "", status: "active" },
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(initialData);

  const handleSave = () => {
    if (!form.name || !form.url) return alert("Please enter name and URL.");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter social media name"
              className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">URL</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://example.com"
              className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
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

// Main Page
const SocialMediaPage = () => {
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const nextId = () =>
    items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-700">
          Social Media Links
        </h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-300">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">ID</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Name</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">URL</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Status</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No social media links found.
                </td>
              </tr>
            )}
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-gray-50 transition">
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center">{it.id}</td>
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center">{it.name}</td>
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center">
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {it.url}
                  </a>
                </td>
                <td className="p-2 text-sm border border-gray-300 text-gray-400  text-center">
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
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center text-center">
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
                        if (!confirm("Delete this link?")) return;
                        setItems((prev) =>
                          prev.filter((i) => i.id !== it.id)
                        );
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
        <SocialMediaModal
          title="Add Social Media Link"
          onClose={() => setCreateOpen(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, { id: nextId(), ...data }]);
            setCreateOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editOpen && current && (
        <SocialMediaModal
          title={`Edit Social Media #${current.id}`}
          initialData={current}
          onClose={() => {
            setEditOpen(false);
            setCurrent(null);
          }}
          onSave={(data) => {
            setItems((prev) =>
              prev.map((it) => (it.id === current.id ? { ...it, ...data } : it))
            );
            setEditOpen(false);
            setCurrent(null);
          }}
        />
      )}
    </div>
  );
};

export default SocialMediaPage;
