export default function OrderDetails() {

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


    const productName = 'Chilli';
    const price = 45;
    const quantity = 2;
    const lat = 25.5941;
    const long = 85.1376;
    const totalPrice = quantity * price;



    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
            <h1 className="text-3xl font-bold mb-4 text-left w-full">Order Details</h1>

            {/* Order Info */}
            <div className="flex flex-col gap-4 text-gray-700">
                <div>
                    <p className="font-medium">Product Name:</p>
                    <p className="text-2xl font-bold">{productName}</p>
                </div>

                <div>
                    <p className="font-medium">Price:</p>
                    <p className="text-2xl font-bold">${price.toFixed(2)}</p>
                </div>

                <div>
                    <p className="font-medium">Quantity:</p>
                    <p className="text-2xl font-bold">{quantity}</p>
                </div>

                <div>
                    <p className="font-medium">Total Price:</p>
                    <p className="text-green-600 text-2xl font-bold">${totalPrice.toFixed(2)}</p>
                </div>

                <div className="col-span-2">
                    <p className="font-medium">Customer Coordinates:</p>
                    <p className="text-2xl font-bold"><span className="text-xl font-normal">Latitude: </span>{lat}</p>
                    <p className="text-2xl font-bold"><span className="text-xl font-normal">Longitude: </span>{long}</p>
                </div>
            </div>

            {/* Google Map Embed */}
            <div className="w-full h-72">
                <MapEmbed lat={lat} lng={long} />
            </div>
        </div>
    );
}