import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import { LuSettings2 } from "react-icons/lu";
import { MdOutlineSettingsSystemDaydream, MdOutlineLocalShipping, MdOutlineSettingsInputComposite } from "react-icons/md";
import Multiselect from "multiselect-react-dropdown";

// Shared Multiselect styles
const multiselectStyle = {
  chips: { background: "#2563eb" },
  searchBox: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#555",
  },
};

// Static options
const taxOption = [
  { name: "Taxable", id: 1 },
  { name: "Shipping Only", id: 2 },
  { name: "None", id: 3 },
];
const shoppingOption = [
  { name: "80", id: 1 },
  { name: "120", id: 2 },
];
const colorOption = [
  { name: "Red", id: 1 },
  { name: "Blue", id: 2 },
];
const sizeOption = [
  { name: "Small", id: 1 },
  { name: "Large", id: 2 },
];
const discountOptions = [
  { label: "No Discount", value: "" },
  { label: "5% Off", value: "5" },
  { label: "10% Off", value: "10" },
  { label: "20% Off", value: "20" },
  { label: "30% Off", value: "30" },
];
const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
  { label: "Out of Stock", value: "out_of_stock" },
];
const currencyOptions = [
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "BDT (৳)", value: "BDT" },
  { label: "INR (₹)", value: "INR" },
];

