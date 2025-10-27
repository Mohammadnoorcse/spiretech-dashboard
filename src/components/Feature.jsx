import React, { useState } from "react";
import HeaderImage from "./Feature/Dashboard/HeaderImage";
import ThemeColorsPage from "./Feature/Dashboard/ThemeColorsPage";

// 🔹 Dashboard feature components
const DashboardFeature = () => (
  <div className="mt-4 p-3 border rounded bg-gray-50">
    <h2 className="font-semibold mb-2">Dashboard Features</h2>
    <ul className="list-disc ml-5 text-sm">
      <li>Overview Stats</li>
      <li>Revenue Chart</li>
      <li>Recent Orders</li>
    </ul>
  </div>
);

const SidebarFeature = () => (
  <div className="mt-4 p-3 border rounded bg-gray-50">
    <h2 className="font-semibold mb-2">Sidebar Features</h2>
    <ul className="list-disc ml-5 text-sm">
      <li>Navigation Links</li>
      <li>Collapse Button</li>
      <li>Theme Switch</li>
    </ul>
  </div>
);

const TopbarFeature = () => (
  <div className="mt-4 p-3 border rounded bg-gray-50">
    <h2 className="font-semibold mb-2">Topbar Features</h2>
    <ul className="list-disc ml-5 text-sm">
      <li>Search Bar</li>
      <li>Notification Bell</li>
      <li>User Profile Menu</li>
    </ul>
  </div>
);

// 🔹 Website feature components
const WebsiteHome = () => (
  <div className="mt-4 p-3 border rounded bg-gray-50">
    <h2 className="font-semibold mb-2">Website Home Features</h2>
    <ul className="list-disc ml-5 text-sm">
      <li>Hero Section</li>
      <li>Featured Products</li>
      <li>Testimonials</li>
    </ul>
  </div>
);

const WebsiteProduct = () => (
  <div className="mt-4 p-3 border rounded bg-gray-50">
    <h2 className="font-semibold mb-2">Product Page Features</h2>
    <ul className="list-disc ml-5 text-sm">
      <li>Image Gallery</li>
      <li>Filter & Sort Options</li>
      <li>Customer Reviews</li>
    </ul>
  </div>
);

const WebsiteContact = () => (
  <div className="mt-4 p-3 border rounded bg-gray-50">
    <h2 className="font-semibold mb-2">Contact Page Features</h2>
    <ul className="list-disc ml-5 text-sm">
      <li>Contact Form</li>
      <li>Map Integration</li>
      <li>Social Links</li>
    </ul>
  </div>
);

// 🔹 Main component
const Feature = () => {
  const [activeDashboardTab, setActiveDashboardTab] = useState("Dashboard");
  const [activeWebsiteTab, setActiveWebsiteTab] = useState("Home");

  // Dashboard tab renderer
  const renderDashboard = () => {
    switch (activeDashboardTab) {
      case "Dashboard":
        return <HeaderImage />;
      case "Sidebar":
        return <ThemeColorsPage />;
      case "Topbar":
        return <TopbarFeature />;
      default:
        return null;
    }
  };

  // Website tab renderer
  const renderWebsite = () => {
    switch (activeWebsiteTab) {
      case "Home":
        return <WebsiteHome />;
      case "Product":
        return <WebsiteProduct />;
      case "Contact":
        return <WebsiteContact />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-4">
      {/* 🔸 Dashboard Feature Section */}
      <h1 className="font-medium text-lg mb-3">Dashboard Feature List</h1>

      <div className="flex gap-3 items-center mt-4 flex-wrap">
        {["Dashboard", "Sidebar", "Topbar"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveDashboardTab(tab)}
            className={`px-4 py-1 rounded-md text-sm font-medium ${
              activeDashboardTab === tab
                ? "bg-amber-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">{renderDashboard()}</div>

      {/* 🔸 Website Feature Section */}
      <h1 className="font-medium text-lg mb-3 mt-10">Website Feature List</h1>

      <div className="flex gap-3 items-center mt-4 flex-wrap">
        {["Home", "Product", "Contact"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveWebsiteTab(tab)}
            className={`px-4 py-1 rounded-md text-sm font-medium ${
              activeWebsiteTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">{renderWebsite()}</div>
    </div>
  );
};

export default Feature;
