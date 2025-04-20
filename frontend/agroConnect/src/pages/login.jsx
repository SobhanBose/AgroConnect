import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login(){
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [otpSent, setOtpSent] = useState(true);
    const [verified, setVerified] = useState(false);
    const [otp, setOtp] = useState('');

    const handleSendOtp = (e) => {
        e.preventDefault();
        console.log('Phone:', phone, 'Role:', role);
        
        // const res = await fetch('end_point');
        // if (res.ok) {
        //     setOtpSent(true);
        // }else{

        // }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        console.log('OTP', otp);
        // Call your backend OTP API here
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center px-4 bg-green-50">
            <div className="w-full sm:w-3/6 bg-cyan-50 p-6 rounded-2xl shadow-2xl">
                <h2 className="text-4xl font-bold text-center text-green-700 mb-6">Login</h2>

                
                    {
                        !otpSent ? (
                            <>
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                {/* Phone Number */}
                                <div>
                                    <label className="block text-left text-sm font-medium text-gray-700 mb-1 py-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter your mobile number"
                                    />
                                </div>

                                {/* Role Selection */}
                                <div>
                                    <label className="block text-left text-sm font-medium text-gray-700 mb-1 py-1">Select Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">-- Choose Role --</option>
                                        <option value="farmer">Farmer</option>
                                        <option value="consumer">Consumer/Retailer</option>
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white font-semibold px-4 py-2 rounded-md transition duration-200"
                                >
                                    Send OTP
                                </button>
                                </form>
                            </>
                        ) : (
                            <>
                            <form onSubmit={handleSendOtp} className="space-y-5">
                                {/* OTP field */}
                                <div>
                                    <label className="block text-left text-sm font-medium text-gray-700 mb-1 py-1">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setotp(e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter the OTP"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white font-semibold px-4 py-2 rounded-md transition duration-200"
                                >
                                    Verify OTP
                                </button>
                                <button
                                    type="submit"
                                    className="block mx-auto text-sm bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded-md transition duration-200"
                                >
                                    Resend OTP
                                </button>
                                </form>

                            {
                                !verified && <p className='text-red-600 text-center my-3'>Something Went Wrong !!! Try Again</p>
                            }
                            </>

                        )
                        
                    }
                    <p className='text-sm text-center mt-3'>Don't have an account ? <Link className='text-blue-600 text-sm font-medium' to='../register'>Create Account</Link></p>

                
            </div>
        </div>
    );
};