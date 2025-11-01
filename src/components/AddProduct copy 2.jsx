import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import { LuSettings2 } from "react-icons/lu";
import {
  MdOutlineSettingsSystemDaydream,
  MdOutlineLocalShipping,
  MdOutlineSettingsInputComposite,
} from "react-icons/md";
import Multiselect from "multiselect-react-dropdown";
import axios from "axios";
import api from "../api/axios";

const multiselectStyle = {
  chips: { background: "#2563eb" },
  searchBox: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#555",
  },
};

const taxOption = [
  { name: "Taxable", id: 1 },
  { name: "Shipping Only", id: 2 },
  { name: "None", id: 3 },
];

const statusOptions = [
  { label: "Draft", value: "1" },
  { label: "Published", value: "2" },
  { label: "Archived", value: "3" },
  { label: "Out of Stock", value: "out_of_stock" },
];

const currencyOptions = [
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "BDT (৳)", value: "BDT" },
  { label: "INR (₹)", value: "INR" },
];

const AddProduct = () => {
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("General");

  const [colorOption, setColorOption] = useState([]);
  const [sizeOption, setSizeOption] = useState([]);
  const [brandsOption, setBrandsOption] = useState([]);
  const [categoriesOption, setCategoriesOption] = useState([]);
  const [sectionsOption, setSectionsOption] = useState([]);
  const [discountOptions, setDiscountOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState([]);

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
    discount: "", // will store id
    status: "",
    currency: "",
  });

  const [images, setImages] = useState([]);

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

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchColors();
    fetchBrands();
    fetchCategories();
    fetchSections();
    fetchDiscounts();
    fetchShipping();
    fetchSizes();
  }, []);

  const fetchColors = async () => {
    try {
      const res = await api.get("/api/color");
      setColorOption(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await api.get("/api/size");
      setSizeOption(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/brand");
      setBrandsOption(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/category");
      setCategoriesOption(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await api.get("/api/sections");
      setSectionsOption(res.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const res = await api.get("/api/discounts");
      setDiscountOptions(res.data);
    } catch (err) {
      console.error("Error fetching discounts:", err);
    }
  };

  const fetchShipping = async () => {
    try {
      const res = await api.get("/api/shipping");
      setShippingOption(res.data);
    } catch (err) {
      console.error("Error fetching shipping:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const editorData = await editorRef.current?.save();
      formData.append("description", JSON.stringify(editorData || {}));

      formData.append("name", product.name);
      formData.append("short_desc", product.shortDesc);
      formData.append("regular_price", product.regularPrice);
      formData.append("sale_price", product.salePrice);
      formData.append("sku", product.sku);
      formData.append("stock", product.stock);
      formData.append("status", product.status);
      formData.append("currency", product.currency);

      // 👇 FIXED: Properly send discount_id (id from dropdown)
      formData.append("discount_id", product.discount || "");

      formData.append("tax_status_id", JSON.stringify(product.taxStatus));
      formData.append("shipping_id", JSON.stringify(product.shipping));
      formData.append("color_id", JSON.stringify(product.color));
      formData.append("size_id", JSON.stringify(product.size));
      formData.append("categories_id", JSON.stringify(product.categories));
      formData.append("brands_id", JSON.stringify(product.brands));
      formData.append("section_id", JSON.stringify(product.section));

      images.forEach((img) => formData.append("images[]", img.file));

      const res = await axios.post("http://127.0.0.1:8000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product created successfully!");
      console.log("Created:", res.data);

      setProduct({
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
      setImages([]);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to create product!");
    }
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
            options={shippingOption}
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
      <h1 className="text-base font-bold">Add New Product</h1>
      <form onSubmit={handleSubmit} className="mt-4 w-full flex md:flex-row flex-col gap-4">
        <div className="md:w-3/4 w-full border border-gray-300 p-4 rounded-lg flex flex-col gap-4">
          <Input label="Product Name" name="name" value={product.name} onChange={handleChange} required />
          <Textarea label="Short Description" name="shortDesc" value={product.shortDesc} onChange={handleChange} />
          <div>
            <h3 className="text-sm mb-1">Product Description</h3>
            <Editor ref={editorRef} holderId="product-description-editor" />
          </div>

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

        <div className="md:w-1/4 w-full border border-gray-300 p-4 rounded-lg flex flex-col gap-4 shadow">
          <ImageUpload images={images} onChange={handleImageChange} removeImage={removeImage} />

          <SelectMulti
            label="Categories"
            options={categoriesOption}
            selected={product.categories}
            onChange={(list) => handleMultiSelect("categories", list)}
          />
          <SelectMulti
            label="Brands"
            options={brandsOption}
            selected={product.brands}
            onChange={(list) => handleMultiSelect("brands", list)}
          />
          <SelectMulti
            label="Section"
            options={sectionsOption}
            selected={product.section}
            onChange={(list) => handleMultiSelect("section", list)}
          />

          {/* ✅ Fixed discount select */}
          <Selectdiscount
            label="Discount"
            name="discount"
            value={product.discount}
            onChange={handleChange}
            options={discountOptions}
          />

          <Select label="Status" name="status" value={product.status} onChange={handleChange} options={statusOptions} />
          <Select label="Currency" name="currency" value={product.currency} onChange={handleChange} options={currencyOptions} />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

/* Reusable Components */
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
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/* ✅ Discount Select - uses id and name */
const Selectdiscount = ({ label, name, value, onChange, options = [] }) => (
  <div className="flex flex-col gap-1">
    <h3 className="text-sm">{label}</h3>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md text-sm py-2 px-2 outline-none"
    >
      <option value="">Select Discount</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
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

const ImageUpload = ({ images, onChange, removeImage }) => (
  <div>
    <label className="block mb-2 text-sm font-medium">Upload Images</label>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={onChange}
      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    {images.length > 0 && (
      <div className="mt-4 grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img src={image.preview} alt="" className="w-full h-12 object-cover rounded" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AddProduct;
