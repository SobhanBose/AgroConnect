import { useState, useEffect } from "react";
import { useUser } from "../context/context";

export default function EditFarmerProfile() {
  const [location, setLocation] = useState({ lat: null, long: null });
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const { user } = useUser();

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    description: '',
    lat: 'Loading...',
    long: 'Loading...'
  });

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${user.phone}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setData(data);

          setForm((prev) => ({
            ...prev,
            firstname: data.user.first_name || '',
            lastname: data.user.last_name || '',
            description: data.description || '',
          }));
        } else {
          console.error('Failed to fetch profile:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchFarmerData()
  }, []);
  


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/auth/register/update-farmer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'phone_no': user.phone,
            'first_name': form.firstname,
            'last_name': form.lastname,
            'description': form.description
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

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({ lat: latitude, long: longitude });

        // ✅ Update form with coordinates too
        setForm((prev) => ({
          ...prev,
          lat: latitude,
          long: longitude
        }));
      },
      (err) => {
        setError('Failed to retrieve location: ' + err.message);
      }
    );
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-5"
      >
        <h2 className="text-3xl font-bold mb-4 text-left w-full">Edit Profile</h2>

        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., John"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Doe"
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

        {/* Read-only coordinates preview */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <input
              type="text"
              name="lat"
              value={form.lat || ''}
              readOnly
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <input
              type="text"
              name="long"
              value={form.long || ''}
              readOnly
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          Edit Profile
        </button>
      </form>
    </>
  );
}
