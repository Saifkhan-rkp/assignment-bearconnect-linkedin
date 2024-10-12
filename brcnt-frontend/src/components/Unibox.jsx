import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useFetchAppData from '../hooks/useFetchAppData';
import { getTimeDifference } from '../utils/utils';
import ConversationBox from './chats/ConversationBox';
import bearconnectLogo from '../assets/images/brcnt_logo_crp.png';
import LoaderMini from './loaders/LoaderMini';
import { useOutletContext } from 'react-router-dom';

function Unibox() {
    const isLoading = useOutletContext()
    const dispatch = useDispatch();
    const { unibox } = useFetchAppData()
    const { chats, conversation } = useSelector(state => state.unibox)

    return (
        <>
            {/* Main Content */}
            <div className="flex-1 h-full p-6">
                {/* Header */}
                <h1 className="text-2xl font-bold p-4 mb-6">Unibox</h1>
                {/* <div className="bg-white p-4 shadow">
                    <h1 className="text-xl font-bold">Unibox</h1>
                </div> */}
                {/* <div className='flex flex-wrap h-full px-8 w-full'> */}
                <div className="flex flex-auto rounded-xl shadow bg-white mb-6 w-full h-5/6">
                    {/* Left Panel */}
                    <div className="flex flex-auto flex-col w-1/4 min-w-100 max-w-100 bg-white border-r-2 border-pale rounded-l-lg">
                        <div className=" flex flex-col mb-4 border-b border-slate-800 mt-12">
                            <div className="flex mx-6 flex-wrap -mb-px text-center" style={{ height: "47px" }}>
                                <button className="font-semibold text-md tracking-wide flex items-center cursor-pointer px-2 py-2 mr-6 border-b-2 select-none border-blue-500 text-blue-500 hover:text-blue-600">All Messages</button>
                                <button className="font-semibold text-md tracking-wide flex items-center cursor-pointer px-2 py-2 mr-6 border-transparent border-b-2 select-none border-blue-500 text-blue-500 hover:text-blue-600 disabled:text-gray-500" disabled>Unread</button>
                            </div>
                        </div>
                        <div className="px-4 py-2 flex items-center justify-between pr-3 pb-2.5 bg-white">
                            <input type="text" placeholder="Search leads" className="w-full p-2 border rounded" />
                            <button heyreachbutton="" buttontype="icon" className="border-2 h-11 border-pale color-secondary relative flex px-3 py-1 justify-center items-center gap-[10px] rounded-lg text-nowrap opacity-100 hover:opacity-80 cursor-pointer"> <i className='fas fa-light fa-filter'></i></button>
                        </div>
                        <div className="py-1 px-1 border-bottom text-left flex justify-between">
                            <input type="checkbox" className="flex font-bold align-items-center ml-1.5" />
                            <span>Select All</span>
                        </div>
                        <div className="flex-auto overflow-y-auto overflow-x-hidden bg-white rounded-bl-lg">
                            {isLoading && <LoaderMini />}
                            {
                                chats?.map(con => {
                                    const imageUrl = con?.correspondentProfile?.imageUrl?.rootUrl ?
                                        `${con?.correspondentProfile?.imageUrl?.rootUrl}${con?.correspondentProfile?.imageUrl?.artifacts[0]?.fileIdentifyingUrlPathSegment}` :
                                        `https://ui-avatars.com/api/?size=40&name=${con?.correspondentProfile?.firstName + "+" + con?.correspondentProfile?.lastName}&background=random`;
                                    let imageUrlLi = con.linkedinAccount?.account.linkedInUserProfile.imageUrl || {};
                                    imageUrlLi = imageUrlLi?.rootUrl ?
                                        `${imageUrlLi?.rootUrl}${imageUrlLi?.artifacts[0]?.fileIdentifyingUrlPathSegment}` :
                                        `https://ui-avatars.com/api/?size=40&name=${con.linkedinAccount?.account.linkedInUserProfile.firstName + "+" + con.linkedinAccount?.account.linkedInUserProfile.lastName}&background=random`;
                                    return (
                                        <div className={`flex h-1/5 cursor-pointer border-b ${con?.id === conversation?.urn ? "bg-slate-200" : ""}`} key={con.id}>
                                            <div className='flex items-center pb-2 pt-2 px-5 justify-between w-4/5'>
                                                <div className='relative flex flex-0 items-center justify-start'>
                                                    <input type="checkbox" className="relative top-0 w-5 h-5" />
                                                    <img src={imageUrl} alt="Profile" className="rounded-full ml-2 w-10 h-10" />
                                                </div>
                                                <div className='min-w-0 ml-8 w-full self-start' onClick={() => dispatch(
                                                    unibox.setConversationDetail({
                                                        urn: con.id,
                                                        accessId: con.linkedinAccount?._id,
                                                        chattingWith: { ...con.correspondentProfile, imageUrl, },
                                                        chattingFrom: { ...con.linkedinAccount?.account.linkedInUserProfile, imageUrl: imageUrlLi, }
                                                    }))}>
                                                    <div className="flex flex-col font-medium leading-5 truncate"> {con?.correspondentProfile?.firstName + " " + con?.correspondentProfile?.lastName}</div>
                                                    <div className="leading-5 truncate text-secondary">
                                                        <span className="inline-flex items-center ng-star-inserted overflow-hidden">
                                                            <span>{con.lastMessageSender ? "" : "You:"} {con?.lastMessageText}</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 text-secondary">
                                                        <span className="truncate">From: {con.linkedinAccount?.account?.username}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-row pt-2 w-1/5 justify-center">
                                                <div className="text-sm leading-5 text-gray-400 "> {getTimeDifference(con.lastMessageAt)}</div>
                                            </div>
                                        </div>
                                    )
                                })

                            }
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="flex flex-auto w-3/4 rounded-lg">

                        {conversation?.urn ?

                            <ConversationBox />
                            :
                            <div className='justify-center text-center content-center w-full grid grid-flow-col'>
                                <div className=' items-center'>
                                    <img src={bearconnectLogo} className='self-center w-40 place-items-center' />
                                    <p className='h-1 text-2xl text-br-theme self-center'> Start Coversation by Click</p>
                                </div>
                            </div>
                        }


                    </div>
                </div>
            </div>
        </>
    )
}

export default Unibox