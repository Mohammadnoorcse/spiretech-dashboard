import React, { useState } from "react";

// Coupon Modal
const CouponModal = ({
  title,
  initialData = {
    name: "",
    price: "",
    type: "percentage",
    startDate: "",
    endDate: "",
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
            placeholder="Coupon Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Coupon Value"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
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

// Main Coupon Page
const Coupon = () => {
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      name: "NEWUSER50",
      price: 50,
      type: "percentage",
      startDate: "2025-10-20",
      endDate: "2025-10-31",
    },
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Coupons</h1>
        <button
          className="px-4 py-1 bg-[#45AEF1] text-white rounded-md hover:bg-[#3791d5]"
          onClick={() => setCreateModalOpen(true)}
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-center text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Coupon Name</th>
              <th className="p-2 border">Value</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Start Date</th>
              <th className="p-2 border">End Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="p-2 border">{coupon.id}</td>
                <td className="p-2 border">{coupon.name}</td>
                <td className="p-2 border">{coupon.price}</td>
                <td className="p-2 border capitalize">{coupon.type}</td>
                <td className="p-2 border">{coupon.startDate}</td>
                <td className="p-2 border">{coupon.endDate}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => {
                      setCurrentCoupon(coupon);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() =>
                      setCoupons(coupons.filter((c) => c.id !== coupon.id))
                    }
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
      {createModalOpen && (
        <CouponModal
          title="Create Coupon"
          onClose={() => setCreateModalOpen(false)}
          onSave={(data) => {
            setCoupons([...coupons, { id: coupons.length + 1, ...data }]);
            setCreateModalOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && currentCoupon && (
        <CouponModal
          title="Edit Coupon"
          initialData={currentCoupon}
          onClose={() => setEditModalOpen(false)}
          onSave={(data) => {
            setCoupons(
              coupons.map((c) =>
                c.id === currentCoupon.id ? { ...c, ...data } : c
              )
            );
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Coupon;
