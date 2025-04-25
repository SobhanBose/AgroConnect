import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/context';
import FullScreenLoader from "../components/fullScreenLoader";
import { toast } from 'react-toastify'

export default function Login(){
    const [show, setShow] = useState(false);
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [wrong, setWrong] = useState(false);
    const [verified, setVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser();

    const  handleSendOtp = async (e) => {
        setShow(true);
        e.preventDefault();
        console.log('Phone:', phone, 'Role:', role);

        try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/auth/request-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone_no: parseInt(phone) }), // send the phone number
            });
    
            const data = await res.json();
    
            if (res.ok) {
                toast.success("OTP Sent Successfully!!!")
                setOtpSent(true);
                console.log('OTP Sent:', data);
            } else {
                toast.error('Something went wrong!');
                setWrong(true);
                console.error('Failed to send OTP:', data);
            }
        } catch (error) {
            toast.error('Something went wrong!');
            setWrong(true);
            console.error('Error:', error);
        }
        setShow(false);
    };

    const  handleVerifyOtp = async (e) => {
        setShow(true);
        e.preventDefault();
        console.log('otp', otp);

        try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone_no: parseInt(phone), otp: parseInt(otp) }), // send the phone number
            });
    
            const data = await res.json();
    
            if (res.ok) {
                toast.success("Logged In Successfully!!!");
                setUser({ phone, role });
                if(role === 'farmer'){
                    navigate('../farmer/editFarmerProfile')
                }
                else{
                    navigate('../consumer/editConsumerProfile')
                }
                setVerified(true);


            } else {
                toast.error('Something went wrong!');
                setWrong(true);
                console.error('Failed to send OTP:', data);
            }
        } catch (error) {
            toast.error('Something went wrong!');
            setWrong(true);
            console.error('Error:', error);
        }
        setShow(false);
    };

    const  handleResendOtp = async (e) => {
        setShow(true);
        e.preventDefault();

        try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/auth/register/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone_no: parseInt(phone)}), // send the phone number
            });
    
            const data = await res.json();
    
            if (res.ok) {
                
                toast.success("OTP Resent Successfully!!!");

            } else {
                toast.error('Something went wrong!');
                setWrong(true);
                console.error('Failed to send OTP:', data);
            }
        } catch (error) {
            toast.error('Something went wrong!');
            setWrong(true);
            console.error('Error:', error);
        }
        setShow(false);
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center px-4 bg-green-50">
            <FullScreenLoader show={show} />
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
                                        <option value="consumer">Consumer</option>
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
                            <form onSubmit={handleVerifyOtp} className="space-y-5">
                                {/* OTP field */}
                                <div>
                                    <label className="block text-left text-sm font-medium text-gray-700 mb-1 py-1">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
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
                                    onClick={handleResendOtp}
                                    type="button"
                                    className="block mx-auto text-sm bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded-md transition duration-200"
                                >
                                    Resend OTP
                                </button>
                                </form>

                            </>

                        )
                        
                    }
                    <p className='text-sm text-center mt-3'>Don't have an account ? <Link className='text-blue-600 text-sm font-medium' to='../register'>Create Account</Link></p>

                
            </div>
        </div>
    );
};