import { Outlet } from "react-router-dom";

import SideNavbarConsumer from "../components/sideNavbarConsumer";


export default function ConsumerProfile(){


    return (
        <>
            <div className="realtive">
                <div className="fixed left-0 top-16 z-10">
                <SideNavbarConsumer/>
                </div>
                <div className="z-0 ml-20 h-[calc(100vh-64px)] overflow-scroll pt-5 flex justify-center">
                <Outlet />
                </div>
                
                
            </div>
        </>

        
    )
}