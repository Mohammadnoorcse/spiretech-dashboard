import React, { useState, useEffect } from "react";
import api from "../api/axios"; 

const CouponModal = ({ title, initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Coupon Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Coupon Value"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch all coupons from API
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get("api/coupons");
      setCoupons(res.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  // Save (Create or Update)
  const handleSave = async (data) => {
    try {
      if (editData) {
        await api.put(`api/coupons/${editData.id}`, data);
      } else {
        await api.post("api/coupons", data);
      }
      fetchCoupons();
      setModalOpen(false);
      setEditData(null);
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  // Delete Coupon
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this coupon?")) return;
  try {
    await api.delete(`api/coupons/${id}`); // no need for 'api/' if baseURL is already /api
    fetchCoupons();
  } catch (error) {
    console.error("Error deleting coupon:", error);
    alert("Failed to delete coupon.");
  }
};


  return (
    <div className="p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Coupons</h1>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditData(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Coupon
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Start Date</th>
              <th className="p-2 border">End Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{c.id}</td>
                  <td className="p-2 border">{c.name}</td>
                  <td className="p-2 border">{c.discountPrice}</td>
                  <td className="p-2 border capitalize">{c.discountType}</td>
                  <td className="p-2 border">{c.startDate}</td>
                  <td className="p-2 border">{c.endDate}</td>
                  <td className="p-2 border flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(c);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-gray-500 text-center border"
                >
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <CouponModal
          title={editData ? "Edit Coupon" : "Create Coupon"}
          initialData={
            editData || {
              name: "",
              price: "",
              type: "percentage",
              startDate: "",
              endDate: "",
            }
          }
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Coupon;
