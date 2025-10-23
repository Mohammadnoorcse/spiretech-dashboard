import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { VscLayoutMenubar } from "react-icons/vsc";
import { FaUserFriends } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { Line } from "react-chartjs-2";
import { MdOutlineGraphicEq } from "react-icons/md";
import { FaBasketShopping } from "react-icons/fa6";
import { BsFileEarmarkBarGraph } from "react-icons/bs";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Line chart options
const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Sales Overview',
    },
  },
};

// Chart data
const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Sales",
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.4,
      fill: true
    },
  ],
};


const orderdata = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Total Orders",
      data: [100, 120, 150, 130, 160, 170, 180],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Confirmed Orders",
      data: [90, 110, 140, 120, 150, 160, 170],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Cancelled Orders",
      data: [10, 10, 10, 10, 10, 10, 10],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const orderoptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: true,
      text: 'Order Summary (Monthly)',
    },
  },
};



const DashboardHome = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Stat boxes */}
      <div className="w-full grid sm:grid-cols-4 grid-cols-2 gap-4">
        {[
          { color: "#E03656", label: "User", icon: <FaUserAlt /> },
          { color: "#FFB22B", label: "Product", icon: <VscLayoutMenubar /> },
          { color: "#45AEF1", label: "Order", icon: <FaUserFriends /> },
          { color: "#7460EE", label: "Cancel", icon: <ImCancelCircle /> },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`w-full shadow p-4 rounded flex justify-between items-center`}
            style={{ backgroundColor: item.color }}
          >
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-white">7878</span>
              <span className="text-sm text-gray-600 font-bold">{item.label}</span>
            </div>
            <span className="text-4xl text-white">{item.icon}</span>
          </div>
        ))}
      </div>

      {/* Chart section */}
      <div className="w-full flex sm:flex-row flex-col gap-4 mt-4">
        <div className="sm:w-1/2 w-full shadow bg-white p-2 rounded flex flex-col gap-4">
          
          <Line data={data} options={options} />
        </div>
        <div className="sm:w-1/2 w-full shadow bg-white p-2 rounded flex flex-col gap-4">
          <Line data={orderdata} options={orderoptions} />
        </div>
      </div>

      {/* third section */}

      <div className="w-full flex gap-4 mt-4">
        <div className="w-1/4 sm:flex hidden flex-col gap-4">
            <div className="w-full bg-[#FFF8EA] p-5 shadow rounded flex flex-col gap-3 justify-center">
                <MdOutlineGraphicEq className="text-2xl text-[#FFB22B]" />
                <span className="text-xl font-bold text-[#FFB22B]">Sales Flat</span>
                <p className="text-sm text-gray-400">19% up for sale</p>
            </div>
            <div className="w-full bg-white p-5 shadow rounded flex flex-col gap-3 justify-center">
                <FaBasketShopping className="text-2xl text-[#45AEF1]" />
                <span className="text-xl font-bold text-[#45AEF1]">Shopping Cart</span>
                
            </div>
        
        </div>
        <div className="sm:w-2/4 w-full p-5 shadow rounded bg-white flex flex-col gap-3">

            <div className="w-full flex flex-col gap-1 border-b border-gray-300 pb-1">
                <span className="text-base font-bold text-gray-600">Lastest Product</span>
                <p className="text-[12px]">400+ new Items in Trending</p>

            </div>

            <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center border-b border-gray-300 pb-2">
                    <img src="https://t3.ftcdn.net/jpg/01/38/81/76/360_F_138817681_4FCgB89eGIBi7W7i0g0mPJHsg9ZuZyzU.jpg" alt="product" className="w-[3rem] h-[3rem] rounded-md" />
                    <span>Page layouts look better</span>

                </div>
                <div className="flex gap-2 items-center border-b border-gray-300 pb-2">
                    <img src="data:image/jpeg;base64,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" alt="product" className="w-[3rem] h-[3rem] rounded-md" />
                    <span>Page layouts look better </span>

                </div>
                <div className="flex gap-2 items-center border-b border-gray-300 pb-2">
                    <img src="https://garmentsmerchandising.com/wp-content/uploads/2021/08/linen-fabric-cloth.jpg" alt="product" className="w-[3rem] h-[3rem] rounded-md" />
                    <span>Page layouts look better</span>

                </div>
                
           

            </div>
        
        
        </div>
        <div className="w-1/4 sm:flex hidden flex-col gap-4">
            <div className="w-full bg-[#7460EE] p-5 shadow rounded flex flex-col gap-3 justify-center">
               <h2 className="text-base font-bold text-white">Start Now</h2>
                <p className="text-base text-white leading-7">Offering discounts for online store and earn loyalty Points</p>
                <button className="p-2 bg-white text-[#7460EE] rounded">Join</button>
            </div>

             <div className="w-full bg-[#26C6DA] p-5 shadow rounded flex flex-col gap-3 justify-center">
                <BsFileEarmarkBarGraph className="text-2xl text-white" />
                <span className="text-xl font-bold text-white">Revenue </span>
                <p className="text-sm text-gray-600">19% up for sale</p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
