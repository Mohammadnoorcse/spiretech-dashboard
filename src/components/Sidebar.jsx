import React, { useState } from 'react';
import { LuDot } from "react-icons/lu";
import { FaDesktop, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { MdOutlineFeaturedVideo } from "react-icons/md";
import { RiProductHuntLine } from "react-icons/ri";
import { FaFirstOrderAlt } from "react-icons/fa";

const Sidebar = ({ activeItem, setActiveItem, styleConfig }) => {
  const [openSection, setOpenSection] = useState(null);

  const {
    bgColor = '#0C1A32',
    textColor = '#FFFFFF',
    logoUrl = 'https://t4.ftcdn.net/jpg/02/98/28/89/360_F_298288984_8i0PB7s9aWPzi1LeuNGGrnjXkmXRpcZn.jpg',
    hoverColor = '#1e3a5f',
    activeColor = '#3182CE',
    borderColor = 'border-gray-600',
  } = styleConfig || {};

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <FaDesktop />,
      subItems: []
    },
    {
      id: 'product',
      title: 'Product',
      icon: <RiProductHuntLine />,
      subItems: ['Add New','List',  'Categories','Brand','Color','Size','discount','Coupon','Review','section']
    },
    {
      id: 'order',
      title: 'Orders',
      icon: <FaFirstOrderAlt />,
      subItems: ['Order List', 'Add New', 'Categories']
    },
    {
      id: 'features',
      title: 'Features',
      icon: <MdOutlineFeaturedVideo />,
      subItems: ['Feature List', 'Add Feature']
    },
    {
      id: 'apps',
      title: 'Apps',
      icon: <MdOutlineFeaturedVideo />,
      subItems: ['Mobile App', 'Web App']
    }
  ];

  const toggleSection = (item) => {
    if (item.subItems.length === 0) {
      setActiveItem(item.id);
    } else {
      setOpenSection((prev) => (prev === item.id ? null : item.id));
    }
  };

  return (
    <div className='w-full h-full flex flex-col p-2' style={{ backgroundColor: bgColor }}>
      {/* Logo and User */}
      <div className='flex gap-1 items-center'>
        {logoUrl && (
          <img src={logoUrl} alt="logo" className='w-[2.5rem] h-[2.5rem] rounded-md' />
        )}
        <div className='flex flex-col'>
          <span className='font-medium flex' style={{ color: textColor }}>
            <span className='text-2xl text-green-500'><LuDot /></span>Noor
          </span>
        </div>
      </div>

      <div className={`border-t mt-4 mb-2 ${borderColor}`}></div>

      {/* Menu */}
      <div className='w-full h-full overflow-auto scrollbar-hide flex flex-col gap-1'>
        {menuItems.map((item) => (
          <div key={item.id} className='flex flex-col'>
            <div
              className='w-full py-2 px-2 flex justify-between items-center cursor-pointer'
              onClick={() => toggleSection(item)}
              style={{
                backgroundColor: activeItem === item.id ? activeColor : 'transparent',
                color: textColor
              }}
            >
              <div className='flex gap-2 items-center'>
                <span className='text-sm'>{item.icon}</span>
                <span>{item.title}</span>
              </div>
              {item.subItems.length > 0 && (
                <span>{openSection === item.id ? <FaAngleUp /> : <FaAngleDown />}</span>
              )}
            </div>

            {/* Sub Items */}
            {openSection === item.id && item.subItems.length > 0 && (
              <div className='pl-7 flex flex-col gap-1 text-sm'>
                {item.subItems.map((subItem, index) => (
                  <div
                    key={index}
                    className='py-1 px-2 rounded cursor-pointer'
                    style={{
                      backgroundColor: activeItem === subItem ? activeColor : 'transparent',
                      color: textColor
                    }}
                    onClick={() => setActiveItem(subItem)}
                    onMouseEnter={(e) => {
                      if (activeItem !== subItem) {
                        e.currentTarget.style.backgroundColor = hoverColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeItem !== subItem) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {subItem}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
