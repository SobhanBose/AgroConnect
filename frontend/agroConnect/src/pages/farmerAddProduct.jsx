import { useState } from "react"

export default function AddProduct() {
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        quantity: '',
        harvestDate: '',
        image: null,
    })

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'image') {
            setForm((prev) => ({ ...prev, image: files[0] }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (form.name && form.price && form.description && form.quantity && form.image) {
            console.log(form)
        } else {
            alert('Please fill in all fields.')
        }
    }


    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-5"
            >
                <h2 className="text-3xl font-bold mb-4 text-left w-full">Add New Product</h2>

                <div>
                    <label className="block text-sm font-medium">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Fresh Tomatoes"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Quantity (kg/units)</label>
                        <input
                            type="number"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Harvest Date</label>
                        <input
                            type="date"
                            name="harvestDate"
                            value={form.harvestDate}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Write a short description of the product..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Upload Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full mt-1 border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
                >
                    Add Product
                </button>
            </form>
        </>
    )
}