const EditProduct = ({ existingProduct, onSave }) => {
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("General");

  // State initialization with existing product data
  const [product, setProduct] = useState({
    name: "",
    shortDesc: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    taxStatus: [],
    sku: "",
    stock: "",
    shipping: [],
    color: [],
    size: [],
    categories: [],
    brands: [],
    section: [],
    discount: "",
    status: "",
    currency: "",
  });

  const [images, setImages] = useState([]); // local previews
  const [existingImages, setExistingImages] = useState([]); // images from API

  // Load existing product on mount
  useEffect(() => {
    if (existingProduct) {
      setProduct({
        ...existingProduct,
        taxStatus: existingProduct.taxStatus || [],
        shipping: existingProduct.shipping || [],
        color: existingProduct.color || [],
        size: existingProduct.size || [],
        categories: existingProduct.categories || [],
        brands: existingProduct.brands || [],
        section: existingProduct.section || [],
      });
      setExistingImages(existingProduct.images || []);
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (key, selectedList) => {
    setProduct((prev) => ({ ...prev, [key]: selectedList }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...filesWithPreview]);
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...product,
      description: editorRef.current?.getData?.() || "",
      newImages: images,
      existingImages,
    };
    console.log("Updating Product:", dataToSend);
    // Example: axios.put(`/api/products/${product._id}`, dataToSend)
  };

  const tabs = [
    { name: "General", icon: <LuSettings2 /> },
    { name: "Inventory", icon: <MdOutlineSettingsSystemDaydream /> },
    { name: "Shipping", icon: <MdOutlineLocalShipping /> },
    { name: "Attributes", icon: <MdOutlineSettingsInputComposite /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="flex flex-col gap-4">
            <Input label="Regular Price" name="regularPrice" value={product.regularPrice} onChange={handleChange} />
            <Input label="Sale Price" name="salePrice" value={product.salePrice} onChange={handleChange} />
            <SelectMulti
              label="Tax Status"
              options={taxOption}
              selected={product.taxStatus}
              onChange={(list) => handleMultiSelect("taxStatus", list)}
            />
          </div>
        );
      case "Inventory":
        return (
          <div className="flex flex-col gap-4">
            <Input label="SKU" name="sku" value={product.sku} onChange={handleChange} />
            <Input label="Stock" name="stock" value={product.stock} onChange={handleChange} />
          </div>
        );
      case "Shipping":
        return (
          <SelectMulti
            label="Shipping"
            options={shoppingOption}
            selected={product.shipping}
            onChange={(list) => handleMultiSelect("shipping", list)}
          />
        );
      case "Attributes":
        return (
          <div className="flex flex-col gap-4">
            <SelectMulti
              label="Color"
              options={colorOption}
              selected={product.color}
              onChange={(list) => handleMultiSelect("color", list)}
            />
            <SelectMulti
              label="Size"
              options={sizeOption}
              selected={product.size}
              onChange={(list) => handleMultiSelect("size", list)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-base font-bold">Edit Product</h1>
      <form onSubmit={handleSubmit} className="mt-4 w-full flex md:flex-row flex-col gap-4">
        {/* LEFT */}
        <div className="md:w-3/4 w-full border border-gray-300 p-4 rounded-lg flex flex-col gap-4">
          <Input label="Product Name" name="name" value={product.name} onChange={handleChange} required />
          <Textarea label="Short Description" name="shortDesc" value={product.shortDesc} onChange={handleChange} />
          <div>
            <h3 className="text-sm mb-1">Product Description</h3>
            <Editor ref={editorRef} holderId="edit-product-description-editor" data={product.description} />
          </div>

          {/* Tabs */}
          <div className="flex flex-col border rounded-md">
            <h3 className="text-sm pl-2 py-2 border-b font-semibold">Product Data</h3>
            <div className="flex">
              <div className="w-1/4 flex flex-col">
                {tabs.map((tab) => (
                  <div
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex gap-2 pl-2 py-2 text-sm items-center cursor-pointer border-b border-r ${
                      activeTab === tab.name
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "bg-[#FAFAFA] text-[#555]"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </div>
                ))}
              </div>
              <div className="w-3/4 pl-3 py-2">{renderContent()}</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:w-1/4 w-full border border-gray-300 p-4 rounded-lg flex flex-col gap-4 shadow">
          <div>
            <label className="block mb-2 text-sm font-medium">Product Images</label>
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img.url || img} alt="" className="w-full h-12 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* New Image Upload */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image.preview} alt="" className="w-full h-12 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meta Info */}
          <SelectMulti
            label="Categories"
            options={taxOption}
            selected={product.categories}
            onChange={(list) => handleMultiSelect("categories", list)}
          />
          <SelectMulti
            label="Brands"
            options={taxOption}
            selected={product.brands}
            onChange={(list) => handleMultiSelect("brands", list)}
          />
          <SelectMulti
            label="Section"
            options={taxOption}
            selected={product.section}
            onChange={(list) => handleMultiSelect("section", list)}
          />

          <Select label="Discount" name="discount" value={product.discount} onChange={handleChange} options={discountOptions} />
          <Select label="Status" name="status" value={product.status} onChange={handleChange} options={statusOptions} />
          <Select label="Currency" name="currency" value={product.currency} onChange={handleChange} options={currencyOptions} />

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

/* Reusable components */
const Input = ({ label, name, value, onChange, required }) => (
  <div className="flex flex-col gap-1">
    <h3 className="text-sm">
      {label}
      {required && <span className="text-red-600">*</span>}
    </h3>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full py-2 px-3 text-sm border border-gray-300 rounded-md outline-none"
    />
  </div>
);

const Textarea = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <h3 className="text-sm">{label}</h3>
    <textarea
      name={name}
      rows={4}
      value={value}
      onChange={onChange}
      className="w-full py-2 px-3 text-sm border border-gray-300 rounded-md outline-none"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options = [] }) => (
  <div className="flex flex-col gap-1">
    <h3 className="text-sm">{label}</h3>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md text-sm py-2 px-2 outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const SelectMulti = ({ label, options, selected, onChange }) => (
  <div className="flex flex-col gap-1">
    <h3 className="text-sm">{label}</h3>
    <Multiselect
      options={options}
      selectedValues={selected}
      onSelect={onChange}
      onRemove={onChange}
      displayValue="name"
      placeholder={`Select ${label}`}
      avoidHighlightFirstOption
      style={multiselectStyle}
    />
  </div>
);

export default EditProduct;
