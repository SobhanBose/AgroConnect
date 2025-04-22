import { useState, useEffect } from "react"
import { useUser } from "../context/context";


export default function AddProduct() {
    const { user } = useUser();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        image: '',
    })

    const handleChange = (e) => {
        const { name, value, files } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${user.phone}/produce/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'name': form.name,
                    'description': form.description,
                    'image_path': form.image,
                    'tag': "Organic"
                })
            });

            const data = await res.json();

            if (res.ok) {
                console.log('ok');
            } else {
                console.error('Failed to fetch profile:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


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
                    <label className="block text-sm font-medium">Give Image URL</label>
                    <input
                        type="url"
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