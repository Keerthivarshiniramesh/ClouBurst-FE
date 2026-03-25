import React, { useState, useContext } from 'react'
import { DContext } from '../../context/Datacontext'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import iot from '../../assets/lora.png'

const Login = () => {

    const { setIsAuth, setCurrentUser, BeURL } = useContext(DContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const HandleLogin = async (e) => {

        e.preventDefault()

        if (email !== "" && password !== "") {
            setLoading(true)
            fetch(`${BeURL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email, password
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setIsAuth(true)
                        setCurrentUser(data.user)
                        setEmail('')
                        setPassword('')
                        window.location.href = "/"
                    } else {
                        alert(data.message)
                        setLoading(false)
                    }
                })
                .catch(err => {
                    alert('Trouble in connecting to the Server! Please try again later.')
                    console.log('Error in Login:', err)
                    setLoading(false)
                })
        }
        else {
            alert("All fields are required!")
        }

    }


    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center px-4'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center   rounded-lg mb-4'>
                        {/* <FiLock className='w-7 h-7 text-white' /> */}
                        <img src={iot} className='w-56 rounded-lg'/>
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
                    <p className='text-gray-600'>Sign in to your Cloudburst account</p>
                </div>

                {/* Form Card */}
                <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
                    <form onSubmit={HandleLogin}>
                        <div className="mb-5">
                            <label htmlFor="InputEmail" className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                            <div className='relative'>
                                <FiMail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                <input
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    required
                                    type="email"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    id="InputEmail"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="InputPassword" className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                            <div className='relative'>
                                <FiLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                <input
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    required
                                    type="password"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    id="InputPassword"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            onClick={HandleLogin}
                            type='submit'
                            disabled={loading}
                            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2'
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            <FiArrowRight className='w-4 h-4' />
                        </button>
                    </form>

                    <div className='mt-6 text-center'>
                        <p className='text-gray-600 text-sm'>
                            Don't have an account?{' '}
                            <a href='/register' className='text-blue-600 font-semibold hover:text-blue-700'>
                                Create one
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

export default Login