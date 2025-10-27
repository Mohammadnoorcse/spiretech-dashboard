import React, { useState, useEffect } from "react";
import api from "../api/axios";

// ================= Discount Modal =================
const DiscountModal = ({
  title,
  initialData = {
    name: "",
    discountPrice: "",
    discountType: "percentage",
    startDate: "",
    endDate: "",
    status: "Active",
  },
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            placeholder="Discount Price"
            value={formData.discountPrice}
            onChange={(e) =>
              setFormData({ ...formData, discountPrice: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          <select
            value={formData.discountType}
            onChange={(e) =>
              setFormData({ ...formData, discountType: e.target.value })
            }
            className="border p-2 rounded w-full"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>

          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="border p-2 rounded w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= Discount Main Component =================
const Discount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/discounts"; // Laravel API

  // Load discounts from API
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await api.get('api/discounts');
      setDiscounts(res.data);
    } catch (err) {
      console.error("Error fetching discounts:", err);
    }
  };

  // Create discount
  const handleCreate = async (data) => {
    try {
      const payload = {
        name: data.name,
        discountPrice: data.discountPrice,
        discountType: data.discountType,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status === "Active" ? 1 : 0,
      };
      const res = await axios.post(API_URL, payload);
      setDiscounts([...discounts, res.data.data]);
      setCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating discount:", err);
    }
  };

  // Update discount
  const handleUpdate = async (data) => {
    try {
      const payload = {
        name: data.name,
        discountPrice: data.discountPrice,
        discountType: data.discountType,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status === "Active" ? 1 : 0,
      };
      const res = await api.put(`api/discounts/${currentDiscount.id}`, payload);
      setDiscounts(
        discounts.map((d) => (d.id === currentDiscount.id ? res.data.data : d))
      );
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error updating discount:", err);
    }
  };

  // Delete discount
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?")) return;

    try {
      await api.delete(`api/discounts/${id}`);
      setDiscounts(discounts.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting discount:", err);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Discounts</h1>
        <button
          className="px-4 py-1 bg-[#45AEF1] text-white rounded-md hover:bg-[#3791d5]"
          onClick={() => setCreateModalOpen(true)}
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300 text-center text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300">ID</th>
              <th className="p-2 border border-gray-300">Name</th>
              <th className="p-2 border border-gray-300">Discount Price</th>
              <th className="p-2 border border-gray-300">Type</th>
              <th className="p-2 border border-gray-300">Start Date</th>
              <th className="p-2 border border-gray-300">End Date</th>
              <th className="p-2 border border-gray-300">Status</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300">{d.id}</td>
                <td className="p-2 border border-gray-300">{d.name}</td>
                <td className="p-2 border border-gray-300">{d.discountPrice}</td>
                <td className="p-2 border border-gray-300 capitalize">{d.discountType}</td>
                <td className="p-2 border border-gray-300">{d.startDate}</td>
                <td className="p-2 border border-gray-300">{d.endDate}</td>
                <td className="p-2 border border-gray-300">{d.status === 1 ? "Active" : "Inactive"}</td>
                <td className="p-2 border border-gray-300 flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => {
                      setCurrentDiscount(d);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(d.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {createModalOpen && (
        <DiscountModal
          title="Create Discount"
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreate}
        />
      )}

      {editModalOpen && currentDiscount && (
        <DiscountModal
          title="Edit Discount"
          initialData={{
            ...currentDiscount,
            status: currentDiscount.status === 1 ? "Active" : "Inactive",
          }}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default Discount;
