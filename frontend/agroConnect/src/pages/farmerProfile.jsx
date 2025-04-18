import { useState } from "react";
import FarmerDashboard from "../components/farmerDashboard";
import SideNavbar from "../components/sideNavbar";
import FarmerProduct from "../components/farmerProduct";


export default function FarmerProfile(){

    const [tab, setTab] = useState('Dashboard');

    return (
        <>
            <div className="flex flex-row">
                <SideNavbar setTab={setTab} tab={tab} />
                {tab==='Dashboard' && <FarmerDashboard/>}
                {tab==='My Products' && <FarmerProduct/>}
                
            </div>
        </>

        
    )
}