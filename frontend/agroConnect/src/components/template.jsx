import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function Template(){
    return(
        <div>
            <Header/>
            <div className="mt-16">
            <Outlet/>
            </div>
            
        </div>
    )
}