import React, { useState, useEffect } from "react";
import api from "../api/axios";

// ================= Shipping Modal =================
const ShippingModal = ({
  title,
  initialData = { name: "", price: "", status: 1 }, // status as number
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "status" ? Number(value) : value, // convert status to number
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      await onSave(formData);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-96 p-4 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="name"
            placeholder="Shipping Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Shipping Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= Main Shipping Page =================
const Shipping = () => {
  const [shippingList, setShippingList] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentShipping, setCurrentShipping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:8000/api/shipping";

  // Fetch Data
  const fetchShipping = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get('api/shipping');
      setShippingList(res.data);
    } catch (err) {
      setError("Failed to fetch shipping data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  // Create
  const handleCreate = async (data) => {
    await api.post('api/shipping', data, {
      headers: { "Content-Type": "application/json" },
    });
    fetchShipping();
    setCreateModalOpen(false);
  };

  // Edit
  const handleEdit = async (data) => {
    await api.put(`api/shipping/${currentShipping.id || currentShipping._id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    fetchShipping();
    setEditModalOpen(false);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shipping?")) return;
    try {
      await api.delete(`api/shipping/${id}`);
      fetchShipping();
    } catch (err) {
      alert("Failed to delete shipping.");
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-bold">Shipping List</h1>
        <button
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => setCreateModalOpen(true)}
        >
          Create
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300 text-center text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300">#</th>
                <th className="p-2 border border-gray-300">Name</th>
                <th className="p-2 border border-gray-300">Price</th>
                <th className="p-2 border border-gray-300">Status</th>
                <th className="p-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {shippingList.map((item, i) => (
                <tr key={item.id || item._id} className="hover:bg-gray-50">
                  <td className="p-2 border border-gray-300">{i + 1}</td>
                  <td className="p-2 border border-gray-300">{item.name}</td>
                  <td className="p-2 border border-gray-300">{item.price}</td>
                  <td
                    className={`p-2 border border-gray-300 ${
                      item.status === 1 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.status === 1 ? "Active" : "Inactive"}
                  </td>
                  <td className="p-2 border border-gray-300 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentShipping(item);
                        setEditModalOpen(true);
                      }}
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id || item._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {createModalOpen && (
        <ShippingModal
          title="Create Shipping"
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreate}
        />
      )}

      {editModalOpen && currentShipping && (
        <ShippingModal
          title="Edit Shipping"
          initialData={currentShipping}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
};

export default Shipping;
