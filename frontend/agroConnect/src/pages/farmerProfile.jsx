import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/context";

import SideNavbarFarmer from "../components/sideNavbarFarmer";


export default function FarmerProfile(){
    const {user} = useUser();

    if (!user.phone || user.role !== "farmer") {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <div className="realtive">
                <div className="fixed left-0 top-16 z-10">
                <SideNavbarFarmer/>
                </div>
                <div className="z-0 ml-20 h-[calc(100vh-64px)] overflow-scroll pt-5 flex justify-center">
                <Outlet />
                </div>
                
                
            </div>
        </>

        
    )
}