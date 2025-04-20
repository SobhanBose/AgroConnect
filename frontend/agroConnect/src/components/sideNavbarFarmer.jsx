import { useState } from "react";
import { NavLink } from "react-router-dom";

import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";
import { IoIosAddCircle } from "react-icons/io";
import { IoMdCart } from "react-icons/io";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { RiDashboardLine } from "react-icons/ri";

export default function sideNavbarFarmer() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: <RiDashboardLine className="w-6 h-6 shrink-0" />, label: "Dashboard", link: "dashboard" },
        { icon: <GiFruitBowl className="w-6 h-6 shrink-0" />, label: "My Products", link: "products" },
        { icon: <IoIosAddCircle className="w-6 h-6 shrink-0" />, label: "Add Products", link: "addProduct" },
        { icon: <IoMdCart className="w-6 h-6 shrink-0" />, label: "Orders", link: "orders" },
    ];

    return (
        <div
            className={`relative h-[calc(100vh-64px)] overflow-y-auto bg-green-600 text-white ${isOpen ? "w-64" : "w-20"
                } transition-all duration-300 ease-in-out p-5 pt-20 rounded-tr-2xl rounded-br-2xl no-scrollbar flex flex-col justify-between`}
        >

            <button
                className="absolute top-5 right-2 text-3xl text-white cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <FaArrowAltCircleLeft className="w-10 h-10 shrink-0" />
                ) : (
                    <FaArrowAltCircleRight className="w-10 h-10 shrink-0" />
                )}
            </button>


            <div>
                {isOpen && (
                    <>
                        <h2 className="m-0 text-3xl font-bold mb-2 whitespace-nowrap">My Profile,</h2>
                        <h2 className="m-0 text-3xl font-bold mb-6 whitespace-nowrap">John Doe</h2>
                    </>
                )}

                <ul className="space-y-4">
                    {menuItems.map((item, index) => {

                        return (
                            <NavLink key={index} to={item.link} className={({ isActive }) =>
                                isActive
                                    ? "bg-green-800 font-semibold group flex items-center gap-4 text-2xl p-3 rounded-2xl cursor-pointer transition-all duration-100"
                                    : "hover:bg-green-700 group flex items-center gap-4 text-2xl p-3 rounded-2xl cursor-pointer transition-all duration-100"}>
                                <li className="flex items-center gap-4">
                                    <span className="w-6 h-6 shrink-0">{item.icon}</span>
                                    {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                                </li></NavLink>
                        );
                    })}
                </ul>
            </div>


            <div>
                <li className="flex items-center gap-4 text-2xl p-3 hover:bg-green-700 rounded-2xl cursor-pointer transition-colors duration-200">
                    <CiLogout className="w-6 h-6 shrink-0" />
                    {isOpen && <span className="whitespace-nowrap">Logout</span>}
                </li>
            </div>
        </div>
    );

}
