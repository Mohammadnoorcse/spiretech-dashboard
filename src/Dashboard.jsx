import React, { useState } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import ProductPage from './components/ProductPage';
import Category from './components/Category';
import Brand from './components/Brand';
import Color from './components/Color';
import Size from './components/Size';
import Discount from './components/Discount';
import Coupon from './components/Coupon';
import Section from './components/Section';

// Example dummy components for different sections
// const DashboardHome = () => <div>📊 Dashboard Overview</div>;
// const ProductList = () => <div>📦 Product List</div>;
// const AddProduct = () => <div>➕ Add New Product</div>;
// const Categories = () => <div>🏷️ Categories</div>;
const FeatureList = () => <div>⭐ Feature List</div>;
const AddFeature = () => <div>➕ Add Feature</div>;
const MobileApp = () => <div>📱 Mobile App</div>;
const WebApp = () => <div>💻 Web App</div>;


const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardHome />;
      case 'List':
        return <ProductPage />;
      case 'Add New':
        return <AddProduct />;
      case 'Categories':
        return <Category />;
      case 'Brand':
        return <Brand />;
      case 'Color':
        return <Color />;
      case 'Size':
        return <Size />;
      case 'Discount':
        return <Discount />;
      case 'Coupon':
        return <Coupon />;
      case 'Section':
        return <Section />;
      default:
        return <div>🔍 Page Not Found</div>;
    }
  };

  return (
    <div className='w-full flex flex-col h-screen overflow-hidden'>
      {/* Topbar */}
      <Topbar activeItem={activeItem} setActiveItem={setActiveItem}/>

      {/* Body Layout */}
      <div className='w-full flex flex-1 overflow-hidden gap-4'>
        {/* Sidebar */}
        <div className='lg:w-1/6 lg:block hidden  h-full overflow-auto'>
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        </div>

        {/* Main Content */}
        <div className='lg:w-5/6 w-full border border-amber-500 p-2 overflow-auto'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
