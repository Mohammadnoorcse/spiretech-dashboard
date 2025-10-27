import React, { useState, useEffect } from "react";
import api from "../api/axios";

// Modal
const SizeModal = ({ title, initialData = { name: "", length: "", width: "" }, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div className="flex flex-col gap-3">
          <input type="text" placeholder="Size Name" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} className="border p-2 rounded w-full" />
          <input type="number" placeholder="Length" value={formData.length} onChange={(e)=>setFormData({...formData,length:e.target.value})} className="border p-2 rounded w-full" />
          <input type="number" placeholder="Width" value={formData.width} onChange={(e)=>setFormData({...formData,width:e.target.value})} className="border p-2 rounded w-full" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={()=>onSave(formData)}>Save</button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const Size = () => {
  const [sizes, setSizes] = useState([]);
  const [createModalOpen,setCreateModalOpen] = useState(false);
  const [editModalOpen,setEditModalOpen] = useState(false);
  const [currentSize,setCurrentSize] = useState(null);

  

  useEffect(()=>{ fetchSizes(); },[]);

  const fetchSizes = async () => {
    try{ const res = await api.get('api/size'); setSizes(res.data); } 
    catch(err){ console.error(err); }
  }

  const handleCreate = async (data) => {
    try{ await api.post('api/size',data); setCreateModalOpen(false); fetchSizes(); } 
    catch(err){ console.error(err); }
  }

  const handleUpdate = async (data) => {
    try{ await api.put(`api/size/${currentSize.id}`,data); setEditModalOpen(false); fetchSizes(); } 
    catch(err){ console.error(err); }
  }

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure to delete?")) return;
    try{ await api.delete(`api/size/${id}`); fetchSizes(); } 
    catch(err){ console.error(err); }
  }

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-base font-bold">Sizes</h1>
        <button className="px-4 py-1 bg-[#45AEF1] text-white rounded-md hover:bg-[#3791d5]" onClick={()=>setCreateModalOpen(true)}>Create</button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300">ID</th>
              <th className="p-2 border border-gray-300">Name</th>
              <th className="p-2 border border-gray-300">Length</th>
              <th className="p-2 border border-gray-300">Width</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map(s=>
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300">{s.id}</td>
                <td className="p-2 border border-gray-300">{s.name}</td>
                <td className="p-2 border border-gray-300">{s.length}</td>
                <td className="p-2 border border-gray-300">{s.width}</td>
                <td className="p-2 border border-gray-300 flex justify-center gap-2">
                  <button className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500" onClick={()=>{ setCurrentSize(s); setEditModalOpen(true); }}>Edit</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={()=>handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {createModalOpen && <SizeModal title="Create Size" onClose={()=>setCreateModalOpen(false)} onSave={handleCreate} />}
      {editModalOpen && currentSize && <SizeModal title="Edit Size" initialData={currentSize} onClose={()=>setEditModalOpen(false)} onSave={handleUpdate} />}
    </div>
  );
}

export default Size;
