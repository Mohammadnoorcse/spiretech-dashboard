import React, { useMemo, useState } from "react";

const ProductList = ({ products, categoriesOption = [], onEdit, onDelete }) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  // ✅ Helper: Get category name(s)
  const getCategoryName = (p) => {
    try {
      const parsed = JSON.parse(p.categories_id);

      // Case 1: Array of objects
      if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "object") {
        return parsed.map((c) => c.name).join(", ");
      }

      // Case 2: Array of IDs (like [1,2])
      if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "number") {
        const matched = parsed
          .map((id) => categoriesOption.find((c) => c.id === id)?.name)
          .filter(Boolean);
        return matched.length ? matched.join(", ") : "—";
      }

      return "—";
    } catch {
      return "—";
    }
  };

  // ✅ Filtering + Sorting
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let arr = products.filter((p) => {
      const categoryName = getCategoryName(p).toLowerCase();

      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        categoryName.includes(q)
      );
    });

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
  }, [query, sortBy, sortDir, products, categoriesOption]);

  // ✅ Pagination
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  return (
    <div>
      {/* 🔍 Search + Per Page */}
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

      {/* 🧾 Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("name")}>
                Name {sortBy === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("sku")}>
                SKU {sortBy === "sku" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-3">Category</th>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("stock")}>
                Stock {sortBy === "stock" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length > 0 ? (
              pageItems.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={
                        p.images && p.images.length > 0
                          ? `${import.meta.env.VITE_API_BASE_URL}storage/${p.images[0]}`
                          : "/placeholder.jpg"
                      }
                      alt={p.name}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                      className="w-10 h-10 rounded object-cover"
                    />
                    {p.name}
                  </td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{getCategoryName(p)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                      onClick={() => onEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 border rounded text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
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
