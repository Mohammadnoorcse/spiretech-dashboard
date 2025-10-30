import React, { useState } from "react";

const ContactModal = ({
  title,
  initialData = { name: "", address: "", email: "", number: "" },
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(initialData);

  const handleSave = () => {
    if (!form.name || !form.email || !form.number)
      return alert("Please fill out all required fields.");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter name"
              className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Enter address"
              className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email"
              className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="Enter phone number"
              className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const nextId = () =>
    contacts.length ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base font-bold">Contact Page</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-300 ">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium ">ID</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium ">Name</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium ">Address</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Email</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Number</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No contacts found.
                </td>
              </tr>
            )}

            {contacts.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center">{c.id}</td>
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center">{c.name}</td>
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center">{c.address}</td>
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center">{c.email}</td>
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center">{c.number}</td>
                <td className="p-2 text-sm border border-gray-300 text-gray-400 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setCurrent(c);
                        setEditOpen(true);
                      }}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm("Delete this contact?")) return;
                        setContacts((prev) =>
                          prev.filter((item) => item.id !== c.id)
                        );
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {createOpen && (
        <ContactModal
          title="Create Contact"
          onClose={() => setCreateOpen(false)}
          onSave={(data) => {
            const newContact = { id: nextId(), ...data };
            setContacts((prev) => [...prev, newContact]);
            setCreateOpen(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editOpen && current && (
        <ContactModal
          title={`Edit Contact #${current.id}`}
          initialData={current}
          onClose={() => {
            setEditOpen(false);
            setCurrent(null);
          }}
          onSave={(data) => {
            setContacts((prev) =>
              prev.map((item) =>
                item.id === current.id ? { ...item, ...data } : item
              )
            );
            setEditOpen(false);
            setCurrent(null);
          }}
        />
      )}
    </div>
  );
};

export default ContactPage;
