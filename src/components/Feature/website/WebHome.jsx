import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../api/axios"

// Modal for Create/Edit (same as before)
const ColorModal = ({ title, initialData, onClose, onSave }) => {
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
          {["bgColor", "textColor", "hoverColor", "activeColor", "borderColor"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={form[field]}
              onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
              className="border border-gray-300 outline-none text-sm text-gray-600 p-2 rounded w-full"
            />
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const WebHome = () => {
  
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  // Fetch colors
  const fetchColors = async () => {
    const res = await api.get('api/webhome');
    setItems(res.data);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  // Create color
  const handleCreate = async (data) => {
    await api.post('api/webhome', data);
    fetchColors();
    setCreateOpen(false);
  };

  // Update color
  const handleUpdate = async (data) => {
    await api.put(`api/webhome/${current.id}`, data);
    fetchColors();
    setEditOpen(false);
    setCurrent(null);
  };

  // Delete color
  const handleDelete = async (id) => {
    if (window.confirm("Delete this color?")) {
      await api.delete(`api/webhome/${id}`);
      fetchColors();
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Website Colors Management</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border border-gray-300">
              <th className="p-2 border text-center">ID</th>
              <th className="p-2 border text-center">Background</th>
              <th className="p-2 border text-center">Text</th>
              <th className="p-2 border text-center">Hover</th>
              <th className="p-2 border text-center">Active</th>
              <th className="p-2 border text-center">Border</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="7" className="p-4 text-center text-gray-400">No items</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border border-gray-300">
                  <td className="p-2 text-center">{item.id}</td>
                  <td className="p-2 text-center">{item.bgColor}</td>
                  <td className="p-2 text-center">{item.textColor}</td>
                  <td className="p-2 text-center">{item.hoverColor}</td>
                  <td className="p-2 text-center">{item.activeColor}</td>
                  <td className="p-2 text-center">{item.borderColor}</td>
                  <td className="p-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => { setCurrent(item); setEditOpen(true); }}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {createOpen && (
        <ColorModal
          title="Create Theme Colors"
          initialData={{ bgColor: "", textColor: "", hoverColor: "", activeColor: "", borderColor: "" }}
          onClose={() => setCreateOpen(false)}
          onSave={handleCreate}
        />
      )}

      {editOpen && current && (
        <ColorModal
          title={`Edit Theme Colors #${current.id}`}
          initialData={current}
          onClose={() => setEditOpen(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default WebHome;
