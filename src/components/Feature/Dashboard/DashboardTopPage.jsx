import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

const DashboardTopPage = () => {
  const [cards, setCards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    textColor: "",
    bgColor: "",
    iconBgColor: "",
  });

  // ✅ Normalize API data (snake_case → camelCase)
  const normalizeCard = (card) => ({
    id: card.id,
    title: card.title,
    textColor: card.text_color,
    bgColor: card.bg_color,
    iconBgColor: card.icon_bg_color,
  });

  // ✅ Load cards from API
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await api.get("api/featurestopnavbar");
      const normalized = res.data.map(normalizeCard);
      setCards(normalized);
    } catch (err) {
      console.error("Error fetching cards:", err);
    }
  };

  // ✅ Open modal for create/edit
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

  // ✅ Save (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a title!");
      return;
    }

    // Convert back to snake_case for Laravel
    const payload = {
      title: formData.title,
      text_color: formData.textColor,
      bg_color: formData.bgColor,
      icon_bg_color: formData.iconBgColor,
    };

    try {
      if (editingId) {
        await api.put(`api/featurestopnavbar/${editingId}`, payload);
      } else {
        await api.post("api/featurestopnavbar", payload);
      }
      await fetchCards();
      setModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save data!");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await api.delete(`api/featurestopnavbar/${id}`);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete!");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-base font-bold">Dashboard Top Page Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-center text-sm font-medium">Preview</th>
              <th className="p-2 border text-center text-sm font-medium">Title</th>
              <th className="p-2 border text-center text-sm font-medium">Text Color</th>
              <th className="p-2 border text-center text-sm font-medium">Background</th>
              <th className="p-2 border text-center text-sm font-medium">Icon BG</th>
              <th className="p-2 border text-center text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {cards.length > 0 ? (
              cards.map((card) => (
                <tr key={card.id} className="border-t border-gray-300 text-sm hover:bg-gray-50 transition">
                  <td className="p-3 text-center">
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
                  <td className="p-2 border border-gray-300  text-center text-gray-600">{card.title}</td>
                  <td className="p-2 border border-gray-300  text-center text-gray-600">{card.textColor}</td>
                  <td className="p-2 border border-gray-300  text-center text-gray-600">{card.bgColor}</td>
                  <td className="p-2 border border-gray-300  text-center text-gray-600">{card.iconBgColor}</td>
                  <td className="p-2   flex border-gray-300  justify-center items-center  w-full h-full">
                    <div className="flex justify-center items-center gap-2 w-full h-full ">
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

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500 italic">
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
              {["title", "textColor", "bgColor", "iconBgColor"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    placeholder={`Enter ${field}`}
                    className="border border-gray-300 outline-none text-sm text-gray-600 p-2 rounded w-full"
                  />
                </div>
              ))}

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
