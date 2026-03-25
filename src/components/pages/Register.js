import React from 'react'
import { useState, useContext } from 'react';
import { DContext } from '../../context/Datacontext';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import iot from '../../assets/lora.png'

const Register = () => {

    const { setIsAuth, setCurrentUser, BeURL } = useContext(DContext)

    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [comparePassword, setComparePassword] = useState(true)

    const handleRegister = async () => {
        setComparePassword(password === confirmPassword)
        if (name !== "" && email !== "" && contact !== "" && password !== "") {
            if (password === confirmPassword) {
                setLoading(true)
                fetch(`${BeURL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify({ fullname: name, email, contact, password }),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            setIsAuth(true)
                            setCurrentUser(data.user)
                            setName('')
                            setEmail('')
                            setContact('')
                            setPassword('')
                            setConfirmPassword('')
                            window.location.href = "/"
                        } else {
                            alert(data.message)
                            setLoading(false)
                        }
                    })
                    .catch(err => {
                        alert('Trouble in connecting to the Server! Please try again later.')
                        console.log('Error in Register: ' + err)
                        setLoading(false)
                    })
            } else {
                alert('Passwords do not match!')
            }
        }
        else {
            alert("All fields are required!")
        }
    }


    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center px-4 py-8'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center  rounded-lg mb-4'>
                        {/* <FiUser className='w-7 h-7 text-white' /> */}
                        <img src={iot} className='w-56 rounded-lg' />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h1>
                    <p className='text-gray-600'>Join Cloudburst Monitoring System</p>
                </div>

                {/* Form Card */}
                <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="InputName" className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                            <div className='relative'>
                                <FiUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    id="InputName"
                                    placeholder="Your full name"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="InputContact" className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                            <div className='relative'>
                                <FiPhone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                <input
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    required
                                    type="tel"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    id="InputContact"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="InputEmail" className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                            <div className='relative'>
                                <FiMail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    type="email"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    id="InputEmail"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="InputPassword" className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                            <div className='relative'>
                                <FiLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    type="password"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    id="InputPassword"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="InputConfirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                            <div className='relative'>
                                <FiLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    type="password"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    id="InputConfirmPassword"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {!comparePassword && (
                            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm'>
                                <FiAlertCircle className='w-4 h-4 flex-shrink-0' />
                                <span>Passwords do not match</span>
                            </div>
                        )}

                        <button
                            onClick={handleRegister}
                            type='button'
                            disabled={loading}
                            className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2'
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            <FiArrowRight className='w-4 h-4' />
                        </button>
                    </form>

                    <div className='mt-6 text-center'>
                        <p className='text-gray-600 text-sm'>
                            Already have an account?{' '}
                            <a href='/login' className='text-green-600 font-semibold hover:text-green-700'>
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className='text-center text-gray-600 text-xs mt-6'>
                    Cloudburst Monitoring System © 2024
                </p>
            </div>
        </div>
    )
}

export default Register