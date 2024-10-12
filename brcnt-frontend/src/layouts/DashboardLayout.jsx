import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import bearLogo from "../assets/images/only_bear_logo.png"
import useFetchAppData from '../hooks/useFetchAppData';
import toast from 'react-hot-toast';

function DashboardLayout() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { getConnectedAccounts, getConversations, isLoading } = useFetchAppData();
    
    useEffect(() => {
        if (location.pathname.includes("linkedin-accounts")) {
            console.log("in account repeats")
            getConnectedAccounts((err) => toast.error(err || "error occured while fetching linked accounts"))
        }
        if (location.pathname.includes("inbox")) {
            getConversations((err)=> toast.error(err || "Error while getting conversations"))
            // dispatch(unibox.setChats(convo.convs))
            // dispatch(unibox.setPaginations(convo.paging))
        }
    }, [location.pathname, dispatch]);
    return (
        <>
            <div className='w-full h-screen flex'>
                <div className=' w-1/12 h-full overflow-y-hidden z-20 bg-br-theme'>
                    <div className="mt-2 flex flex-col items-center mx-auto w-16 h-full overflow-hidden gap-y-1">
                        <a className="mb-12 w-14 h-11 text-slate-50">
                            <img alt="Company Logo" src={bearLogo} /></a>
                        <a customtemplatetooltip="" tooltipposition="end" className={`relative flex items-center justify-center w-12 h-12 rounded-md bg-main-background opacity-80 hover:opacity-100 hover:bg-selected ng-star-inserted`} href="/app/dashboard">
                            <div className="text-slate-50 ng-star-inserted"><span><svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
                                <path d="M16 8L10.5657 13.4343C10.3677 13.6323 10.2687 13.7313 10.1545 13.7684C10.0541 13.8011 9.94591 13.8011 9.84549 13.7684C9.73133 13.7313 9.63232 13.6323 9.43431 13.4343L7.56569 11.5657C7.36768 11.3677 7.26867 11.2687 7.15451 11.2316C7.05409 11.1989 6.94591 11.1989 6.84549 11.2316C6.73133 11.2687 6.63232 11.3677 6.43431 11.5657L2 16M16 8H12M16 8V12M6.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H6.8C5.11984 2 4.27976 2 3.63803 2.32698C3.07354 2.6146 2.6146 3.07354 2.32698 3.63803C2 4.27976 2 5.11984 2 6.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            </span>
                            </div>
                        </a>
                        <a customtemplatetooltip="" tooltipposition="end" className={`relative flex items-center justify-center w-12 h-12 rounded-md ${location.pathname.includes("app/linkedin-accounts") ? " bg-[#6a3c9b]" : "bg-main-background"} opacity-80 hover:opacity-100 hover:bg-selected ng-star-inserted`} href="/app/linkedin-accounts">
                            <div className=" text-slate-50 ng-star-inserted">
                                <span>
                                    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.4428 19.9712H4.6568C3.95795 19.9688 3.288 19.6929 2.79114 19.203C2.29428 18.7131 2.01024 18.0484 2.00016 17.3518V4.68657C1.99634 4.33593 2.06218 3.98801 2.19386 3.66285C2.32554 3.3377 2.52047 3.04173 2.76742 2.792C3.01436 2.54227 3.30844 2.34372 3.63271 2.20779C3.95698 2.07187 4.30503 2.00125 4.6568 2H17.3336C17.6862 1.99998 18.0352 2.06967 18.3606 2.20503C18.686 2.34039 18.9812 2.53874 19.2292 2.7886C19.4772 3.03845 19.673 3.33485 19.8052 3.66064C19.9375 3.98642 20.0037 4.33513 19.9998 4.68657V17.3518C19.9973 18.055 19.7153 18.7286 19.2155 19.2249C18.7158 19.7213 18.0391 20 17.3336 20H11.4428" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M7 15V9" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M10 15V11.24C10 10.6459 10.2634 10.0762 10.7322 9.65608C11.2011 9.236 11.837 9 12.5 9C13.163 9 13.7989 9.236 14.2678 9.65608C14.7366 10.0762 15 10.6459 15 11.24V15" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M10 15V9" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M7 7C7.55228 7 8 6.55228 8 6C8 5.44772 7.55228 5 7 5C6.44772 5 6 5.44772 6 6C6 6.55228 6.44772 7 7 7Z" className="fill-current"></path>
                                    </svg>
                                </span>
                            </div>
                        </a>
                        <a customtemplatetooltip="" tooltipposition="end" className={`relative flex items-center justify-center w-12 h-12 rounded-md bg-main-background opacity-80 hover:opacity-100 hover:bg-selected ng-star-inserted`} href="/app/leads">
                            <div className="text-slate-50 ng-star-inserted">
                                <span>
                                    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.1079 11.7017C11.0449 11.6927 10.9639 11.6927 10.8919 11.7017C9.30785 11.6477 8.04785 10.3517 8.04785 8.75865C8.04785 7.12964 9.36185 5.80664 10.9999 5.80664C12.6289 5.80664 13.9519 7.12964 13.9519 8.75865C13.9429 10.3517 12.6919 11.6477 11.1079 11.7017Z" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M17.0661 17.6423C15.4641 19.1093 13.3401 20.0003 11.0001 20.0003C8.66008 20.0003 6.53608 19.1093 4.93408 17.6423C5.02408 16.7963 5.56408 15.9683 6.52708 15.3203C8.99308 13.6823 13.0251 13.6823 15.4731 15.3203C16.4361 15.9683 16.9761 16.7963 17.0661 17.6423Z" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M11 20.0001C15.9706 20.0001 20 15.9706 20 11C20 6.02945 15.9706 2 11 2C6.02944 2 2 6.02945 2 11C2 15.9706 6.02944 20.0001 11 20.0001Z" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
                            </div>
                        </a>
                        <a customtemplatetooltip="" tooltipposition="end" className={`relative flex items-center justify-center w-12 h-12 rounded-md bg-main-background opacity-80 hover:opacity-100 hover:bg-selected ng-star-inserted`} href="/app/my-network"><div className="text-slate-50 ng-star-inserted"><span><svg className="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2">
                            <path d="M16.96 6.17C18.96 7.56 20.34 9.77 20.62 12.32"></path>
                            <path d="M3.48999 12.37C3.74999 9.83 5.10999 7.62 7.08999 6.22"></path>
                            <path d="M8.19 20.94C9.35 21.53 10.67 21.86 12.06 21.86C13.4 21.86 14.66 21.56 15.79 21.01"></path>
                            <path d="M12.06 7.7C13.5954 7.7 14.84 6.45535 14.84 4.92C14.84 3.38465 13.5954 2.14 12.06 2.14C10.5247 2.14 9.28003 3.38465 9.28003 4.92C9.28003 6.45535 10.5247 7.7 12.06 7.7Z"></path>
                            <path d="M4.82999 19.92C6.36534 19.92 7.60999 18.6754 7.60999 17.14C7.60999 15.6046 6.36534 14.36 4.82999 14.36C3.29464 14.36 2.04999 15.6046 2.04999 17.14C2.04999 18.6754 3.29464 19.92 4.82999 19.92Z"></path>
                            <path d="M19.17 19.92C20.7054 19.92 21.95 18.6754 21.95 17.14C21.95 15.6046 20.7054 14.36 19.17 14.36C17.6347 14.36 16.39 15.6046 16.39 17.14C16.39 18.6754 17.6347 19.92 19.17 19.92Z"></path>
                        </svg>
                        </span>
                        </div>
                        </a>
                        <a customtemplatetooltip="" tooltipposition="end" className={`relative flex items-center justify-center w-12 h-12 rounded-md bg-main-background opacity-80 hover:opacity-100 hover:bg-selected ng-star-inserted`} href="/app/campaigns">
                            <div className="text-slate-50 ng-star-inserted">
                                <span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-current">
                                        <path d="M7.39999 6.32L15.89 3.49C19.7 2.22 21.77 4.3 20.51 8.11L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23 7.39999 6.32Z"></path>
                                        <path d="M10.11 13.65L13.69 10.06"></path>
                                    </svg>
                                </span>
                            </div>
                        </a>
                        <a customtemplatetooltip="" tooltipposition="end" className={`relative flex items-center justify-center w-12 h-12 rounded-md ${location.pathname.includes("app/inbox") ? " bg-[#6a3c9b]" : "bg-main-background"} opacity-80 hover:opacity-100 hover:bg-selected bg-selected ng-star-inserted`} href="/app/inbox">
                            <div className="text-slate-50 ng-star-inserted">
                                <span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" className="stroke-current">
                                        <path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" strokeWidth="2" strokeMiterlimit="10"></path>
                                        <path d="M16.982 11H17.018" strokeWidth="3"></path>
                                        <path d="M11.991 11H12.009" strokeWidth="3"></path>
                                        <path d="M6.99103 11H7.00903" strokeWidth="3"></path>
                                    </svg>
                                </span>
                            </div>
                        </a>
                        <div style={{ "marginTop": "225px" }}>
                            <div className="flex items-center justify-center w-12 h-12 rounded-md">

                            </div>
                        </div>
                    </div>
                </div>
                <div className=' w-11/12 bg-slate-100'>

                    <Outlet context={isLoading} ></Outlet>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout