import React, { useState } from "react";

// Modal for Size
const SizeModal = ({ title, initialData = { name: "", length: "", width: "" }, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Size Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Length"
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Width"
            value={formData.width}
            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => onSave(formData)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Size Component
const Size = () => {
  const [sizes, setSizes] = useState([
    { id: 1, name: "Small", length: 10, width: 5 },
    { id: 2, name: "Medium", length: 20, width: 10 },
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSize, setCurrentSize] = useState(null);

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Sizes</h1>
        <button
          className="px-4 py-1 bg-[#45AEF1] text-white rounded-md hover:bg-[#3791d5]"
          onClick={() => setCreateModalOpen(true)}
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Length</th>
              <th className="p-2 border">Width</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size.id} className="hover:bg-gray-50">
                <td className="p-2 border">{size.id}</td>
                <td className="p-2 border">{size.name}</td>
                <td className="p-2 border">{size.length}</td>
                <td className="p-2 border">{size.width}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => {
                      setCurrentSize(size);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => setSizes(sizes.filter((s) => s.id !== size.id))}
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
        <SizeModal
          title="Create Size"
          onClose={() => setCreateModalOpen(false)}
          onSave={(data) => {
            setSizes([...sizes, { id: sizes.length + 1, ...data }]);
            setCreateModalOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && currentSize && (
        <SizeModal
          title="Edit Size"
          initialData={currentSize}
          onClose={() => setEditModalOpen(false)}
          onSave={(data) => {
            setSizes(sizes.map((s) => (s.id === currentSize.id ? { ...s, ...data } : s)));
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Size;
