import { Link } from "react-router-dom"

export default function FarmerDashboard() {

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
    return (
        <>
            <div className="p-6 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4 text-left w-full">Dashboard</h2>

                <h2 className="text-2xl font-semibold mb-2">Welcome, John Doe 👋</h2>

                    <Link to={`../editFarmerProfile/${123}`} className="bg-green-500 p-2 rounded-2xl text-white cursor-pointer mb-2">Edit Profile</Link>
                
                    

                    <div className="flex flex-col gap-4 overflow-scroll">
                    <div className="bg-white shadow-md rounded-2xl p-4">
                            <p className="text-gray-500 text-sm">Phone Number</p>
                            <h3 className="text-xl font-semibold">91233557</h3>
                        </div>
                        
                        <div className="bg-white shadow-md rounded-2xl p-4">
                            <p className="text-gray-500 text-sm">Location</p>
                            <h3 className="text-lg font-medium"></h3>
                            <MapEmbed lat={25.5941} lng={85.1376} />
                        </div>

                        <div className="bg-white shadow-md rounded-2xl p-4">
                            <p className="text-gray-500 text-sm">Total Products</p>
                            <h3 className="text-xl font-semibold">10</h3>
                        </div>

                        <div className="bg-white shadow-md rounded-2xl p-4">
                            <p className="text-gray-500 text-sm">Total Orders</p>
                            <h3 className="text-xl font-semibold">20</h3>
                        </div>

                        <div className="bg-white shadow-md rounded-2xl p-4">
                            <p className="text-gray-500 text-sm">Total Earnings</p>
                            <h3 className="text-xl font-semibold">₹330</h3>
                        </div>

                        <div className="bg-white shadow-md rounded-2xl p-4">
                            <p className="text-gray-500 text-sm">Rating</p>
                            <h3 className="text-xl font-semibold">5 stars</h3>
                        </div>
                    </div>
                
            </div>
        </>
    )
}