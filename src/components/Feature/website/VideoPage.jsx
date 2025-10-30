import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoModal = ({ title, initialData = { title: "", video: null, status: "active" }, onClose, onSave }) => {
  const [form, setForm] = useState(initialData);
  const [preview, setPreview] = useState(initialData.video ? URL.createObjectURL(initialData.video) : null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, video: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // if (!form.title || !form.video) return alert("Please provide title and video.");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Video title"
              className="border border-gray-300 outline-none text-sm text-gray-400 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Video</label>
            <input type="file" accept="video/*" onChange={handleFile} className="border p-2 w-full rounded" />
          </div>
          {preview && (
            <video src={preview} controls className="w-full h-40 object-cover rounded mt-2"></video>
          )}
          <div>
            <label className="text-sm block mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border rounded p-2 w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
};

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:8000/api/videos");
    setVideos(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

const handleSave = async (data) => {
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  if (data.status) formData.append("status", data.status);
  if (data.video instanceof File) formData.append("video", data.video); // ✅ only send if it's a file

  if (current) {
    // update
    await axios.post(`http://localhost:8000/api/videos/${current.id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    // create
    await axios.post("http://localhost:8000/api/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  fetchVideos();
  setCreateOpen(false);
  setEditOpen(false);
  setCurrent(null);
};


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    await axios.delete(`http://localhost:8000/api/videos/${id}`);
    fetchVideos();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Video Upload</h1>
        <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600">Add Video</button>
      </div>
      <div className="overflow-x-auto bg-white border border-gray-300">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">ID</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Title</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Video</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Status</th>
              <th className="p-2 border border-gray-300 text-center text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500 italic">No videos found.</td>
              </tr>
            )}
            {videos.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 transition">
                <td className="p-2 border border-gray-300 text-center text-sm font-medium ">{v.id}</td>
                <td className="p-2 border border-gray-300 text-center text-sm font-medium">{v.title}</td>
                <td className="p-2 border border-gray-300 text-center text-sm font-medium ">
                  <video src={`http://localhost:8000/storage/${v.path}`} controls className="w-40 h-24 object-cover rounded mx-auto"></video>
                </td>
                <td className="p-2 border border-gray-300 text-center text-sm font-medium ">{v.status}</td>
                <td className="p-2 border border-gray-300 text-center text-sm font-medium flex justify-center gap-2">
                  <button onClick={() => { setCurrent(v); setEditOpen(true); }} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs">Edit</button>
                  <button onClick={() => handleDelete(v.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {createOpen && <VideoModal title="Add Video" onClose={() => setCreateOpen(false)} onSave={handleSave} />}
      {editOpen && current && <VideoModal title={`Edit Video #${current.id}`} initialData={current} onClose={() => { setEditOpen(false); setCurrent(null); }} onSave={handleSave} />}
    </div>
  );
};

export default VideoPage;
