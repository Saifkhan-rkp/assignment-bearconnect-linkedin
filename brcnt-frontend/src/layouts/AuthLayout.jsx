import React from 'react'
import { Outlet } from 'react-router-dom'

function AuthLayout() {
    return (
        <>
            <div className="flex flex-col flex-auto w-full bg-white">
                <div className='flex flex-col flex-auto'>
                    <div className="flex flex-col sm:flex-row sm:h-screen md:h-full items-center xl:overflow-hidden h-full justify-center flex-auto min-w-0">
                        <Outlet></Outlet>
                        <div className='relative hidden md:flex flex-auto h-screen md:w-1/2 md:pt-8 lg:pt-7 p-16 lg:px-15 md:px-6 xl:pt-15 overflow-hidden bg-cover bg-no-repeat items-center justify-center'>
                            <div className="bg-gradient-to-r from-purple-800 to-red-500 p-8 text-white flex flex-col justify-center">
                                <h2 className="text-3xl font-bold mb-6">You are joining a movement!</h2>
                                <div className="flex justify-between mb-6">
                                    <div className="text-center">
                                        <i className="fas fa-users text-2xl mb-2"></i>
                                        <p className="text-xl font-bold">4550+</p>
                                        <p>Satisfied Users</p>
                                    </div>
                                    <div className="text-center">
                                        <i className="fas fa-handshake text-2xl mb-2"></i>
                                        <p className="text-xl font-bold">2000+</p>
                                        <p>Community members</p>
                                    </div>
                                    <div className="text-center">
                                        <i className="fas fa-shield-alt text-2xl mb-2"></i>
                                        <p className="text-xl font-bold">100%</p>
                                        <p>Safety guarantee</p>
                                    </div>
                                    <div className="text-center">
                                        <i className="fas fa-rocket text-2xl mb-2"></i>
                                        <p className="text-xl font-bold">4.2x</p>
                                        <p>Avg. revenue growth</p>
                                    </div>
                                </div>
                                <div className="bg-white bg-opacity-10 p-6 rounded-lg mb-6">
                                    <div className="flex items-center mb-4">
                                        <img src="https://placehold.co/50x50" alt="Stepward logo" className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <h3 className="text-xl font-bold">Stepward</h3>
                                            <div className="flex">
                                                <i className="fas fa-star text-yellow-400"></i>
                                                <i className="fas fa-star text-yellow-400"></i>
                                                <i className="fas fa-star text-yellow-400"></i>
                                                <i className="fas fa-star text-yellow-400"></i>
                                                <i className="fas fa-star text-yellow-400"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-4">HeyReach has enabled us to deploy outbound prospecting campaigns quickly, easily, and securely. It's simple: we used to spend hours configuring the automation tools on over 200 MirrorProfiles Linkedin accounts. Now, in just a few minutes with HeyReach, it's done!</p>
                                    <div className="flex justify-between mb-4">
                                        <div className="text-center">
                                            <p className="text-lg font-bold">Acceptance Rate</p>
                                            <p>56.59%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold">Accounts Connected</p>
                                            <p>200+</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold">Reply Rate</p>
                                            <p>23.40%</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img src="https://placehold.co/50x50" alt="Fred Duhrel" className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <p className="font-bold">Fred Duhrel</p>
                                            <p>Co-Founder @ Stepward</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <img src="https://placehold.co/50x50" alt="Leoron logo" className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <h3 className="text-xl font-bold">Leoron</h3>
                                            <div className="flex">
                                                <i className="fas fa-star text-yellow-400"></i>
                                                <i className="fas fa-star text-yellow-400"></i>
                                                <i className="fas fa-star text-yellow-400"></i>
                                                <i className="fas fa-star text-yellow-400"></i>
                                                <i className="fas fa-star text-yellow-400"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-4">I've been using HeyReach for 6+ months, and out of 8000 contacted people I closed 8 deals, bringing $32K in revenue. Would recommend it 10/10!</p>
                                    <div className="flex justify-between mb-4">
                                        <div className="text-center">
                                            <p className="text-lg font-bold">Acceptance Rate</p>
                                            <p>33%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold">Meetings Booked</p>
                                            <p>30</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold">Reply Rate</p>
                                            <p>21%</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img src="https://placehold.co/50x50" alt="Nenad Janevski" className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <p className="font-bold">Nenad Janevski</p>
                                            <p>International Professional Development Consultant @ Leoron</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}

export default AuthLayout