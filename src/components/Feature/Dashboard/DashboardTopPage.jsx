import React, { useState } from "react";

const DashboardTopPage = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "Total Users",
      textColor: "#000000",
      bgColor: "#f3f4f6",
      iconBgColor: "#2563eb",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    textColor: "",
    bgColor: "",
    iconBgColor: "",
  });

  // Open modal (create or edit)
  const handleOpenModal = (card = null) => {
    if (card) {
      setEditingId(card.id);
      setFormData({
        title: card.title,
        textColor: card.textColor,
        bgColor: card.bgColor,
        iconBgColor: card.iconBgColor,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        textColor: "",
        bgColor: "",
        iconBgColor: "",
      });
    }
    setModalOpen(true);
  };

  // Save (create/update)
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a title!");
      return;
    }

    if (editingId) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, ...formData } : c
        )
      );
    } else {
      setCards((prev) => [...prev, { id: Date.now(), ...formData }]);
    }

    setModalOpen(false);
    setEditingId(null);
  };

  // Delete
  const handleDelete = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-700">
          Dashboard Top Page Management
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm font-semibold text-gray-600">
              <th className="p-3">Preview</th>
              <th className="p-3">Title</th>
              <th className="p-3">Text Color</th>
              <th className="p-3">Background</th>
              <th className="p-3">Icon BG</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr
                key={card.id}
                className="border-t text-sm hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  <div
                    className="w-20 h-12 flex items-center justify-center rounded-md shadow text-xs font-medium"
                    style={{
                      backgroundColor: card.bgColor,
                      color: card.textColor,
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full mr-2"
                      style={{ backgroundColor: card.iconBgColor }}
                    ></div>
                    {card.title}
                  </div>
                </td>
                <td className="p-3">{card.title}</td>
                <td className="p-3">{card.textColor}</td>
                <td className="p-3">{card.bgColor}</td>
                <td className="p-3">{card.iconBgColor}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleOpenModal(card)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {cards.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              {editingId ? "Edit Card" : "Create New Card"}
            </h2>

            <form onSubmit={handleSave}>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter title"
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>

              {/* Text Color */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Text Color
                </label>
                <input
                  type="text"
                  name="textColor"
                  value={formData.textColor}
                  onChange={(e) =>
                    setFormData({ ...formData, textColor: e.target.value })
                  }
                  placeholder="#000000 or red"
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>

              {/* Background Color */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Background Color
                </label>
                <input
                  type="text"
                  name="bgColor"
                  value={formData.bgColor}
                  onChange={(e) =>
                    setFormData({ ...formData, bgColor: e.target.value })
                  }
                  placeholder="#f3f4f6 or white"
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>

              {/* Icon Background */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Icon Background
                </label>
                <input
                  type="text"
                  name="iconBgColor"
                  value={formData.iconBgColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      iconBgColor: e.target.value,
                    })
                  }
                  placeholder="#2563eb or blue"
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTopPage;
