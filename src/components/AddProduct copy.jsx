import React, { useRef, useState } from "react";
import Editor from "./Editor";
import { LuSettings2 } from "react-icons/lu";
import { MdOutlineSettingsSystemDaydream } from "react-icons/md";
import { MdOutlineLocalShipping } from "react-icons/md";
import { MdOutlineSettingsInputComposite } from "react-icons/md";
import Multiselect from "multiselect-react-dropdown";
import { color } from "chart.js/helpers";

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
  { name: "80", id: 1 },
  { name: "120", id: 2 },
];
const sizeOption = [
  { name: "80", id: 1 },
  { name: "120", id: 2 },
];

const AddProduct = () => {
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("General");
  const [taxselected, setTaxSelected] = useState([]);
  const [shoppingselected, setShoppingSelected] = useState([]);
  const [colorselected, setColorSelected] = useState([]);
  const [sizeselected, setSizeSelected] = useState([]);

  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Optionally, you can filter or limit files here

    // Create an array of preview URLs
    const filesWithPreview = files.map((file) => {
      return {
        file,
        preview: URL.createObjectURL(file),
      };
    });

    setImages((prevImages) => [...prevImages, ...filesWithPreview]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onTaxSelect = (selectedList, selectedItem) => {
    setTaxSelected(selectedList);
  };

  const onTaxRemove = (selectedList, removedItem) => {
    setTaxSelected(selectedList);
  };

  const onShoppingSelect = (selectedList, selectedItem) => {
    setShoppingSelected(selectedList);
  };

  const onShoppingRemove = (selectedList, removedItem) => {
    setShoppingSelected(selectedList);
  };
  const onColorSelect = (selectedList, selectedItem) => {
    setColorSelected(selectedList);
  };

  const onColorRemove = (selectedList, removedItem) => {
    setColorSelected(selectedList);
  };
  const onSizeSelect = (selectedList, selectedItem) => {
    setSizeSelected(selectedList);
  };

  const onSizeRemove = (selectedList, removedItem) => {
    setSizeSelected(selectedList);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <h3 className="text-[12px] w-[15%]">regular price</h3>
              <input
                type="text"
                className="w-[80%] py-2 px-4 text-sm border border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex gap-4 items-center">
              <h3 className="text-[12px] w-[15%]">sell price</h3>
              <input
                type="text"
                className="w-[80%] py-2 px-4 text-sm border border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex gap-4 items-center">
              <h3 className="text-[12px] w-[15%]">tax status</h3>
              <div className="w-[80%]">
                <Multiselect
                  options={taxOption}
                  selectedValues={taxselected}
                  onSelect={onTaxSelect}
                  onRemove={onTaxRemove}
                  displayValue="name"
                  placeholder="Select tax options"
                  avoidHighlightFirstOption={true}
                  style={{
                    chips: { background: "#2563eb" },
                    searchBox: {
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      size: "12px",
                      color: "#555",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );
      case "Inventory":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <h3 className="text-[12px] w-[15%]">SkU</h3>
              <input
                type="text"
                className="w-[80%] py-2 px-4 text-sm border border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex gap-4 items-center">
              <h3 className="text-[12px] w-[15%]">stock</h3>
              <input
                type="text"
                className="w-[80%] py-2 px-4 text-sm border border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>
        );
      case "Shipping":
        return (
          <div className="flex gap-4 items-center">
            <h3 className="text-[12px] w-[15%]">shipping</h3>
            <div className="w-[80%]">
              <Multiselect
                options={shoppingOption}
                selectedValues={shoppingselected}
                onSelect={onShoppingSelect}
                onRemove={onShoppingRemove}
                displayValue="name"
                placeholder="Select shopping options"
                avoidHighlightFirstOption={true}
                style={{
                  chips: { background: "#2563eb" },
                  searchBox: {
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    size: "12px",
                    color: "#555",
                  },
                }}
              />
            </div>
          </div>
        );
      case "Attributes":
        return (
          <div className="w-full flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <h3 className="text-[12px] w-[15%]">color</h3>
              <div className="w-[80%]">
                <Multiselect
                  options={colorOption}
                  selectedValues={colorselected}
                  onSelect={onColorSelect}
                  onRemove={onColorRemove}
                  displayValue="name"
                  placeholder="Select Color options"
                  avoidHighlightFirstOption={true}
                  style={{
                    chips: { background: "#2563eb" },
                    searchBox: {
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      size: "12px",
                      color: "#555",
                    },
                  }}
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <h3 className="text-[12px] w-[15%]">size</h3>
              <div className="w-[80%]">
                <Multiselect
                  options={sizeOption}
                  selectedValues={sizeselected}
                  onSelect={onSizeSelect}
                  onRemove={onSizeRemove}
                  displayValue="name"
                  placeholder="Select Size options"
                  avoidHighlightFirstOption={true}
                  style={{
                    chips: { background: "#2563eb" },
                    searchBox: {
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      size: "12px",
                      color: "#555",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { name: "General", icon: <LuSettings2 /> },
    { name: "Inventory", icon: <MdOutlineSettingsSystemDaydream /> },
    { name: "Shipping", icon: <MdOutlineLocalShipping /> },
    { name: "Attributes", icon: <MdOutlineSettingsInputComposite /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-base font-bold">Add new product</h1>
      <form action="" className="mt-4 w-full flex gap-4">
        <div className="w-3/4 border border-amber-400 flex flex-col gap-4">
          <div className="w-full  flex flex-col gap-1">
            <h3 className="text-sm">
              Product Name<span className="text-red-700">*</span>
            </h3>
            <input
              type="text"
              className="w-full py-2 px-4 text-sm border border-gray-300 rounded-md outline-none"
            />
          </div>
          <div className="w-full  flex flex-col gap-1">
            <h3 className="text-sm">Short description</h3>
            <textarea
              rows={5}
              className="w-full py-2 px-4 text-sm border border-gray-300 rounded-md outline-none"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <h3 className="text-sm">Product description</h3>
            <Editor ref={editorRef} holderId="product-description-editor" />
          </div>

          <div className="flex flex-col gap-4 border border-gray-300">
            <h3 className="text-sm pl-2  py-2 border-b border-gray-300">
              Product Data
            </h3>
            <div className="w-full flex">
              <div className="w-1/4 flex flex-col">
                {tabs.map((tab) => (
                  <div
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex gap-2 pl-2 py-1 text-sm items-center border-r border-t border-gray-300 cursor-pointer ${
                      activeTab === tab.name
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "bg-[#FAFAFA] text-[#555]"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </div>
                ))}
              </div>
              <div className="w-3/4 pl-2">{renderContent()}</div>
            </div>
          </div>
        </div>
        <div className="w-1/4 flex flex-col border border-red-800 shadow">
          <div className="max-w-md mx-auto p-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
            />

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`upload-${index}`}
                      className="w-full h-12 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      aria-label="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

             <div className="flex flex-col p-4">
              <h3 className="block mb-2 text-sm font-medium text-gray-700">Categories</h3>
              <div className="w-full">
                <Multiselect
                  options={taxOption}
                  selectedValues={taxselected}
                  onSelect={onTaxSelect}
                  onRemove={onTaxRemove}
                  displayValue="name"
                  placeholder="Select tax options"
                  avoidHighlightFirstOption={true}
                  style={{
                    chips: { background: "#2563eb" },
                    searchBox: {
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      size: "12px",
                      color: "#555",
                    },
                  }}
                />
              </div>
            </div>
             <div className="flex flex-col p-4">
              <h3 className="block mb-2 text-sm font-medium text-gray-700">Brands</h3>
              <div className="w-full">
                <Multiselect
                  options={taxOption}
                  selectedValues={taxselected}
                  onSelect={onTaxSelect}
                  onRemove={onTaxRemove}
                  displayValue="name"
                  placeholder="Select tax options"
                  avoidHighlightFirstOption={true}
                  style={{
                    chips: { background: "#2563eb" },
                    searchBox: {
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      size: "12px",
                      color: "#555",
                    },
                  }}
                />
              </div>
            </div>
             <div className="flex flex-col p-4">
              <h3 className="block mb-2 text-sm font-medium text-gray-700">section</h3>
              <div className="w-full">
                <Multiselect
                  options={taxOption}
                  selectedValues={taxselected}
                  onSelect={onTaxSelect}
                  onRemove={onTaxRemove}
                  displayValue="name"
                  placeholder="Select tax options"
                  avoidHighlightFirstOption={true}
                  style={{
                    chips: { background: "#2563eb" },
                    searchBox: {
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      size: "12px",
                      color: "#555",
                    },
                  }}
                />
              </div>
            </div>
             <div className="flex flex-col p-4">
              <h3 className="block mb-2 text-sm font-medium text-gray-700">Discount</h3>
              <div className="w-full">
                <select name="cars" id="cars" className="w-full border border-[#ccc] rounded-[6px] text-[12px] text-[#555] py-2 px-1 font-medium outline-none">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
              </div>
            </div>
             <div className="flex flex-col p-4">
              <h3 className="block mb-2 text-sm font-medium text-gray-700">Status</h3>
              <div className="w-full">
                <select name="cars" id="cars" className="w-full border border-[#ccc] rounded-[6px] text-[12px] text-[#555] py-2 px-1 font-medium outline-none">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
              </div>
            </div>
             <div className="flex flex-col p-4">
              <h3 className="block mb-2 text-sm font-medium text-gray-700">Currency</h3>
              <div className="w-full">
                <select name="cars" id="cars" className="w-full border border-[#ccc] rounded-[6px] text-[12px] text-[#555] py-2 px-1 font-medium outline-none">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
              </div>
            </div>
            <button>Submit</button>

        </div>
      </form>
    </div>
  );
};

export default AddProduct;
