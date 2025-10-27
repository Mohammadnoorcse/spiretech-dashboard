import React, { useState } from "react";

// Modal to view/edit order
const OrderModal = ({
  title,
  initialData = { customer: "", total: "", status: "Pending", date: "" },
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-11/12 max-w-lg">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Customer Name"
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Total Price"
            value={formData.total}
            onChange={(e) => setFormData({ ...formData, total: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

// Main Order List Component
const OrderList = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "John Doe",
      total: 250.0,
      status: "Pending",
      date: "2025-10-24",
    },
    {
      id: 2,
      customer: "Jane Smith",
      total: 120.0,
      status: "Delivered",
      date: "2025-10-20",
    },
  ]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Order List</h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-center text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total Price</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.customer}</td>
                <td className="p-2 border">${order.total}</td>
                <td
                  className={`p-2 border font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Cancelled"
                      ? "text-red-600"
                      : order.status === "Shipped"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="p-2 border">{order.date}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => {
                      setCurrentOrder(order);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() =>
                      setOrders(orders.filter((o) => o.id !== order.id))
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

      {/* Edit Modal */}
      {editModalOpen && currentOrder && (
        <OrderModal
          title={`Edit Order #${currentOrder.id}`}
          initialData={currentOrder}
          onClose={() => setEditModalOpen(false)}
          onSave={(data) => {
            setOrders(
              orders.map((o) => (o.id === currentOrder.id ? { ...o, ...data } : o))
            );
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default OrderList;
