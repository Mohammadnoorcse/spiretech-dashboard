import React, { useState } from 'react';
import { FaRegBell } from "react-icons/fa6";
import { CiUser, CiSettings, CiMenuBurger } from "react-icons/ci";
import Sidebar from './Sidebar';

const data = {
  logoUrl: "https://mnmlifestyle.com/public/uploads/settings/1757592395-gemini_generated_image_ykrw48ykrw48ykrw.webp",
  logoWidth: "5rem",
  logoHeight: "auto",
  textColor: "#FFFFFF",
  bgColor: "#45AEF1",
  iconBgColor: "#5DB9F2",
};

const Topbar = ({ activeItem, setActiveItem }) => {
  const [showSidebar, setShowSidebar] = useState(false); // ⬅️ Toggle state

  const {
    logoUrl,
    logoWidth,
    logoHeight,
    textColor,
    bgColor,
    iconBgColor,
  } = data;

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="w-full flex flex-col relative" style={{ backgroundColor: bgColor }}>
      {/* Topbar Row */}
      <div className="flex justify-between items-center px-4 py-1">
        <div className="flex items-center gap-2">
          <span onClick={toggleSidebar}
            style={{ color: textColor, fontWeight: 'bold' }}
            className='cursor-pointer text-xl lg:hidden block'
          >
            <CiMenuBurger />
          </span>
          <img src={logoUrl} alt="logo" style={{ width: logoWidth, height: logoHeight }} />
          <span style={{ color: textColor, fontWeight: 'bold' }}>
            Flox Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md text-base" style={{ backgroundColor: iconBgColor, color: textColor }}>
            <FaRegBell />
          </span>
          <span className="p-1 rounded-md text-base" style={{ backgroundColor: iconBgColor, color: textColor }}>
            <CiUser />
          </span>
          <span className="p-1 rounded-md text-base" style={{ backgroundColor: iconBgColor, color: textColor }}>
            <CiSettings />
          </span>
        </div>
      </div>

      {/* Conditional Sidebar rendering under the Topbar */}
      {showSidebar && (
        <div className='absolute top-full left-0 w-[15rem] h-screen z-50 shadow-lg lg:hidden block'>
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        </div>
      )}
    </div>
  );
};

export default Topbar;
