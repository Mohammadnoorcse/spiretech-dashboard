import React, { useState } from "react";

const UserList = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "Active",
      role: "Admin",
      image: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Inactive",
      role: "User",
      image: "https://i.pravatar.cc/100?img=2",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({ status: "", role: "" });

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditData({ status: user.status, role: user.role });
  };

  const handleSave = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, ...editData } : u
      )
    );
    setSelectedUser(null);
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm font-semibold text-gray-600">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t text-sm hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td
                  className={`p-3 font-semibold ${
                    user.status === "Active"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {user.status}
                </td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-blue-600 cursor-pointer" >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-5">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Edit User ({selectedUser.name})
            </h2>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600">
                Status
              </label>
              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
                className="w-full mt-1 border rounded-md p-2 focus:ring focus:ring-blue-200"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <select
                value={editData.role}
                onChange={(e) =>
                  setEditData({ ...editData, role: e.target.value })
                }
                className="w-full mt-1 border rounded-md p-2 focus:ring focus:ring-blue-200"
              >
                <option>Admin</option>
                <option>User</option>
                <option>Editor</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;

