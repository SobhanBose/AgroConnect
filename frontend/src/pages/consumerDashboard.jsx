import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { useUser } from "../context/context";
import FullScreenLoader from "../components/fullScreenLoader";


export default function ConsumerDashboard() {

    const { user } = useUser();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmerData = async () => {
            try {
                const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/consumer/${user.phone}`);
                const data = await res.json();
                if (res.ok) {
                    setUserData(data);
                } else {
                    console.error("Failed to fetch farmer data", data);
                }
            } catch (error) {
                console.error("Error fetching farmer data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFarmerData();
    }, []);

    const MapEmbed = ({ lat, lng }) => {
        const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`

        return (
            <div className="w-full h-64 rounded-2xl overflow-hidden shadow">
                <iframe
                    title="Google Map"
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>
        )
    }
    if (loading) return <FullScreenLoader show={loading} />;
    return (
        <>

            <div className="p-6 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4 text-left w-full">Dashboard</h2>
                {
                <>
                <h2 className="text-2xl font-semibold mb-2">Welcome, {userData.first_name} {userData.last_name} 👋</h2>

                    <Link to={'../editConsumerProfile'} className="bg-green-500 p-2 rounded-2xl text-white cursor-pointer mb-2">Edit Profile</Link>
                
                    

                    <div className="flex flex-col gap-4 overflow-scroll">

                    <div className="bg-white shadow-md rounded-2xl p-4">
                            <p className="text-gray-500 text-sm">Phone Number</p>
                            <h3 className="text-xl font-semibold">{userData.phone_no}</h3>
                        </div>

                        <div className="bg-white shadow-md rounded-2xl p-4">
                            <p className="text-gray-500 text-sm">Location</p>
                            <h3 className="text-lg font-medium"></h3>
                            <MapEmbed lat={userData.latitude} lng={userData.longitude} />
                        </div>

                        <div className="bg-white shadow-md rounded-2xl p-4">
                            <p className="text-gray-500 text-sm">Total Orders</p>
                            <h3 className="text-xl font-semibold">{userData.orders}</h3>
                        </div>

                    </div>
                    
                    </>}
            </div>
        </>
    )
}