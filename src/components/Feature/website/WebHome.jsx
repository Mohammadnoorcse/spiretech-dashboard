import React, { useState } from "react";

// Modal for Create/Edit
const ColorModal = ({ title, initialData = { bgColor: "", textColor: "", hoverColor: "", activeColor: "", borderColor: "" }, onClose, onSave }) => {
  const [form, setForm] = useState(initialData);

  const handleSave = () => {
    if (!form.bgColor || !form.textColor) return alert("bgColor and textColor are required");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <div className="flex flex-col gap-3">
          <input type="text" placeholder="Background Color (bgColor)" value={form.bgColor}
            onChange={(e) => setForm((p) => ({ ...p, bgColor: e.target.value }))}
            className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full "
          />
          <input
            type="text"
            placeholder="Text Color (textColor)"
            value={form.textColor}
            onChange={(e) => setForm((p) => ({ ...p, textColor: e.target.value }))}
            className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Hover Color (hoverColor)"
            value={form.hoverColor}
            onChange={(e) => setForm((p) => ({ ...p, hoverColor: e.target.value }))}
            className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Active Color (activeColor)"
            value={form.activeColor}
            onChange={(e) => setForm((p) => ({ ...p, activeColor: e.target.value }))}
            className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Border Color (borderColor)"
            value={form.borderColor}
            onChange={(e) => setForm((p) => ({ ...p, borderColor: e.target.value }))}
            className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
          />
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

const WebHome = () => {

  const [items, setItems] = useState([
    {
      id: 1,
      bgColor: "#0C1A32",
      textColor: "#FFFFFF",
      hoverColor: "#1e3a5f",
      activeColor: "#3182CE",
      borderColor: "border-gray-600",
    },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const nextId = () => (items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1);

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">website Colors Management</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded">
        <table className="min-w-full">
          <thead>
            <tr className="border border-gray-300 rounded-md">
              <th className="p-2 text-left text-sm font-normal">ID</th>
              <th className="p-2 text-left text-sm font-normal">Background</th>
              <th className="p-2 text-left text-sm font-normal">Text</th>
              <th className="p-2 text-left text-sm font-normal">Hover</th>
              <th className="p-2 text-left text-sm font-normal">Active</th>
              <th className="p-2 text-left text-sm font-normal">Border</th>
              <th className="p-2 text-left text-sm font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-400">
                  No items
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border border-gray-300">
                <td className="p-2 text-sm text-gray-400">{item.id}</td>
                <td className="p-2 text-sm text-gray-400">{item.bgColor}</td>
                <td className="p-2 text-sm text-gray-400">{item.textColor}</td>
                <td className="p-2 text-sm text-gray-400">{item.hoverColor}</td>
                <td className="p-2 text-sm text-gray-400">{item.activeColor}</td>
                <td className="p-2 text-sm text-gray-400">{item.borderColor}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => {
                      setCurrent(item);
                      setEditOpen(true);
                    }}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
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
      {createOpen && (
        <ColorModal
          title="Create Theme Colors"
          onClose={() => setCreateOpen(false)}
          onSave={(data) => {
            setItems([...items, { id: nextId(), ...data }]);
            setCreateOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editOpen && current && (
        <ColorModal
          title={`Edit Theme Colors #${current.id}`}
          initialData={current}
          onClose={() => {
            setEditOpen(false);
            setCurrent(null);
          }}
          onSave={(data) => {
            setItems(items.map((i) => (i.id === current.id ? { ...i, ...data } : i)));
            setEditOpen(false);
            setCurrent(null);
          }}
        />
      )}
    </div>
  );
};

export default WebHome;
