import { useState } from "react";
import { useUser } from "../context/context";
import FullScreenLoader from "../components/fullScreenLoader";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

export default function AddProduct() {
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const [form, setForm] = useState({
        name: '',
        description: '',
        image: '',
        tag: 'Organic',  // Default tag set to 'Organic'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        setLoading(true);
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
                    'tag': form.tag,  // Send the selected tag
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Product Added Successfully !!!");
                console.log('ok');
            } else {
                toast.error('Something went wrong!');
                console.error('Failed to add product:', data);
            }
        } catch (error) {
            toast.error('Something went wrong!');
            console.error('Error:', error);
        }
        setLoading(false);
        e.target.reset();
    };

    return (
        <>
            <FullScreenLoader show={loading} />
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

                <div>
                    <label className="block text-sm font-medium">Select Tag</label>
                    <select
                        name="tag"
                        value={form.tag}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="All">All</option>
                        <option value="Vegetable">Vegetable</option>
                        <option value="Fruit">Fruit</option>
                        <option value="Organic">Organic</option>
                        <option value="Dairy">Dairy</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
                >
                    Add Product
                </button>
                <br />

                <Link to={'../addProductBot'} className="bg-green-600 shadow-2xl shadow-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer">Chat With AI To Add Products</Link>
            </form>
        </>
    );
}
