import React from 'react'
import bearconnectLogo from "../assets/images/brcnt_logo_crp.png" 

function Siginup() {
    return (
        <>
            <div className="h-screen items-center justify-center relative md:flex flex-auto md:w-100 sm:w-auto md:h-full bg-card md:px-14 lg:px-20 xl:px-30 sm:px-30">
                <div className="w-full sm:max-w-70 mx-auto sm:mx-0">
                    <div className="w-40 mb-15">
                        <img src={bearconnectLogo} />
                    </div>
                    <div className="">
                        <div className="mt-15 text-3xl font-extrabold tracking-normal leading-tight text-gray-900">Sign Up</div>
                        <div className="flex items-baseline mt-1 font-medium text-gray-900"><div className="text-secondary mt-2 ng-tns-c218-0">Alredy have an account?</div><a className="ml-1 text-blue-500 hover:underline ng-tns-c218-0" href="/login">Login</a></div>
                        <div className="w-full max-w-xs mt-5">
                            <div className="mb-5">
                                <label className="block text-gray-500 text-sm font-bold mb-2" for="email">
                                    Name
                                </label>
                                <div className='w-full mt-2 rounded-md border-2 border-secondary-muted p-2 px-3 bg-white'>
                                    <input className="w-full appearance-none text-gray-500 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" name='name' placeholder="Full Name" />
                                </div>
                            </div>
                            <div className="mb-5">
                                <label className="block text-gray-500 text-sm font-bold mb-2" for="email">
                                    Email address
                                </label>
                                <div className='w-full mt-2 rounded-md border-2 border-secondary-muted p-2 px-3 bg-white'>
                                    <input className="w-full appearance-none text-gray-500 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" name='email' placeholder="Email" />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-500 text-sm font-bold mb-2" for="password">
                                    Password
                                </label>
                                <div className='w-full mt-2 rounded-md border-2 border-secondary-muted p-2 px-3 bg-white'>
                                    <input className="w-full appearance-none text-gray-500 leading-tight focus:outline-none focus:shadow-outline" id="password" name='password' type="password" placeholder="Password" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <label className="flex items-center">
                                    <input className="mr-2 leading-tight" type="checkbox" />
                                    <span className="text-sm">Remember me</span>
                                </label>
                                <a className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" href="#">
                                    Forgot password?
                                </a>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Siginup