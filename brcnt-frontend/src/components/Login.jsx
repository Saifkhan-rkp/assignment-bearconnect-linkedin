import React from 'react'
import bearconnectLogo from "../assets/images/brcnt_logo_crp.png"
import { getAuthData } from '../utils/utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useFetchAppData from '../hooks/useFetchAppData';
import toast from 'react-hot-toast';

function Login() {
    const { authApi } = useFetchAppData();
    const navigate = useNavigate();
    const auth = getAuthData();
    useEffect(() => {
        if (auth?.accessToken) {
            navigate("/app/linkedin-accounts")
        }
    }, [auth])
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ mode: 'onChange' });
    const [isLoading, setLoading] = useState(false);

    const onSubmit = (data) => {
        // let from = '/';
        // console.log(data);
        // mutate(data);
        setLoading(true);
        authApi
            .post(`auth/login`, data)
            .then((res) => {
                setLoading(false);
                if (res.data.success) {
                    toast.success(res.data?.message);
                    const authData = res?.data?.user;
                    localStorage.setItem("auth", JSON.stringify(authData))
                    window.location.reload();
                }
                // if (!res.data.success) {
                //   toast.error(res.data.message);
                // }

            })
            // .then(() => refetch())
            .catch((e) => {
                // console.log(e);
                setLoading(false);
                toast.error(e?.response?.data?.message || e?.message || "Unable to login!");
            });
    };
    return (
        <>
            <div className="h-screen items-center justify-center relative md:flex flex-auto md:w-100 sm:w-auto md:h-full bg-card md:px-14 lg:px-20 xl:px-30 sm:px-30">
                <div className="w-full sm:max-w-70 mx-auto sm:mx-0">
                    <div className="w-40 mb-15">
                        <img src={bearconnectLogo} />
                    </div>
                    <div className="">
                        <div className="mt-15 text-3xl font-extrabold tracking-normal leading-tight text-gray-900">Sign in</div>
                        <div className="flex items-baseline mt-1 font-medium text-gray-900"><div className="text-secondary mt-2 ng-tns-c218-0">Don't have an account?</div><a className="ml-1 text-blue-500 hover:underline ng-tns-c218-0" href="/account/register">Sign up</a></div>
                        <form className="w-full max-w-xs mt-5" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-5">
                                <label className="block text-gray-500 text-sm font-bold mb-2" for="email">
                                    Email address
                                </label>
                                <div className='w-full mt-2 rounded-md border-2 border-secondary-muted p-2 px-3 bg-white'>
                                    <input className="w-full appearance-none text-gray-500 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" name='email' placeholder="Email"
                                        {...register('email', {
                                            required: '*Email Address is required',
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="text-red-600">{errors.email?.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-500 text-sm font-bold mb-2" for="password">
                                    Password
                                </label>
                                <div className='w-full mt-2 rounded-md border-2 border-secondary-muted p-2 px-3 bg-white'>
                                    <input className="w-full appearance-none text-gray-500 leading-tight focus:outline-none focus:shadow-outline" id="password" name='password' type="password" placeholder="Password"
                                        {...register('password', {
                                            required: '*Password is required',
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-red-600">{errors.password?.message}</p>
                                    )}
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
                            <button disabled={isLoading} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login