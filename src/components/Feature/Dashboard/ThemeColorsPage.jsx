import React, { useState, useEffect } from "react";
import api from "../../../api/axios";



// ✅ Reusable Modal Component
const ColorModal = ({
  title,
  initialData = {
    bg_color: "",
    text_color: "",
    hover_color: "",
    active_color: "",
    border_color: "",
  },
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.bg_color || !form.text_color)
      return alert("Background and Text color are required!");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <div className="flex flex-col gap-3">
          {["bg_color", "text_color", "hover_color", "active_color", "border_color"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              className="border border-gray-300 outline-none text-sm text-gray-700 p-2 rounded w-full"
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Main Component
const ThemeColorsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  // 🔹 Fetch all theme colors
  const fetchData = async () => {
    try {
      const res = await api.get('api/featuresidebar');
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Create new color
  const handleCreate = async (data) => {
    try {
      await api.post('api/featuresidebar', data);
      await fetchData();
      setCreateOpen(false);
    } catch (err) {
      console.error("Create error:", err);
      alert("Failed to create color");
    }
  };

  // 🔹 Update color
  const handleUpdate = async (data) => {
    try {
      await api.put(`api/featuresidebar/${current.id}`, data);
      await fetchData();
      setEditOpen(false);
      setCurrent(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update color");
    }
  };

  // 🔹 Delete color
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this color?")) return;
    try {
      await api.delete(`api/featuresidebar/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">sidebar Colors Management</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Background", "Text", "Hover", "Active", "Border", "Actions"].map((h) => (
                <th
                  key={h}
                  className="p-2 border border-gray-200 text-center text-sm font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-400">
                  No theme colors found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border border-gray-200">
                  <td className="p-2 text-sm text-center">{item.id}</td>
                  <td className="p-2 text-sm text-center">{item.bg_color}</td>
                  <td className="p-2 text-sm text-center">{item.text_color}</td>
                  <td className="p-2 text-sm text-center">{item.hover_color}</td>
                  <td className="p-2 text-sm text-center">{item.active_color}</td>
                  <td className="p-2 text-sm text-center">{item.border_color}</td>
                  <td className="p-2 flex justify-center gap-2">
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
          title="Create Theme Color"
          onClose={() => setCreateOpen(false)}
          onSave={handleCreate}
        />
      )}

      {editOpen && current && (
        <ColorModal
          title={`Edit Theme Color #${current.id}`}
          initialData={current}
          onClose={() => {
            setEditOpen(false);
            setCurrent(null);
          }}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default ThemeColorsPage;
