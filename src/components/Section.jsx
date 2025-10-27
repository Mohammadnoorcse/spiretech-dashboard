import React, { useState, useEffect } from "react";
import api from "../api/axios";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/sections";

// Section Modal
const SectionModal = ({ title, initialData = { name: "" }, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Section Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

// Main Section Component
const Section = () => {
  const [sections, setSections] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);

  // Fetch all sections
  useEffect(() => {
    api.get('api/sections').then((res) => setSections(res.data));
  }, []);

  // Create new section
  const handleCreate = async (data) => {
    const res = await api.post('api/sections', data);
    setSections([...sections, res.data.data]);
    setCreateModalOpen(false);
  };

  // Update section
  const handleUpdate = async (data) => {
    const res = await api.put(`api/sections/${currentSection.id}`, data);
    setSections(
      sections.map((s) => (s.id === currentSection.id ? res.data.data : s))
    );
    setEditModalOpen(false);
  };

  // Delete section
  const handleDelete = async (id) => {
    await api.delete(`api/sections/${id}`);
    setSections(sections.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Sections</h1>
        <button
          className="px-4 py-1 bg-[#45AEF1] text-white rounded-md hover:bg-[#3791d5]"
          onClick={() => setCreateModalOpen(true)}
        >
          Create
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-center text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Section Name</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id} className="hover:bg-gray-50">
                <td className="p-2 border">{section.id}</td>
                <td className="p-2 border">{section.name}</td>
                <td className="p-2 border">
                  {section.status === 1 ? "Active" : "Inactive"}
                </td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => {
                      setCurrentSection(section);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(section.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {createModalOpen && (
        <SectionModal
          title="Create Section"
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreate}
        />
      )}

      {editModalOpen && currentSection && (
        <SectionModal
          title="Edit Section"
          initialData={currentSection}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default Section;
