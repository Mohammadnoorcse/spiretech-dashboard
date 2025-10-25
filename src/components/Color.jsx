import React, { useState } from "react";

// Modal for Color
const ColorModal = ({ title, initialData = { name: "", code: "#000000" }, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Color Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="color"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="border p-2 rounded w-full h-12"
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

// Main Color Component
const Color = () => {
  const [colors, setColors] = useState([
    { id: 1, name: "Red", code: "#FF0000" },
    { id: 2, name: "Blue", code: "#0000FF" },
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Color</h1>
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
              <th className="p-2 border">Color Name</th>
              <th className="p-2 border">Color Code</th>
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color.id} className="hover:bg-gray-50">
                <td className="p-2 border">{color.id}</td>
                <td className="p-2 border">{color.name}</td>
                <td className="p-2 border">{color.code}</td>
                <td className="p-2 border">
                  <div className="w-8 h-8 mx-auto rounded" style={{ backgroundColor: color.code }}></div>
                </td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => {
                      setCurrentColor(color);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => setColors(colors.filter((c) => c.id !== color.id))}
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
        <ColorModal
          title="Create Color"
          onClose={() => setCreateModalOpen(false)}
          onSave={(data) => {
            setColors([...colors, { id: colors.length + 1, ...data }]);
            setCreateModalOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && currentColor && (
        <ColorModal
          title="Edit Color"
          initialData={currentColor}
          onClose={() => setEditModalOpen(false)}
          onSave={(data) => {
            setColors(colors.map((c) => (c.id === currentColor.id ? { ...c, ...data } : c)));
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Color;
