import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import OTPInput from 'react-otp-input';
import useFetchAppData from '../../hooks/useFetchAppData';
import toast from 'react-hot-toast';

function AccountSiginModal() {
    const { register, getValues, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onChange" });
    const { authApi, getConnectedAccounts } = useFetchAppData();
    const [flag, setFlag] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [otp, setOtp] = useState("");
    const [loginData, setLoginData] = useState({});
    const [submit, setSubmit] = useState(false);

    const setPopup = () => {
        if (toggle) {
            const conf = confirm("Are you sure do you want cancel login?")
            if (conf.valueOf()) {
                setFlag(!flag)
                toggleOTP();
                setOtp("")
                reset()
            }

        } else {
            setFlag(!flag)
            reset()
        }
    }
    const toggleOTP = () => setToggle(!toggle)

    const onSubmit = (isOTP) => {
        setSubmit(true)
        if (isOTP && otp != "" && otp.length === 6) {
            console.log({
                email: loginData?.email,
                id:loginData.id,
                otp
            })
            authApi.post("/account/submit-otp", {
                email: loginData?.email,
                id:loginData.id,
                otp
            }).then(res => {
                if (res.data?.success) {
                    setPopup()
                    location.reload()
                    // setTimeout(()=>{
                    //     getConnectedAccounts((err)=>{toast.error(err)})
                    // },5000)
                }
            }).catch(err => {
                toast.error(err.response?.data?.message||err?.message||"An error occured while login")
                console.log("an error occured", err.message)
            })
        } else {
            const { email, password } = getValues();
            authApi.post("/account/add", { email, password }).then(res => {
                if (res.data?.success && res.data?.isOtpSent) {
                    setLoginData(res.data);
                    toggleOTP()
                } else if (res.data?.success || res.data?.isLoggedIn) {
                    setPopup()
                    // setTimeout(()=>{
                    location.reload()
                        // getConnectedAccounts((err)=>{console.log(err)})
                    // }, 5000 )
                }
            }).catch(err => {
                toast.error(err.response?.data?.message|| err?.message || "an error occured, try again later")
            });
        }
        setSubmit(false)
    }

    return (
        <>
            <button onClick={setPopup} className="border border-gray-300 py-2 px-4 rounded-lg">Link account</button>
            <div id="POPUP" className={`${flag ? "" : "hidden"} z-50 fixed flex w-full justify-center inset-0 `}>
                <div onClick={setPopup} className="w-full h-full bg-transparent z-0 inset-0 " />
                <div id="authentication-modal" className={` h-full animate-slideleft w-1/3`}>
                    <div className="mx-auto container h-full px-4">
                        <div className="bg-white rounded-lg shadow h-full">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                                <h3 className="text-xl font-semibold text-gray-900 ">
                                    {toggle ? "Submit OTP" : "Sign in to your Linkedin Account"}
                                </h3>
                                <button type="button" onClick={setPopup} className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center ">
                                <i className='fas fa-light fa-xmark fa-lg'></i>
                                </button>
                            </div>
                            <div className="p-4 md:p-5 flex flex-1 content-center justify-center items-center w-full h-2/3">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full" action="#">
                                    {!toggle &&
                                        (<div className='flex flex-col space-y-3'>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900  ">Your email</label>
                                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@company.com" required
                                                    {...register("email", {
                                                        required: true,
                                                    })}
                                                />
                                                {errors?.email?.type === "required" && <span className=' text-rose-600'>*Required</span>}
                                            </div>
                                            <div>
                                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900  ">Your password</label>
                                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required
                                                    {...register("password", {
                                                        required: true,
                                                    })}
                                                />
                                                {errors?.password?.type === "required" && <span className=' text-rose-600'>*Required</span>}
                                            </div>

                                            <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Login to your account</button>
                                        </div>
                                        )}
                                    {toggle &&
                                        (<div>
                                            <div className=' pb-8'>
                                                <OTPInput
                                                    value={otp}
                                                    onChange={setOtp}
                                                    numInputs={6}
                                                    // inputStyle={{ "width": "3em", "height": "4em", "fontSize": "1.125rem", "lineHeight": "1.75rem", "color": "#111827", "backgroundColor": "#ffffff", "borderRadius": "0.75rem", "borderWidth": "1px", "borderColor": "#E5E7EB", "outlineStyle": "none", "-moz-appearance": "textfield" }}
                                                    inputStyle={"w-12 h-14 flex flex-col items-center justify-center text-center px-4 outline-none rounded-xl border bg-gray-100 border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}
                                                    containerStyle={"space-x-2 w-full justify-center"}
                                                    // renderSeparator={<span>-</span>}
                                                    inputType="number"
                                                    renderInput={(props) => <input  {...props} />}
                                                    skipDefaultStyles
                                                />
                                            </div>
                                            <button disabled={otp.length !== 6} onClick={() => onSubmit(toggle)} type="button" className={`${otp.length !== 6 && " disabled:bg-blue-300"} w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>Submit OTP</button>
                                        </div>

                                        )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountSiginModal