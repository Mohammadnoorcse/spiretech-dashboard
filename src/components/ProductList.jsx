import React, { useMemo, useState } from "react";

const ProductList = ({ products, onEdit }) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );

    arr.sort((a, b) => {
      let av = a[sortBy];
      let bv = b[sortBy];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [query, sortBy, sortDir, products]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  }

  return (
    <div>
      {/* Search & PerPage */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by name, SKU, or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/2"
        />
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          {[5, 10, 15].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("name")}>Name</th>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("sku")}>SKU</th>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("category")}>Category</th>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("price")}>Price</th>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("stock")}>Stock</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length > 0 ? (
              pageItems.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <img src={p.img} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    {p.name}
                  </td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">${p.price.toFixed(2)}</td>
                  <td className={`p-3 ${p.stock === 0 ? "text-red-500" : ""}`}>
                    {p.stock === 0 ? "Out of stock" : p.stock}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button className="px-3 py-1 border rounded" onClick={() => onEdit(p)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-3 mt-4">
        {pageItems.map((p) => (
          <div key={p.id} className="border rounded-lg p-3 flex items-start gap-3 shadow-sm">
            <img src={p.img} alt={p.name} className="w-20 h-20 rounded object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.sku} • {p.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${p.price.toFixed(2)}</div>
                  <div className={`text-sm ${p.stock === 0 ? "text-red-500" : "text-gray-600"}`}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 px-3 py-2 border rounded" onClick={() => onEdit(p)}>Edit</button>
                {/* <button className="flex-1 px-3 py-2 border rounded">Delete</button> */}
                
              
              </div>
            </div>
          </div>
        ))}
      </div>

       {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="text-gray-600">
          Showing {total ? start + 1 : 0} - {Math.min(start + perPage, total)} of {total}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">First</button>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <div className="px-3 py-1 border rounded">{page} / {pages}</div>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          <button onClick={() => setPage(pages)} disabled={page === pages} className="px-3 py-1 border rounded disabled:opacity-50">Last</button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
